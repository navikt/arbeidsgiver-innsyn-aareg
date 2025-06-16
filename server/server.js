import path from 'path';
import fetch from 'node-fetch';
import express from 'express';
import mustacheExpress from 'mustache-express';
import httpProxyMiddleware, {
    debugProxyErrorsPlugin,
    errorResponsePlugin,
    proxyEventsPlugin,
    responseInterceptor,
} from 'http-proxy-middleware';
import {createLogger, format, transports} from 'winston';
import jsdom from "jsdom";
import Prometheus from "prom-client";
import require from "./esm-require.js";
import cookieParser from "cookie-parser";
import {applyNotifikasjonMockMiddleware} from "@navikt/arbeidsgiver-notifikasjoner-brukerapi-mock";
import {tokenXMiddleware} from "./tokenx.js";

const apiMetricsMiddleware = require('prometheus-api-metrics');
const {JSDOM} = jsdom;
const {createProxyMiddleware} = httpProxyMiddleware;

const defaultLoginUrl = 'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/arbeidsforhold';

const {
    PORT = 3000,
    NAIS_APP_IMAGE = '?',
    LOGIN_URL = defaultLoginUrl,
    DECORATOR_EXTERNAL_URL = 'https://www.nav.no/dekoratoren/?context=arbeidsgiver&redirectToApp=true&level=Level4',
    NAIS_CLUSTER_NAME = 'local',
    MILJO = 'prod',
    API_GATEWAY = 'http://localhost:8080',
    APIGW_HEADER,
    DECORATOR_UPDATE_MS = 30 * 60 * 1000,
} = process.env;

const log_events_counter = new Prometheus.Counter({
    name: 'logback_events_total',
    help: 'Antall log events fordelt på level',
    labelNames: ['level'],
});
const proxy_events_counter = new Prometheus.Counter({
    name: 'proxy_events_total',
    help: 'Antall proxy events',
    labelNames: ['target', 'proxystatus', 'status', 'errcode'],
});

const maskFormat = format((info) => ({
    ...info,
    message: info.message.replace(/\d{9,}/g, (match) => '*'.repeat(match.length)),
}));

// proxy calls to log.<level> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/get
const log = new Proxy(
    createLogger({
        format: maskFormat(),
        transports: [
            new transports.Console({
                timestamp: true,
                format: format.combine(format.splat(), format.json()),
            }),
        ],
    }),
    {
        get: (_log, level) => {
            return (...args) => {
                log_events_counter.inc({ level: `${level}` });
                return _log[level](...args);
            };
        },
    }
);

const cookieScraperPlugin = (proxyServer, options) => {
    proxyServer.on('proxyReq', (proxyReq, req, res, options) => {
        if (proxyReq.getHeader('cookie')) {
            proxyReq.removeHeader('cookie');
        }
    });
};

// copy with mods from http-proxy-middleware https://github.com/chimurai/http-proxy-middleware/blob/master/src/plugins/default/logger-plugin.ts
const loggerPlugin = (proxyServer, options) => {
    proxyServer.on('error', (err, req, res, target) => {
        const hostname = req?.headers?.host;
        // target is undefined when websocket errors
        const errReference = 'https://nodejs.org/api/errors.html#errors_common_system_errors'; // link to Node Common Systems Errors page
        proxy_events_counter.inc({
            target: target.host,
            proxystatus: null,
            status: res.statusCode,
            errcode: err.code || 'unknown',
        });
        const level =
            /HPE_INVALID/.test(err.code) ||
            ['ECONNRESET', 'ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT'].includes(err.code)
                ? 'warn'
                : 'error';
        log.log(
            level,
            '[HPM] Error occurred while proxying request %s to %s [%s] (%s)',
            `${hostname}${req?.host}${req?.path}`,
            `${target?.href}`,
            err.code || err,
            errReference
        );
    });

    proxyServer.on('proxyRes', (proxyRes, req, res) => {
        const originalUrl = req.originalUrl ?? `${req.baseUrl || ''}${req.url}`;
        const pathUpToSearch = proxyRes.req.path.replace(/\?.*$/, '');
        const exchange = `[HPM] ${req.method} ${originalUrl} -> ${proxyRes.req.protocol}//${proxyRes.req.host}${pathUpToSearch} [${proxyRes.statusCode}]`;
        proxy_events_counter.inc({
            target: proxyRes.req.host,
            proxystatus: proxyRes.statusCode,
            status: res.statusCode,
            errcode: null,
        });
        log.info(exchange);
    });

    /**
     * When client opens WebSocket connection
     */
    proxyServer.on('open', (socket) => {
        log.info('[HPM] Client connected: %o', socket.address());
    });

    /**
     * When client closes WebSocket connection
     */
    proxyServer.on('close', (req, proxySocket, proxyHead) => {
        log.info('[HPM] Client disconnected: %o', proxySocket.address());
    });
};

const BUILD_PATH = path.join(process.cwd(), '../build');

const getDecoratorFragments = async () => {
    const response = await fetch(DECORATOR_EXTERNAL_URL);
    const body = await response.text();
    const {document} = new JSDOM(body).window;
    return {
        HEADER: document.getElementById('header-withmenu').innerHTML,
        FOOTER: document.getElementById('footer-withmenu').innerHTML,
        STYLES: document.getElementById('styles').innerHTML,
        SCRIPTS: document.getElementById('scripts').innerHTML,
        SETTINGS: `<script type="application/javascript">
            window.environment = {
                MILJO: '${NAIS_CLUSTER_NAME}',
            }
        </script>`,
    };
}

const app = express();
app.disable("x-powered-by");
app.engine('html', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', BUILD_PATH);

app.use(cookieParser());


app.use('/*', (req, res, next) => {
    res.setHeader('NAIS_APP_IMAGE', NAIS_APP_IMAGE);
    next();
});

app.use(
    apiMetricsMiddleware({
        metricsPath: '/arbeidsforhold/internal/metrics',
    })
);
const proxyOptions = {
    logger: log,
    secure: true,
    xfwd: true,
    changeOrigin: true,
    ejectPlugins: true,
    plugins: [
        cookieScraperPlugin,
        debugProxyErrorsPlugin,
        errorResponsePlugin,
        loggerPlugin,
        proxyEventsPlugin,
    ],
};

if (MILJO === 'local' || MILJO === 'demo') {
    const {applyNotifikasjonMockMiddleware} = require('@navikt/arbeidsgiver-notifikasjoner-brukerapi-mock');
    applyNotifikasjonMockMiddleware({app, path: '/arbeidsforhold/notifikasjon-bruker-api'});

    // mocks:
    require('./mock/all.cjs').mockAll(app, fetch);
} else {
    app.use(
        '/arbeidsforhold/notifikasjon-bruker-api',
        tokenXMiddleware({
            log: log,
            audience: {
                dev: 'dev-gcp:fager:notifikasjon-bruker-api',
                prod: 'prod-gcp:fager:notifikasjon-bruker-api',
            }[MILJO],
        }),
        createProxyMiddleware({
            ...proxyOptions,
            pathRewrite: { '^/': '' },
            target: 'http://notifikasjon-bruker-api.fager.svc.cluster.local/api/graphql',
        })
    );

    app.use(
        '/arbeidsforhold/arbeidsgiver-arbeidsforhold/api',
        tokenXMiddleware(
            {
                log: log,
                audience: {
                    'dev': 'dev-fss:arbeidsforhold:aareg-innsyn-arbeidsgiver-api',
                    'prod': 'prod-fss:arbeidsforhold:aareg-innsyn-arbeidsgiver-api',
                }[MILJO]
            }),
        createProxyMiddleware({
            ...proxyOptions,
            target: `${API_GATEWAY}/arbeidsgiver-arbeidsforhold-api`,
            ...(APIGW_HEADER ? {headers: {'x-nav-apiKey': APIGW_HEADER}} : {})
        })
    );

    app.use(
        '/arbeidsforhold/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver',
        tokenXMiddleware(
            {
                log: log,
                audience: {
                    'dev': 'dev-gcp:personbruker:arbeidsforhold-api',
                    'prod': 'prod-gcp:personbruker:arbeidsforhold-api',
                }[MILJO]
            }),
        createProxyMiddleware({
            ...proxyOptions,
            target: NAIS_CLUSTER_NAME === 'prod-gcp' ? 'https://www.nav.no/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver' : 'https://www.intern.dev.nav.no/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver',
        })
    );
}

app.use('/arbeidsforhold', express.static(BUILD_PATH, { index: false }));

app.get('/arbeidsforhold/redirect-til-login', (req, res) => {
    res.redirect(LOGIN_URL);
});

app.get('/arbeidsforhold/internal/isAlive', (req, res) =>
    res.sendStatus(200)
);

app.get('/arbeidsforhold/internal/isReady', (req, res) =>
    res.sendStatus(200)
);

const serve = async () => {
    let fragments;
    try {
        fragments = await getDecoratorFragments();
        app.get('/arbeidsforhold/*', (req, res) => {
            res.render('index.html', fragments, (err, html) => {
                if (err) {
                    log.error(err);
                    res.sendStatus(500);
                } else {
                    res.send(html);
                }
            });
        });
        app.listen(PORT, () => {
            log.info('Server listening on port ', PORT);
        });
    } catch (error) {
        log.error('Server failed to start ', error);
        process.exit(1);
    }

    if (MILJO === 'dev' || MILJO === 'prod') {
        const gauge = new Prometheus.Gauge({
            name: 'backend_api_gw',
            help: 'Status til backend via API-Gateway (sonekrysning). up=1, down=0',
        });

        setInterval(async () => {
            try {
                const res = await fetch(`${API_GATEWAY}/arbeidsgiver-arbeidsforhold-api/internal/actuator/health`, {
                    ...(APIGW_HEADER ? {headers: {'x-nav-apiKey': APIGW_HEADER}} : {})
                });
                gauge.set(res.ok ? 1 : 0);
                if (NAIS_CLUSTER_NAME === 'dev-gcp') {
                    log.info(`healthcheck result http code: ${res.statusCode}`)
                }
            } catch (error) {
                log.error(`healthcheck error: ${gauge.name}`, error)
                gauge.set(0);
            }
        }, 60 * 1000);
    }

    setInterval(() => {
        getDecoratorFragments()
            .then(oppdatert => {
                fragments = oppdatert;
                log.info(`dekoratør oppdatert: ${Object.keys(oppdatert)}`);
            })
            .catch(error => {
                log.warn(`oppdatering av dekoratør feilet: ${error}`);
            });
    }, DECORATOR_UPDATE_MS);
}

serve().then(/*noop*/);
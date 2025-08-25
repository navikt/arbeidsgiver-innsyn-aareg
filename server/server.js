import path from 'path';
import express from 'express';
import httpProxyMiddleware, {
    debugProxyErrorsPlugin,
    errorResponsePlugin,
    proxyEventsPlugin,
} from 'http-proxy-middleware';
import { createLogger, format, transports } from 'winston';
import Prometheus from 'prom-client';
import require from './esm-require.js';
import { tokenXMiddleware } from './tokenx.js';

const apiMetricsMiddleware = require('prometheus-api-metrics');
const { createProxyMiddleware } = httpProxyMiddleware;

const defaultLoginUrl =
    'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/arbeidsforhold';

const {
    PORT = 3000,
    NAIS_APP_IMAGE = '?',
    GIT_COMMIT = '?',
    LOGIN_URL = defaultLoginUrl,
    NAIS_CLUSTER_NAME = 'local',
    MILJO = 'prod',
    API_URL = 'http://localhost:8080/arbeidsgiver-arbeidsforhold-api',
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

let BUILD_PATH = path.join(process.cwd(), '../build/production');
if (MILJO === 'local' || MILJO === 'demo') {
    BUILD_PATH = path.join(process.cwd(), '../build/demo');
}

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

const main = async () => {
    let appReady = false;
    const app = express();
    app.disable('x-powered-by');

    app.use('/{*splat}', (req, res, next) => {
        res.setHeader('NAIS_APP_IMAGE', NAIS_APP_IMAGE);
        next();
    });

    app.use(
        apiMetricsMiddleware({
            metricsPath: '/arbeidsforhold/internal/metrics',
        })
    );

    if (MILJO === 'dev' || MILJO === 'prod') {
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
            tokenXMiddleware({
                log: log,
                audience: {
                    dev: 'dev-fss:arbeidsforhold:aareg-innsyn-arbeidsgiver-api',
                    prod: 'prod-fss:arbeidsforhold:aareg-innsyn-arbeidsgiver-api',
                }[MILJO],
            }),
            createProxyMiddleware({
                ...proxyOptions,
                target: API_URL,
            })
        );

        app.use(
            '/arbeidsforhold/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver',
            tokenXMiddleware({
                log: log,
                audience: {
                    dev: 'dev-gcp:personbruker:arbeidsforhold-api',
                    prod: 'prod-gcp:personbruker:arbeidsforhold-api',
                }[MILJO],
            }),
            createProxyMiddleware({
                ...proxyOptions,
                target: 'http://tms-arbeidsforhold-api.min-side/tms-arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver',
            })
        );

        /**
         * Dersom man ikke har gyldig sesjon redirecter vi til login-proxy aka. wonderwall
         * brukeren vil bli sendt tilbake til referer (siden hen stod på) etter innlogging
         *
         * https://doc.nais.io/auth/explanations/?h=wonder#login-proxy
         */
        app.get('/arbeidsforhold/redirect-til-login', (req, res) => {
            const target = new URL(LOGIN_URL);
            target.searchParams.set('redirect', req.get('referer'));
            res.redirect(target.href);
        });
    }

    app.use(
        '/arbeidsforhold',
        express.static(BUILD_PATH, {
            index: false,
            etag: false,
            maxAge: '1h',
        })
    );

    app.get('/arbeidsforhold/static/js/settings.js', (req, res) => {
        res.contentType('text/javascript');
        res.send(`
            window.environment = {
                MILJO: '${MILJO}',
                NAIS_APP_IMAGE: '${NAIS_APP_IMAGE}',
                GIT_COMMIT: '${GIT_COMMIT}'
            };
        `);
    });

    app.get('/arbeidsforhold/internal/isAlive', (req, res) => res.sendStatus(200));
    app.get('/arbeidsforhold/internal/isReady', (req, res) => res.sendStatus(appReady ? 200 : 500));

    app.get('/arbeidsforhold/{*splat}', (req, res) => {
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Etag', GIT_COMMIT);
        res.sendFile(path.join(BUILD_PATH, 'index.html'));
    });

    const server = app.listen(PORT, () => {
        log.info(`Server listening on port ${PORT}`);
        setTimeout(() => {
            appReady = true;
        }, 5000);
    });

    server.on('error', (error) => {
        log.error('Server failed to start', error);
        process.exit(1);
    });
};

main()
    .then((_) => log.info('main started'))
    .catch((e) => log.error('main failed', e));

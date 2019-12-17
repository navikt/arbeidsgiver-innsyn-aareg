const path = require('path');
const express = require('express');
const BASE_PATH = '/bedriftsoversikt-og-ansatte';
const server = express();
const createEnvSettingsFile = require('./envSettings.js');
const buildPath = path.join(__dirname, '../../build');
const sonekrysning = require('./sonekrysningConfig.js');
const veilarbStatusProxyConfig = require('./veilarbStatusProxyConfig');
const enkeltArbeidsforholdProxyConfig = require('./enkeltArbeidsforholdProxy');

server.use(BASE_PATH, express.static(path.join(__dirname, '../../build')));
server.use(`${BASE_PATH}/api`, sonekrysning);
server.use(`${BASE_PATH}/veilarbstepup/status`, veilarbStatusProxyConfig);
server.use(
    `${BASE_PATH}/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver`,
    enkeltArbeidsforholdProxyConfig
);
createEnvSettingsFile(path.resolve(`${buildPath}/static/js/settings.js`));

const port = process.env.PORT || 3000;
server.get(`${BASE_PATH}/redirect-til-login`, (req, res) => {
    const loginUrl =
        process.env.LOGIN_URL ||
        'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/bedriftsoversikt-og-ansatte';
    res.redirect(loginUrl);
});

const startServer = html => {
    console.log('start server');
    server.use(BASE_PATH, express.static(buildPath, { index: false }));

    setInternalEndpoints();
    server.get(`${BASE_PATH}/*`, (req, res) => {
        res.send(html);
    });
    server.listen(port, () => {
        console.log('Server listening on port', port);
    });
};

const startMockServer = html => {
    console.log('start server');
    server.use(BASE_PATH, express.static(buildPath));

    setInternalEndpoints();

    server.get(`${BASE_PATH}/*`, (req, res) => {
        res.sendFile(path.resolve(buildPath, 'index.html'));
    });
    server.listen(port, () => {
        console.log('Server listening on port', port);
    });
};

const setInternalEndpoints = () => {
    server.get(`${BASE_PATH}/internal/isAlive`, (req, res) => res.sendStatus(200));
    server.get(`${BASE_PATH}/internal/isReady`, (req, res) => res.sendStatus(200));
};

if (process.env.REACT_APP_MOCK) {
    startMockServer();
} else {
    startServer();
}

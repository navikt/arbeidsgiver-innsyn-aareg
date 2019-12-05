const path = require('path');
const express = require('express');
const BASE_PATH='/bedriftsoversikt-og-ansatte';
const server = express();
const createEnvSettingsFile = require('./envSettings.js');
const buildPath = path.join(__dirname,'../../build');

server.use(BASE_PATH, express.static(path.join(__dirname,'../../build')));
server.use(`${BASE_PATH}/api`, sonekrysning);
server.use(`${BASE_PATH}/veilarbstepup/status`,veilarbStatusProxyConfig);

createEnvSettingsFile(path.resolve(`${buildPath}/static/js/settings.js`));

const port = process.env.PORT || 3000;
server.get(
    `${BASE_PATH}/internal/isAlive`,
    (req, res) => res.sendStatus(200)
);
server.get(`${BASE_PATH}/redirect-til-login`, (req, res) => {
    const loginUrl = process.env.LOGIN_URL ||
        'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/bedriftsoversikt-og-ansatte';
    res.redirect(loginUrl);
});
server.get(
    `${BASE_PATH}/internal/isReady`,
    (req, res) => res.sendStatus(200)
);
server.get(`${BASE_PATH}/*`, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../build', 'index.html'));
});
server.listen(port, () => {
    console.log('Server listening on port', port);
});

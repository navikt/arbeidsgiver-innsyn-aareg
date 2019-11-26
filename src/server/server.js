const path = require('path');
const express = require('express');
const BASE_PATH='/bedriftsoversikt-og-ansatte';
const server = express();

server.use(BASE_PATH, express.static(path.join(__dirname,'../../build')));

const port = process.env.PORT || 3000;
server.get(
    `${BASE_PATH}/internal/isAlive`,
    (req, res) => res.sendStatus(200)
);
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

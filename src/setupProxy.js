/* Automatically picked up by react-script in development mode. */

module.exports = function(app) {
    try {
        const {applyNotifikasjonMockMiddleware} = require('@navikt/arbeidsgiver-notifikasjoner-brukerapi-mock');
        const cookieParser = require('cookie-parser');

        applyNotifikasjonMockMiddleware({app, path: '/arbeidsforhold/notifikasjon-bruker-api'});
        app.use(cookieParser());

        // mocks
        require('../server/mock/all.cjs').mockAll(app);

    } catch (e) {
        console.error(e)
    }

};
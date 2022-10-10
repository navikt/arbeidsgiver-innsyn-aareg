const {delay} = require("./utils.cjs");

module.exports = {
    mock: (app) => {
        app.get('/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/feature', async (req, res) => {
            await delay(500);
            res.send({
                'innsynaareg.vishistorikk': true,
                'innsynaareg.tillatPrint': true,
            });
        });
        app.get('/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/antall-arbeidsforhold', async (req, res) => {
            await delay(1000);
            const antall = Number.parseInt(req.headers.orgnr ?? '100') % 1000;
            const missing = randomInt(10) === 0;
            res.send({
                first: '910825518',
                second: missing ? -1 : antall
            });
        });
    }
}
module.exports = {
    mockAll: (app) => {
        require('./aaregMock.cjs').mock(app);
        require('./altinnMock.cjs').mock(app);
        require('./arbeidsforholdMock.cjs').mock(app);

        app.get('/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/innlogget', (req, res) => {
            console.log("innlogget?")
            const token = req.cookies.hasOwnProperty('selvbetjening-idtoken')
            if (token) {
                console.log("innlogget? ja (cookie selvbetjening-idtoken eksisterer)")
                res.status(200).send()
            } else {
                console.log("innlogget? nei (cookie selvbetjening-idtoken mangler)")
                res.status(401).send()
            }
        });

        app.get('/arbeidsforhold/redirect-til-login', async (req, res) => {
            const response = await fetch('https://fakedings.dev-gcp.nais.io/fake/custom', {
                method: 'POST',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                body: `sub=00112233445&aud=${encodeURIComponent("bruker-api")}&acr=Level4`
            });
            const token = await response.text()
            res.cookie("selvbetjening-idtoken", token)
            console.log(`login: setter selvbetjening-idtoken til ${token}`)
            res.redirect("http://localhost:3000/arbeidsforhold/");
        });
    }
}
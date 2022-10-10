module.exports = {
    mockAll: (app) => {
        require('./aaregMock.cjs').mock(app);
        require('./altinnMock.cjs').mock(app);
        require('./arbeidsforholdMock.cjs').mock(app);
        require('./unleash.cjs').mock(app);
    }
}
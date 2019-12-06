export const hentArbeidsforholdLink = () => {
    return (
        '/bedriftsoversikt-og-ansatte/api/arbeidsforhold'
    );
};

export const hentUnderenhetApiLink = (orgnr: string) => {
    return `https://data.brreg.no/enhetsregisteret/api/underenheter/${orgnr}`;
};

export const hentOverordnetEnhetApiLink = (orgnr: string) => {
    return `https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`;
};


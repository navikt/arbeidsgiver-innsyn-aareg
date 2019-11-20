export const hentArbeidsforholdLink = (orgnr: string) => {
    return (
        'https://arbeidsgiver.nais.preprod.local/ditt-nav-arbeidsgiver-api/api/arbeidsforhold/' +
        orgnr
    );
};

export const hentUnderenhetApiLink = (orgnr: string) => {
    return `https://data.brreg.no/enhetsregisteret/api/underenheter/${orgnr}`;
};

export const hentOverordnetEnhetApiLink = (orgnr: string) => {
    return `https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`;
};
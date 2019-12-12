
const landingsURL ='/bedriftsoversikt-og-ansatte/';

export const hentArbeidsforholdLink = () => {
    return (
         landingsURL+'api/arbeidsforhold'
    );
};

export const hentOrganisasjonerLink = () => {
    return (
        landingsURL + 'api/organisasjoner'
    );
};

export const hentUnderenhetApiLink = (orgnr: string) => {
    return `https://data.brreg.no/enhetsregisteret/api/underenheter/${orgnr}`;
};

export const hentOverordnetEnhetApiLink = (orgnr: string) => {
    return `https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`;
};


import {basename} from "./paths";

export const hentArbeidsforholdLink = () => {
    return (
        basename +'/api/arbeidsforhold'
    );
};

export const hentOrganisasjonerLink = () => {
    return (
        basename + '/api/organisasjoner'
    );
};

export const hentUnderenhetApiLink = (orgnr: string) => {
    return `https://data.brreg.no/enhetsregisteret/api/underenheter/${orgnr}`;
};

export const hentOverordnetEnhetApiLink = (orgnr: string) => {
    return `https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`;
};


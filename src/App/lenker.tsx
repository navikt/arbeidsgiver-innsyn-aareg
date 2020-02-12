import environment from '../utils/environment';

const landingsURL = '/arbeidsforhold/';

export const hentArbeidsforholdLink = () => {
    return landingsURL + 'api/arbeidsforhold';
};

export const hentOrganisasjonerLink = () => {
    return landingsURL + 'api/organisasjoner';
};

export const hentUnderenhetApiLink = (orgnr: string) => {
    return `https://data.brreg.no/enhetsregisteret/api/underenheter/${orgnr}`;
};

export const hentOverordnetEnhetApiLink = (orgnr: string) => {
    return `https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`;
};

export const linkTilMinSideArbeidsgiver = (orgnr: string) => {
    if (environment.MILJO === 'prod-sbs') {
        return 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/' + orgnr + '/';
    } else {
        return 'https://arbeidsgiver-q.nav.no/min-side-arbeidsgiver/' + orgnr + '/';
    }
};

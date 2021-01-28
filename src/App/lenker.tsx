import environment from '../utils/environment';
import { alleFeatures } from './FeatureToggleProvider';

const landingsURL = '/arbeidsforhold/';

export const hentArbeidsforholdLink = () => {
    return landingsURL + 'arbeidsgiver-arbeidsforhold/api/arbeidsforhold';
};

export const hentTidligereArbeidsforholdLink = () => {
    return landingsURL + 'arbeidsgiver-arbeidsforhold/api/tidligere-arbeidsforhold';
};

export const hentAntallArbeidsforholdLink = () => {
    return landingsURL + 'arbeidsgiver-arbeidsforhold/api/antall-arbeidsforhold';
};

export const hentTidligereVirksomheterLink = landingsURL + 'arbeidsgiver-arbeidsforhold/api/tidligere-virksomheter';

export const hentOrganisasjonerLink = () => {
    return landingsURL + 'arbeidsgiver-arbeidsforhold/api/organisasjoner';
};

export const hentRettigheterTilAltinnTjenesteLink = () => {
    return landingsURL + 'arbeidsgiver-arbeidsforhold/api/rettigheter-til-tjeneste/';
};

export const sjekkInnloggetLenke = () => {
    return landingsURL + 'arbeidsgiver-arbeidsforhold/api/innlogget';
};

export const hentUnderenhetApiLink = (orgnr: string) => {
    return `https://data.brreg.no/enhetsregisteret/api/underenheter/${orgnr}`;
};

export const hentOverordnetEnhetApiLink = (orgnr: string) => {
    return `https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`;
};

export const hentFeatureTogglesLenke = (): string => {
    const featureBaseUrl = landingsURL + 'arbeidsgiver-arbeidsforhold/api/feature';
    const query = alleFeatures.map((feature) => `feature=${feature}`).join('&');
    return `${featureBaseUrl}?${query}`;
};

export const linkTilMinSideArbeidsgiver = (orgnr: string) => {
    const orgNrDel = orgnr.length > 0 ? '?bedrift=' + orgnr : '';
    if (environment.MILJO === 'prod-sbs') {
        return 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/' + orgNrDel;
    } else if (environment.MILJO === 'dev-sbs') {
        return 'https://arbeidsgiver-q.nav.no/min-side-arbeidsgiver/' + orgNrDel;
    }
    return 'https://arbeidsgiver.labs.nais.io/min-side-arbeidsgiver/' + orgNrDel;
};

export const linkTilArbeidsforhold = (orgnr: string) => {
    const orgNrDel = orgnr.length > 0 ? '?bedrift=' + orgnr : '';
    if (environment.MILJO === 'prod-sbs') {
        return 'https://arbeidsgiver.nav.no/arbeidsforhold/' + orgNrDel;
    } else if (environment.MILJO === 'dev-sbs') {
        return 'https://arbeidsgiver-q.nav.no/arbeidsforhold/' + orgNrDel;
    }
    return 'https://arbeidsgiver.labs.nais.io/arbeidsforhold/' + orgNrDel;
};

export const beOmTilgangIAltinnLink = (
    orgnr: string,
    serviceKode: string,
    serviceEditionKode: string,
    serviceEditionKodeTest?: string
) => {
    if (environment.MILJO === 'prod-sbs') {
        return (
            'https://altinn.no/ui/DelegationRequest?offeredBy=' +
            orgnr +
            '&resources=' +
            serviceKode +
            '_' +
            serviceEditionKode
        );
    } else {
        let testServiceEditionKode = serviceEditionKode;
        if (serviceEditionKodeTest) {
            testServiceEditionKode = serviceEditionKodeTest;
        }
        return (
            'https://tt02.altinn.no/ui/DelegationRequest?offeredBy=' +
            orgnr +
            '&resources=' +
            serviceKode +
            '_' +
            testServiceEditionKode
        );
    }
};

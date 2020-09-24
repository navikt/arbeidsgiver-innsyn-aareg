import environment from '../utils/environment';
import {alleFeatures} from "./FeatureToggleProvider";

const landingsURL = '/arbeidsforhold/';

export const hentArbeidsforholdLinkNyBackend = () => {
    return landingsURL + 'arbeidsgiver-arbeidsforhold/api/arbeidsforhold';
};

export const hentAntallArbeidsforholdLinkNyBackend = () => {
    return landingsURL + 'arbeidsgiver-arbeidsforhold/api/antall-arbeidsforhold';
};

export const hentTidligereVirksomheterLink = landingsURL + 'arbeidsgiver-arbeidsforhold/api/tidligere-virksomheter';

export const hentOrganisasjonerLinkNyBackend = () => {
    return landingsURL + 'arbeidsgiver-arbeidsforhold/api/organisasjoner';
};

export const hentRettigheterTilAltinnTjenesteLink = () => {
    return landingsURL + 'arbeidsgiver-arbeidsforhold/api/rettigheter-til-tjeneste/';
};

export const hentOrganisasjonerLink = () => {
    return landingsURL + 'api/organisasjoner';
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

export const hentFeatureTogglesLenke = ():string => {
    const featureBaseUrl = landingsURL + 'arbeidsgiver-arbeidsforhold/api/feature';
    const query = alleFeatures.map(feature => `feature=${feature}`).join('&');
    return `${featureBaseUrl}?${query}`;
};



export const linkTilMinSideArbeidsgiver = (orgnr: string) => {
    const orgNrDel = orgnr.length>0 ? '?bedrift=' + orgnr : '';
    if (environment.MILJO === 'prod-sbs') {
        return 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/' + orgNrDel;
    } else {
        return 'https://arbeidsgiver-q.nav.no/min-side-arbeidsgiver/' + orgNrDel;
    }
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
            serviceKode+
            '_' +
            testServiceEditionKode
        );
    }
};



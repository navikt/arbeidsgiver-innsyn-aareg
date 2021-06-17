import { gittMiljø } from '../utils/environment';
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
    return gittMiljø({
        prod: 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/',
        dev: 'https://arbeidsforhold.dev.nav.no/min-side-arbeidsgiver/',
        other: 'https://arbeidsgiver.labs.nais.io/min-side-arbeidsgiver/'
    }) + orgNrDel;
};

export const linkTilArbeidsforhold = (orgnr: string) => {
    const orgNrDel = orgnr.length > 0 ? '?bedrift=' + orgnr : '';
    return gittMiljø({
        prod: 'https://arbeidsgiver.nav.no/arbeidsforhold/',
        dev: 'https://arbeidsforhold.dev.nav.no/arbeidsforhold/',
        other: 'https://arbeidsgiver.labs.nais.io/arbeidsforhold/',
    }) + orgNrDel;
};

const delegationRequestUrl = gittMiljø({
    prod: 'https://altinn.no/ui/DelegationRequest',
    other: 'https://tt02.altinn.no/ui/DelegationRequest'
});

export const beOmTilgangIAltinnLink = (
    orgnr: string,
    serviceKode: string,
    serviceEditionKode: string,
    serviceEditionKodeTest?: string
) => {
    const edition = gittMiljø({
        prod: serviceEditionKode,
        other: serviceEditionKodeTest ?? serviceEditionKode
    });

    return `${delegationRequestUrl}?offeredBy=${orgnr}&resources=${serviceKode}_${edition}`;
};

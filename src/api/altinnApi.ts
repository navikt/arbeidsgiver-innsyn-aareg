import { fetchJson } from './api-utils';
import {
    Organisasjon,
    OrganisasjonlowerCase,
    tomaAltinnOrganisasjon,
} from '../App/Objekter/OrganisasjonFraAltinn';

export async function sjekkInnlogget(): Promise<boolean> {
    const respons = await fetch('/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/innlogget');
    return respons.ok;
}

export async function hentOrganisasjonerFraAltinn(): Promise<Organisasjon[]> {
    const organisasjoner = await fetchJson<OrganisasjonlowerCase[]>(
        '/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/organisasjoner'
    );
    return mapOrganisasjonerFraLowerCaseTilupper(organisasjoner);
}

export async function hentOrganisasjonerMedTilgangTilAltinntjeneste(
    serviceKode: string,
    serviceEdition: string
): Promise<Organisasjon[]> {
    const organisasjoner = await fetchJson<OrganisasjonlowerCase[]>(
        `/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/rettigheter-til-tjeneste?serviceKode=${serviceKode}&serviceEdition=${serviceEdition}`
    );
    return mapOrganisasjonerFraLowerCaseTilupper(organisasjoner);
}

export const mapOrganisasjonerFraLowerCaseTilupper = (
    organisasjonerRaw: OrganisasjonlowerCase[]
): Organisasjon[] => {
    return organisasjonerRaw.map((rawOrg) => ({
        ...tomaAltinnOrganisasjon,
        OrganizationNumber: rawOrg.organizationNumber,
        OrganizationForm: rawOrg.organizationForm,
        Name: rawOrg.name,
        ParentOrganizationNumber: rawOrg.parentOrganizationNumber,
        Type: rawOrg.type,
        Status: rawOrg.status,
    }));
};
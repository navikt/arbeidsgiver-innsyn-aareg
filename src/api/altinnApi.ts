import { FetchError } from './api-utils';
import {
    Organisasjon,
    OrganisasjonlowerCase,
    tomaAltinnOrganisasjon,
} from '../App/Objekter/OrganisasjonFraAltinn';

export async function sjekkInnlogget(): Promise<boolean> {
    let respons = await fetch('/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/innlogget');
    return respons.ok;
}

export async function hentOrganisasjonerFraAltinn(): Promise<Organisasjon[]> {
    let respons = await fetch('/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/organisasjoner');
    if (respons.ok) {
        const organisasjoner = await respons.json();
        return mapOrganisasjonerFraLowerCaseTilupper(organisasjoner);
    } else {
        throw new FetchError(respons.statusText ?? respons.type, respons);
    }
}

export async function hentOrganisasjonerMedTilgangTilAltinntjeneste(
    serviceKode: string,
    serviceEdition: string
): Promise<Organisasjon[]> {
    let respons = await fetch(
        `/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/rettigheter-til-tjeneste?serviceKode=${serviceKode}&serviceEdition=${serviceEdition}`
    );
    if (respons.ok) {
        const organisasjoner = await respons.json();
        return mapOrganisasjonerFraLowerCaseTilupper(organisasjoner);
    } else {
        throw new FetchError(respons.statusText ?? respons.type, respons);
    }
}

export const mapOrganisasjonerFraLowerCaseTilupper = (
    organisasjonerRaw: OrganisasjonlowerCase[]
): Organisasjon[] => {
    return organisasjonerRaw.map((rawOrg) => {
        return {
            ...tomaAltinnOrganisasjon,
            OrganizationNumber: rawOrg.organizationNumber,
            OrganizationForm: rawOrg.organizationForm,
            Name: rawOrg.name,
            ParentOrganizationNumber: rawOrg.parentOrganizationNumber,
            Type: rawOrg.type,
            Status: rawOrg.status,
        };
    });
};

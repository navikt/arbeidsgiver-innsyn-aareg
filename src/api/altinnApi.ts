import {
    hentOrganisasjonerLink,
    hentRettigheterTilAltinnTjenesteLink,
    sjekkInnloggetLenke,
} from '../App/lenker';
import { FetchError } from './api-utils';
import {
    Organisasjon,
    OrganisasjonlowerCase,
    tomaAltinnOrganisasjon,
} from '../App/Objekter/OrganisasjonFraAltinn';

export async function sjekkInnlogget(): Promise<boolean> {
    let respons = await fetch(sjekkInnloggetLenke());
    return respons.ok;
}

export async function hentOrganisasjonerFraAltinn(): Promise<Organisasjon[]> {
    let respons = await fetch(hentOrganisasjonerLink());
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
        hentRettigheterTilAltinnTjenesteLink() +
            '?serviceKode=' +
            serviceKode +
            '&serviceEdition=' +
            serviceEdition
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

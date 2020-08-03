
import {
    hentOrganisasjonerLink,
    hentOrganisasjonerLinkNyBackend,
    hentRettigheterTilAltinnTjenesteLink,
    sjekkInnloggetLenke
} from '../App/lenker';
import { FetchError } from './api-utils';
import {Organisasjon} from "../App/Objekter/OrganisasjonFraAltinn";

export async function sjekkInnlogget(signal: any): Promise<boolean> {
    let respons = await fetch(sjekkInnloggetLenke(), { signal: signal });
    if (respons.ok) {
        return true
    } else {
        return false
    }
}

export async function hentOrganisasjonerFraAltinn(signal: any): Promise<Organisasjon[]> {
    let respons = await fetch(hentOrganisasjonerLink(), { signal: signal });
    if (respons.ok) {
        return await respons.json();
    } else {
        throw new FetchError(respons.statusText || respons.type, respons);
    }
}

export async function hentOrganisasjonerFraAltinnNyBackend(signal: any): Promise<Organisasjon[]> {
    let respons = await fetch(hentOrganisasjonerLinkNyBackend(), { signal: signal });
    if (respons.ok) {
        return await respons.json();
    } else {
        throw new FetchError(respons.statusText || respons.type, respons);
    }
}

export async function hentOrganisasjonerMedTilgangTilAltinntjeneste(
    serviceKode: string,
    serviceEdition: string,
    signal: any
): Promise<Organisasjon[]> {
    let respons = await fetch(
        '/arbeidsforhold/api/rettigheter-til-skjema/?serviceKode=' + serviceKode + '&serviceEdition=' + serviceEdition,
        { signal: signal }
    );
    if (respons.ok) {
        return await respons.json();
    } else {
        throw new FetchError(respons.statusText || respons.type, respons);
    }
}

export async function hentOrganisasjonerMedTilgangTilAltinntjenesteNyBackend(
    serviceKode: string,
    serviceEdition: string,
    signal: any
): Promise<Organisasjon[]> {
    let respons = await fetch(
        hentRettigheterTilAltinnTjenesteLink() + '?serviceKode=' + serviceKode + '&serviceEdition=' + serviceEdition,
        { signal: signal }
    );
    if (respons.ok) {
        return await respons.json();
    } else {
        throw new FetchError(respons.statusText || respons.type, respons);
    }
}

import { Organisasjon } from '@navikt/bedriftsmeny/lib/Organisasjon';
import { hentOrganisasjonerLink } from '../App/lenker';
import { FetchError } from './api-utils';

export async function hentOrganisasjonerFraAltinn(signal: any): Promise<Organisasjon[]> {
    let respons = await fetch(hentOrganisasjonerLink(), { signal: signal });
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

import { Organisasjon } from '@navikt/bedriftsmeny/lib/Organisasjon';
import { hentOrganisasjonerLink } from '../App/lenker';

export async function hentOrganisasjonerFraAltinn(): Promise<Organisasjon[]> {
    let respons = await fetch(hentOrganisasjonerLink());
    if (respons.ok) {
        return await respons.json();
    } else {
        return [];
    }
}

export async function hentOrganisasjonerMedTilgangTilAltinntjeneste(
    serviceKode: string,
    serviceEdition: string
): Promise<Organisasjon[]> {
    let respons = await fetch(
        '/arbeidsforhold/api/rettigheter-til-skjema/?serviceKode=' + serviceKode + '&serviceEdition=' + serviceEdition
    );
    if (respons.ok) {
        return await respons.json();
    } else {
        return [];
    }
}

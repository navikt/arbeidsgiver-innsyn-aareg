import {OrganisasjonFraAltinn} from "../Objekter/OrganisasjonFraAltinn";

export async function hentOrganisasjonerFraAltinn(): Promise<OrganisasjonFraAltinn[]> {
    let respons = await fetch('/min-side-arbeidsgiver/api/organisasjoner');
    if (respons.ok) {
        return await respons.json();
    } else {
        return [];
    }
}


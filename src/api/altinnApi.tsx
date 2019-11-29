import {Organisasjon} from "../App/Objekter/OrganisasjonFraAltinn";

export async function hentOrganisasjonerFraAltinn(): Promise<Organisasjon[]> {
    let respons = await fetch('/min-side-arbeidsgiver/api/organisasjoner');
    if (respons.ok) {
        return await respons.json();
    } else {
        return [];
    }
}


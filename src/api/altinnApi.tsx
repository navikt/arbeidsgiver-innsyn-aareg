import {OrganisasjonFraAltinn} from "../App/Objekter/OrganisasjonFraAltinn";

export async function hentOrganisasjonerFraAltinn(): Promise<OrganisasjonFraAltinn[]> {
    let respons = await fetch('/min-side-arbeidsgiver/api/organisasjoner');
    if (respons.ok) {
        console.log(await respons.json);
        return await respons.json();
    } else {
        return [];
    }
}


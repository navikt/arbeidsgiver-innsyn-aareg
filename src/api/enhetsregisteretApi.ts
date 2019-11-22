import {
    ListeMedJuridiskeEnheter,
    OrganisasjonFraEnhetsregisteret,
    tomEnhetsregOrg
} from "../App/Objekter/OrganisasjonFraEnhetsregisteret";
import {hentOverordnetEnhetApiLink, hentUnderenhetApiLink} from "../App/lenker";
import {Organisasjon, tomAltinnOrganisasjon} from "@navikt/bedriftsmeny/lib/Organisasjon";


export async function hentUnderenhet(orgnr: string): Promise<OrganisasjonFraEnhetsregisteret> {
    let respons = await fetch(hentUnderenhetApiLink(orgnr));
    if (respons.ok) {
        const enhet: OrganisasjonFraEnhetsregisteret = await respons.json();
        return enhet;
    }
    return tomEnhetsregOrg;
}

export async function hentOverordnetEnhet(orgnr: string): Promise<OrganisasjonFraEnhetsregisteret> {
    if (orgnr !== '') {
        let respons = await fetch(hentOverordnetEnhetApiLink(orgnr));
        if (respons.ok) {
            const enhet: OrganisasjonFraEnhetsregisteret = await respons.json();
            return enhet;
        }
    }
    return tomEnhetsregOrg;
}

export async function hentAlleJuridiskeEnheter(
    listeMedJuridiskeOrgNr: string[]
): Promise<Organisasjon[]> {
    let url: string = 'https://data.brreg.no/enhetsregisteret/api/enheter/?organisasjonsnummer=';
    const distinkteJuridiskeEnhetsnr: string[] = listeMedJuridiskeOrgNr.filter(
        (jurOrg, index) => listeMedJuridiskeOrgNr.indexOf(jurOrg) === index
    );
    distinkteJuridiskeEnhetsnr.forEach(orgnr => {
        if (distinkteJuridiskeEnhetsnr.indexOf(orgnr) === 0) {
            url += orgnr;
        } else {
            url += ',' + orgnr;
        }
    });
    let respons = await fetch(url);
    if (respons.ok) {
        const distinkteJuridiskeEnheterFraEreg: ListeMedJuridiskeEnheter = await respons.json();
        if (distinkteJuridiskeEnheterFraEreg._embedded) {
            let distinkteJuridiskeEnheter: Organisasjon[] = distinkteJuridiskeEnheterFraEreg._embedded.enheter.map(
                orgFraEereg => {
                    const jurOrg: Organisasjon = {
                        ...tomAltinnOrganisasjon,
                        Name: orgFraEereg.navn,
                        OrganizationNumber: orgFraEereg.organisasjonsnummer,
                    };
                    return jurOrg;
                }
            );
            return distinkteJuridiskeEnheter;
        }
    }
    return [];
}

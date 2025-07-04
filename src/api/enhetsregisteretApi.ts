import {
    ListeMedJuridiskeEnheter,
    OrganisasjonFraEnhetsregisteret,
    tomEnhetsregOrg,
} from '../App/Objekter/OrganisasjonFraEnhetsregisteret';
import { Organisasjon, tomaAltinnOrganisasjon } from '../App/Objekter/OrganisasjonFraAltinn';

export async function hentAlleJuridiskeEnheter(
    listeMedJuridiskeOrgNr: string[]
): Promise<Organisasjon[]> {
    const listerMedDefinerteOrgNr = listeMedJuridiskeOrgNr.filter((orgnr) => {
        return orgnr !== null;
    });
    let url: string = 'https://data.brreg.no/enhetsregisteret/api/enheter/?organisasjonsnummer=';
    const distinkteJuridiskeEnhetsnr: string[] = listerMedDefinerteOrgNr.filter(
        (jurOrg, index) => listeMedJuridiskeOrgNr.indexOf(jurOrg) === index
    );
    distinkteJuridiskeEnhetsnr.forEach((orgnr) => {
        if (distinkteJuridiskeEnhetsnr.indexOf(orgnr) === 0) {
            url += orgnr;
        } else {
            url += ',' + orgnr;
        }
    });
    let respons = await fetch(url);
    if (respons.ok && distinkteJuridiskeEnhetsnr.length > 0) {
        const distinkteJuridiskeEnheterFraEreg: ListeMedJuridiskeEnheter = await respons.json();
        if (
            distinkteJuridiskeEnheterFraEreg._embedded != null &&
            Array.isArray(distinkteJuridiskeEnheterFraEreg._embedded.enheter) &&
            distinkteJuridiskeEnheterFraEreg._embedded.enheter.length > 0
        ) {
            const distinkteJuridiskeEnheter: Organisasjon[] =
                distinkteJuridiskeEnheterFraEreg._embedded.enheter.map((orgFraEereg) => {
                    const jurOrg: Organisasjon = {
                        ...tomaAltinnOrganisasjon,
                        Name: orgFraEereg.navn,
                        OrganizationNumber: orgFraEereg.organisasjonsnummer,
                    };
                    return jurOrg;
                });
            return distinkteJuridiskeEnheter;
        }
    }
    return [];
}

export async function hentUnderenhet(orgnr: string): Promise<OrganisasjonFraEnhetsregisteret> {
    let respons = await fetch(`https://data.brreg.no/enhetsregisteret/api/underenheter/${orgnr}`);
    if (respons.ok) {
        const enhet: OrganisasjonFraEnhetsregisteret = await respons.json();
        return enhet;
    }
    return tomEnhetsregOrg;
}

export async function hentOverordnetEnhet(orgnr: string): Promise<OrganisasjonFraEnhetsregisteret> {
    if (orgnr !== '') {
        let respons = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`);
        if (respons.ok) {
            const enhet: OrganisasjonFraEnhetsregisteret = await respons.json();
            return enhet;
        }
    }
    return tomEnhetsregOrg;
}

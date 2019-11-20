import {hentArbeidsforholdLink, hentOverordnetEnhetApiLink, hentUnderenhetApiLink} from "../App/lenker";
import {ListeMedJuridiskeEnheter, OrganisasjonFraEnhetsregisteret} from "../App/Objekter/OrganisasjonFraEnhetsregisteret";
import {OrganisasjonFraAltinn, tomaAltinnOrganisasjon} from "../App/Objekter/OrganisasjonFraAltinn";

export async function hentArbeidsforholdFraAAreg(orgnr: string): Promise<any> {
    let respons = await fetch(hentArbeidsforholdLink(orgnr));
    if (respons.ok) {
        return await respons.json();
    } else {
        return null;
    }
}

export async function hentUnderenhet(orgnr: string): Promise<any> {
    let respons = await fetch(hentUnderenhetApiLink(orgnr));
    if (respons.ok) {
        const enhet: OrganisasjonFraEnhetsregisteret = await respons.json();
        return enhet;
    }
    return null;
}

export async function hentOverordnetEnhet(orgnr: string): Promise<any> {
    if (orgnr !== '') {
        let respons = await fetch(hentOverordnetEnhetApiLink(orgnr));
        if (respons.ok) {
            const enhet: OrganisasjonFraEnhetsregisteret = await respons.json();
            return enhet;
        }
    }
    return null;
}

export async function hentAlleJuridiskeEnheter(
    listeMedJuridiskeOrgNr: string[]
): Promise<any> {
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
        let distinkteJuridiskeEnheter: OrganisasjonFraAltinn[] = distinkteJuridiskeEnheterFraEreg._embedded.enheter.map(
            orgFraEereg => {

                const jurOrg: OrganisasjonFraAltinn = {
                    ...tomaAltinnOrganisasjon,
                    Name: orgFraEereg.navn,
                    OrganizationNumber: orgFraEereg.organisasjonsnummer,
                };
                return jurOrg;
            }
        );
        return distinkteJuridiskeEnheter;
    }

    return [];
}
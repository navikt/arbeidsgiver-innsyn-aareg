import {
    ListeMedJuridiskeEnheter
} from "../App/Objekter/OrganisasjonFraEnhetsregisteret";
import {Organisasjon, tomaAltinnOrganisasjon} from "../App/Objekter/OrganisasjonFraAltinn";

export async function hentAlleJuridiskeEnheter(
    listeMedJuridiskeOrgNr: string[]
): Promise<Organisasjon[]> {
    const listerMedDefinerteOrgNr = listeMedJuridiskeOrgNr.filter(orgnr=> {return orgnr !== null});
    let url: string = 'https://data.brreg.no/enhetsregisteret/api/enheter/?organisasjonsnummer=';
    const distinkteJuridiskeEnhetsnr: string[] = listerMedDefinerteOrgNr.filter(
        (jurOrg, index) => listeMedJuridiskeOrgNr.indexOf(jurOrg) === index
    );
    distinkteJuridiskeEnhetsnr.forEach(orgnr => {
        if (distinkteJuridiskeEnhetsnr.indexOf(orgnr) === 0) {
            url += orgnr;
        } else {
            url += ',' + orgnr;
        };
    });
    let respons = await fetch(url);
    console.log(url);
    if (respons.ok && distinkteJuridiskeEnhetsnr.length >0 ) {
        const distinkteJuridiskeEnheterFraEreg: ListeMedJuridiskeEnheter = await respons.json();
        if ( distinkteJuridiskeEnheterFraEreg._embedded && distinkteJuridiskeEnheterFraEreg._embedded.enheter.length>0) {
            const distinkteJuridiskeEnheter: Organisasjon[] = distinkteJuridiskeEnheterFraEreg._embedded.enheter.map(
                orgFraEereg => {
                    const jurOrg: Organisasjon = {
                        ...tomaAltinnOrganisasjon,
                        Name: orgFraEereg.navn,
                        OrganizationNumber: orgFraEereg.organisasjonsnummer,
                    };
                    return jurOrg;
                }
            );
            return distinkteJuridiskeEnheter;
        }
    };
    return [];
};

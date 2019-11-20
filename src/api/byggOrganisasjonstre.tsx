import {JuridiskEnhetMedUnderEnheter} from "../App/Objekter/JuridiskEnhetMedUnderEnheter";
import {hentAlleJuridiskeEnheter} from "./AAregApi";
import {OrganisasjonFraAltinn} from "../App/Objekter/OrganisasjonFraAltinn";

export function settSammenJuridiskEnhetMedUnderOrganisasjoner(
    juridiskeEnheter: OrganisasjonFraAltinn[],
    underEnheter: OrganisasjonFraAltinn[]
): JuridiskEnhetMedUnderEnheter[] {
    const organisasjonsTre: JuridiskEnhetMedUnderEnheter[] = juridiskeEnheter.map(
        juridiskEnhet => {
            const underenheter = underEnheter.filter(
                underenhet =>
                    underenhet.ParentOrganizationNumber === juridiskEnhet.OrganizationNumber
            );

            const resultat = {
                JuridiskEnhet: juridiskEnhet,
                Underenheter: underenheter,
            };
            return resultat;
        }
    );
    return organisasjonsTre;
}

export async function byggOrganisasjonstre(
    organisasjoner: OrganisasjonFraAltinn[]
): Promise<JuridiskEnhetMedUnderEnheter[]> {
    const juridiskeEnheter = organisasjoner.filter(function(organisasjon: OrganisasjonFraAltinn) {
        return organisasjon.Type === 'Enterprise';
    });
    const underenheter = organisasjoner.filter(org => org.OrganizationForm === 'BEDR');
    let organisasjonsliste = settSammenJuridiskEnhetMedUnderOrganisasjoner(
        juridiskeEnheter,
        underenheter
    );
    let underenheterMedTilgangTilJuridiskEnhet: OrganisasjonFraAltinn[] = [];
    organisasjonsliste.forEach(juridiskenhet => {
        underenheterMedTilgangTilJuridiskEnhet.push.apply(
            underenheterMedTilgangTilJuridiskEnhet,
            juridiskenhet.Underenheter
        );
    });
    let underEnheterUtenTilgangTilJuridiskEnhet: OrganisasjonFraAltinn[] = underenheter.filter(
        underenhet => !underenheterMedTilgangTilJuridiskEnhet.includes(underenhet)
    );

    if (underEnheterUtenTilgangTilJuridiskEnhet.length > 0) {
        const juridiskeEnheterUtenTilgang = await hentAlleJuridiskeEnheter(
            underEnheterUtenTilgangTilJuridiskEnhet.map(org => org.ParentOrganizationNumber)
        );
        let organisasjonsListeUtenTilgangJuridisk: JuridiskEnhetMedUnderEnheter[] = settSammenJuridiskEnhetMedUnderOrganisasjoner(
            juridiskeEnheterUtenTilgang,
            underEnheterUtenTilgangTilJuridiskEnhet
        );
        organisasjonsliste = organisasjonsliste.concat(organisasjonsListeUtenTilgangJuridisk);
    }
    return organisasjonsliste.sort((a, b) =>
        a.JuridiskEnhet.Name.localeCompare(b.JuridiskEnhet.Name)
    );
}

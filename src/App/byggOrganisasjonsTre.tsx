import {Organisasjon} from "./Objekter/OrganisasjonFraAltinn";
import {hentAlleJuridiskeEnheter} from "../api/enhetsregisteretApi";
import {JuridiskEnhetMedUnderEnheterArray} from "@navikt/bedriftsmeny/lib/Organisasjon";


export function settSammenJuridiskEnhetMedUnderOrganisasjoner(
    juridiskeEnheter: Organisasjon[],
    underEnheter: Organisasjon[]
): JuridiskEnhetMedUnderEnheterArray[] {
  const organisasjonsTre: JuridiskEnhetMedUnderEnheterArray[] = juridiskeEnheter.map(
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
    organisasjoner: Organisasjon[]
): Promise<JuridiskEnhetMedUnderEnheterArray[]> {
  const juridiskeEnheter = organisasjoner.filter(function(organisasjon: Organisasjon) {
    return organisasjon.Type === 'Enterprise';
  });
  const underenheter = organisasjoner.filter(org => org.OrganizationForm === 'BEDR');
  let organisasjonsliste = settSammenJuridiskEnhetMedUnderOrganisasjoner(
      juridiskeEnheter,
      underenheter
  );
  let underenheterMedTilgangTilJuridiskEnhet: Organisasjon[] = [];
  organisasjonsliste.forEach(juridiskenhet => {
    underenheterMedTilgangTilJuridiskEnhet.push.apply(
        underenheterMedTilgangTilJuridiskEnhet,
        juridiskenhet.Underenheter
    );
  });
  let underEnheterUtenTilgangTilJuridiskEnhet: Organisasjon[] = underenheter.filter(
      underenhet => !underenheterMedTilgangTilJuridiskEnhet.includes(underenhet)
  );

  if (underEnheterUtenTilgangTilJuridiskEnhet.length > 0) {
    const juridiskeEnheterUtenTilgang = await hentAlleJuridiskeEnheter(
        underEnheterUtenTilgangTilJuridiskEnhet.map(org => org.ParentOrganizationNumber)
    );
    let organisasjonsListeUtenTilgangJuridisk: JuridiskEnhetMedUnderEnheterArray[] = settSammenJuridiskEnhetMedUnderOrganisasjoner(
        juridiskeEnheterUtenTilgang,
        underEnheterUtenTilgangTilJuridiskEnhet
    );
    organisasjonsliste = organisasjonsliste.concat(organisasjonsListeUtenTilgangJuridisk);
  }
  return organisasjonsliste.sort((a, b) =>
      a.JuridiskEnhet.Name.localeCompare(b.JuridiskEnhet.Name)
  );
}
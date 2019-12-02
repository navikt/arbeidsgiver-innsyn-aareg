
import {JuridiskEnhetMedUnderEnheterArray} from "@navikt/bedriftsmeny/lib/Organisasjon";
import {Organisasjon} from "../../Objekter/OrganisasjonFraAltinn";
import {hentAlleJuridiskeEnheter} from "../../../api/AAregApi";

const settSammenJuridiskEnhetMedUnderOrganisasjoner = (
    juridiskeEnheter: Organisasjon[],
    underEnheter: Organisasjon[]
): JuridiskEnhetMedUnderEnheterArray[] => {
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
};

const hentOgSettSammentMedJuridiskeEnheter = async (underEnheterUtenTilgangTilJuridiskEnhet: Organisasjon[]): Promise<JuridiskEnhetMedUnderEnheterArray[]> => {
  const juridiskeEnheterUtenTilgang = await hentAlleJuridiskeEnheter(
      underEnheterUtenTilgangTilJuridiskEnhet.map(org => org.ParentOrganizationNumber)
  );
  if (juridiskeEnheterUtenTilgang) {

  }
  const organisasjonsListeUtenTilgangJuridisk: JuridiskEnhetMedUnderEnheterArray[] = settSammenJuridiskEnhetMedUnderOrganisasjoner(
      juridiskeEnheterUtenTilgang,
      underEnheterUtenTilgangTilJuridiskEnhet
  );
  return organisasjonsListeUtenTilgangJuridisk;
};

export async function byggOrganisasjonstre(
    organisasjoner: Organisasjon[]
): Promise<JuridiskEnhetMedUnderEnheterArray[]> {
  const juridiskeEnheter = organisasjoner.filter(function(organisasjon: Organisasjon) {
    return organisasjon.Type === 'Enterprise';
  });
  const underenheter = organisasjoner.filter(org => org.OrganizationForm === 'BEDR');
  const organisasjonsliste = settSammenJuridiskEnhetMedUnderOrganisasjoner(
      juridiskeEnheter,
      underenheter
  );
  const underenheterMedTilgangTilJuridiskEnhet: Organisasjon[] = [];
  organisasjonsliste.forEach(juridiskenhet => {
    underenheterMedTilgangTilJuridiskEnhet.push.apply(
        underenheterMedTilgangTilJuridiskEnhet,
        juridiskenhet.Underenheter
    );
  });
  const underEnheterUtenTilgangTilJuridiskEnhet: Organisasjon[] = underenheter.filter(
      underenhet => !underenheterMedTilgangTilJuridiskEnhet.includes(underenhet)
  );
  if (underEnheterUtenTilgangTilJuridiskEnhet.length > 0) {
    const juridiskeEnheterUtenTilgang = hentOgSettSammentMedJuridiskeEnheter(underEnheterUtenTilgangTilJuridiskEnhet);
    const ferdigListe = organisasjonsliste.concat(juridiskeEnheterUtenTilgang);
    return ferdigListe.sort((a, b) =>
        a.JuridiskEnhet.Name.localeCompare(b.JuridiskEnhet.Name)
    );
  }
  return organisasjonsliste.sort((a, b) =>
      a.JuridiskEnhet.Name.localeCompare(b.JuridiskEnhet.Name)
  );
};
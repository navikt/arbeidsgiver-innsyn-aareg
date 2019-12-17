import { JuridiskEnhetMedUnderEnheterArray } from '@navikt/bedriftsmeny/lib/Organisasjon';
import { Organisasjon } from '../../Objekter/OrganisasjonFraAltinn';
import { hentAlleJuridiskeEnheter } from '../../../api/enhetsregisteretApi';

const settSammenJuridiskEnhetMedUnderOrganisasjoner = (
    juridiskeEnheter: Organisasjon[],
    underEnheter: Organisasjon[]
): JuridiskEnhetMedUnderEnheterArray[] => {
    const organisasjonsTre: JuridiskEnhetMedUnderEnheterArray[] = juridiskeEnheter.map(juridiskEnhet => {
        const underenheter = underEnheter.filter(
            underenhet => underenhet.ParentOrganizationNumber === juridiskEnhet.OrganizationNumber
        );
        const resultat = {
            JuridiskEnhet: juridiskEnhet,
            Underenheter: underenheter
        };
        return resultat;
    });
    return organisasjonsTre.filter(orgtre => orgtre.Underenheter.length > 0);
};

export async function byggOrganisasjonstre(
    organisasjoner: Organisasjon[]
): Promise<JuridiskEnhetMedUnderEnheterArray[]> {
    const juridiskeEnheter = organisasjoner.filter(function(organisasjon: Organisasjon) {
        return organisasjon.Type === 'Enterprise';
    });
    const underenheter = organisasjoner.filter(function(organisasjon: Organisasjon) {
        return organisasjon.OrganizationForm === 'BEDR' && organisasjon.OrganizationNumber;
    });
    const jurEnheterOrgNr = juridiskeEnheter.map(jurorg => jurorg.OrganizationNumber);
    const underEnheterMedJuridiskEnhet = organisasjoner.filter(org => {
        return jurEnheterOrgNr.includes(org.ParentOrganizationNumber);
    });
    const underEnheterUtenJuridiskEnhet = organisasjoner.filter(org => {
        return !underEnheterMedJuridiskEnhet.includes(org) && org.OrganizationForm === 'BEDR';
    });
    const juridiskeEnheterUtenTilgang: any = hentAlleJuridiskeEnheter(
        underEnheterUtenJuridiskEnhet.map(org => org.ParentOrganizationNumber)
    ).then(() => juridiskeEnheter.concat(juridiskeEnheterUtenTilgang));
    const orgtre = settSammenJuridiskEnhetMedUnderOrganisasjoner(juridiskeEnheter, underenheter);
    return orgtre.sort((a, b) => a.JuridiskEnhet.Name.localeCompare(b.JuridiskEnhet.Name));
}

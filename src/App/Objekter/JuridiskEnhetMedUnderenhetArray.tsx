import {Organisasjon} from "./OrganisasjonFraAltinn";

export interface JuridiskEnhetMedUnderEnheterArray {
  JuridiskEnhet: Organisasjon;
  Underenheter: Array<Organisasjon>;
}
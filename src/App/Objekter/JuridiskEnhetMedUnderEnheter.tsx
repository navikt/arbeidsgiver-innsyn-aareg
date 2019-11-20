import {OrganisasjonFraAltinn} from "./OrganisasjonFraAltinn";

export interface JuridiskEnhetMedUnderEnheter {
    JuridiskEnhet: OrganisasjonFraAltinn;
    Underenheter: Array<OrganisasjonFraAltinn>;
}
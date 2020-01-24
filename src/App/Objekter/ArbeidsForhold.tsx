import {Varsel} from "./Varsel";

export interface Arbeidsforhold {
    ansattFom: string;
    ansattTom?: string;
    arbeidsgiver: {
        type: string;
    };
    arbeidstaker: {
        type: string;
        aktoerId: string;
        offentligIdent: string;
        navn: string;
    };
    innrapportertEtterAOrdningen: string;
    navArbeidsforholdId: string;
    opplysningspliktig: {
        type: string;
    };
    permisjonPermitteringsprosent: string;
    sistBekreftet: string;
    stillingsprosent: string;
    type: string;
    varsler?: Varsel[];
    yrke: string;
    yrkesbeskrivelse: string;
}

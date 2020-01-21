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
    permisjonPermitteringsprosent: number;
    sistBekreftet: string;
    stillingsprosent: number;
    type: string;
    varslingskode?: string;
    yrke: string;
    yrkesbeskrivelse: string;
    varslingskodeForklaring?: string;
}

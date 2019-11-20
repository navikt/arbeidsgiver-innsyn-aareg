export interface Arbeidsforhold {
    navn: string;
    ansattFom: string;
    ansattTom: string;
    arbeidsgiver: {
        type: string;
    };
    arbeidstaker: {
        type: string;
        aktoerId: string;
        offentligIdent: string;
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
    varslingskode: string;
    yrke: string;
}
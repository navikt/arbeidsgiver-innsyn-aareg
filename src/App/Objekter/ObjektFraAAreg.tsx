export interface enkelArbeidsforhold {
    arbeidsavtaler: Array<enkelArbeidsavtale>;
    sistbekreftet: string;
    arbeidstaker: arbeidstaker;
    ansettelsesperiode: ansettelsesperiode;
}

export interface arbeidstaker {
    aktoerId: number;
    offentligIdent: string;
}

export interface enkelArbeidsavtale {
    stillingsprosent: number;
    yrke: string;
    antallTimerPrUke: number;
}

export interface ansettelsesperiode {
    periode: periode;
}

export interface periode {
    fom: string;
    tom: string;
}

export interface ObjektFraAAregisteret {
    antall: string;
    arbeidsforholdoversikter: Arbeidsforhold[];
    startrad: string;
    totalAntall: string;
}

export interface Arbeidsforhold {
    ansattFom: string;
    ansattTom: string;
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
    varslingskode: string;
    yrke: string;
}

export const tomResponsFraAareg: ObjektFraAAregisteret = {
    antall: '',
    arbeidsforholdoversikter: [],
    startrad: '',
    totalAntall: ''
};

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
    arbeidsforholdoversikter: arbeidsforhold[];
    startrad: string;
    totalAntall: string;
}

export interface arbeidsforhold {
    navn: string;
    ansattFom: string;
    ansattTom: string;
    arbeidsgiver: {
        type: string;
    };
    arbeidstaker: {
        navn: string
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

export const tomResponsFraAareg: ObjektFraAAregisteret = {
    antall: "",
    arbeidsforholdoversikter: [],
    startrad: "",
    totalAntall: ""
}

export const eksempel1: arbeidsforhold = {
    navn: 'Gøril',
    ansattFom: '12/04/1809',
    ansattTom: '12/04/1905',
    arbeidsgiver: {
        type: 'IKEA',
    },
    arbeidstaker: {
        navn: "Gøril",
        type: 'Selger',
        aktoerId: '444',
        offentligIdent: '777',
    },
    innrapportertEtterAOrdningen: 'JA',
    navArbeidsforholdId: '666',
    opplysningspliktig: {
        type: 'Sjef',
    },
    permisjonPermitteringsprosent: '49%',
    sistBekreftet: '1999',
    stillingsprosent: '21%',
    type: 'hardt arbeid',
    varslingskode: 'Ekstra krise',
    yrke: 'pianist',
};

export const eksempel2: arbeidsforhold = {
    navn: 'Fabian',
    ansattFom: '12/04/2004',
    ansattTom: '12/04/2030',
    arbeidsgiver: {
        type: 'IKEA',
    },
    arbeidstaker: {
        navn: "Fabian",
        type: 'Selger',
        aktoerId: '444',
        offentligIdent: '101',
    },
    innrapportertEtterAOrdningen: 'JA',
    navArbeidsforholdId: '666',
    opplysningspliktig: {
        type: 'Sjef',
    },
    permisjonPermitteringsprosent: '49%',
    sistBekreftet: '1999',
    stillingsprosent: '21%',
    type: 'hardt arbeid',
    varslingskode: 'OK',
    yrke: 'fiolinist',
};

export const eksempel3: arbeidsforhold = {
    navn: 'LeoNardo',
    ansattFom: '12/04/1400',
    ansattTom: '12/04/1903',
    arbeidsgiver: {
        type: 'IKEA',
    },
    arbeidstaker: {
        navn: 'LeoNardo',
        type: 'Selger',
        aktoerId: '444',
        offentligIdent: '177',
    },
    innrapportertEtterAOrdningen: 'JA',
    navArbeidsforholdId: '666',
    opplysningspliktig: {
        type: 'Sjef',
    },
    permisjonPermitteringsprosent: '49%',
    sistBekreftet: '1999',
    stillingsprosent: '21%',
    type: 'hardt arbeid',
    varslingskode: 'Flott',
    yrke: 'gitarist',
};

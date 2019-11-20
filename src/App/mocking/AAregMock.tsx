import fetchMock from 'fetch-mock';
import {ObjektFraAAregisteret} from "../Objekter/ObjektFraAAreg";
import {Arbeidsforhold} from "../Objekter/ArbeidsForhold";
import {hentArbeidsforholdLink} from "../lenker";

export const eksempel1: Arbeidsforhold = {
    navn: 'Gøril',
    ansattFom: '12/04/1809',
    ansattTom: '12/04/1905',
    arbeidsgiver: {
        type: 'IKEA',
    },
    arbeidstaker: {
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

export const eksempel2: Arbeidsforhold = {
    navn: 'Fabian',
    ansattFom: '12/04/2004',
    ansattTom: '12/04/2030',
    arbeidsgiver: {
        type: 'IKEA',
    },
    arbeidstaker: {
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

export const eksempel3: Arbeidsforhold = {
    navn: 'LeoNardo',
    ansattFom: '12/04/1400',
    ansattTom: '12/04/1903',
    arbeidsgiver: {
        type: 'IKEA',
    },
    arbeidstaker: {
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

const genererRespons = (
    antallArbeidsForhold: number
): ObjektFraAAregisteret => {
    let mockObjekt: ObjektFraAAregisteret = {
        antall: "0",
        listeMedArbeidsForhold: [],
        startrad: "0",
        totalAntall: "0"
    };
    for (let i: number = 0; i < Math.floor(antallArbeidsForhold / 4);  i++) {
        mockObjekt.listeMedArbeidsForhold.push(eksempel1);}
    for (let i: number = Math.floor(antallArbeidsForhold / 4); i < Math.floor(antallArbeidsForhold / 2); i++) {
        mockObjekt.listeMedArbeidsForhold.push(eksempel2);
    }
    for (let i: number =  Math.floor (antallArbeidsForhold / 2); i < antallArbeidsForhold; i++) {
        mockObjekt.listeMedArbeidsForhold.push(eksempel3);
    }
    return mockObjekt
};

const objektFraAAregMocked = genererRespons(200);

fetchMock.get(hentArbeidsforholdLink('begin:' + hentArbeidsforholdLink('')), objektFraAAregMocked);
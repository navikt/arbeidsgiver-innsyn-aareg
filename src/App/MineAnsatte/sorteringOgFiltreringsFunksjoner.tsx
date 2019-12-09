import { SorteringsAttributt } from './MineAnsatte';
import {Arbeidsforhold} from "../Objekter/ArbeidsForhold";


export const skrivOmDatoForm = (dato: string) => {
    const nydato = dato.substr(3, 3) + dato.substr(0, 3) + dato.substr(6, 5);
    return nydato;
};

export const sorterBasertPaDatoFom = (arbeidsforhold: Array<Arbeidsforhold>) => {
    console.log("sortering på dato FOM");
    const sortert: Arbeidsforhold[] = arbeidsforhold.sort((a, b) => {
        const nyFormA = skrivOmDatoForm(a.ansattFom);
        const nyFormB = skrivOmDatoForm(b.ansattFom);
        const datoA = new Date(nyFormA);
        const datoB = new Date(nyFormB);
        if (datoA > datoB) {
            console.log(a.ansattFom, ">", b.ansattFom)
            return -1;
        }
        console.log(a.ansattFom, "<", b.ansattFom)
        return 1;
    });
    return sortert;
};

export const sorterBasertPaDatoTom = (arbeidsforhold: Arbeidsforhold[]) => {
    const sortert = arbeidsforhold.sort((a, b) => {
        const nyFormA = skrivOmDatoForm(a.ansattTom);
        const nyFormB = skrivOmDatoForm(b.ansattTom);
        const datoA = new Date(nyFormA);
        const datoB = new Date(nyFormB);
        if (datoA > datoB) {
            return -1;
        }
        return 1;
    });
    return sortert;
};

const sorterBasertPaNavn = (arbeidsforhold: Arbeidsforhold[]) => {
    const sortert = arbeidsforhold.sort((a, b) => {
        if (a.navn > b.navn) {
            return 1;
        }
        return -1;
    });
    return sortert;
};

const sorterBasertPaKode = (arbeidsforhold: Arbeidsforhold[]) => {
    const sortert = arbeidsforhold.sort((a, b) => {
        if (a.varslingskode > b.varslingskode) {
            return 1;
        }
        return -1;
    });
    return sortert;
};

const sorterBasertPaFnr = (arbeidsforhold: Arbeidsforhold[]) => {
    const sortert = arbeidsforhold.sort((a, b) => {
        if (a.arbeidstaker.offentligIdent > b.arbeidstaker.offentligIdent) {
            return 1;
        }
        return -1;
    });
    return sortert;
};

const sorterBasertPaYrke = (arbeidsforhold: Arbeidsforhold[]) => {
    const sortert = arbeidsforhold.sort((a, b) => {
        if (a.yrke > b.yrke) {
            return 1;
        }
        return -1;
    });
    return sortert;
};

export const sorterArbeidsforhold = (
    arbeidsforhold: Arbeidsforhold[],
    atributt: SorteringsAttributt
) => {
    switch (atributt) {
        case SorteringsAttributt.NAVN:
            return sorterBasertPaNavn(arbeidsforhold);
        case SorteringsAttributt.STARTDATO:
            return sorterBasertPaDatoFom(arbeidsforhold);
        case SorteringsAttributt.SLUTTDATO:
            return sorterBasertPaDatoTom(arbeidsforhold);
        case SorteringsAttributt.FNR:
            return sorterBasertPaFnr(arbeidsforhold);
        case SorteringsAttributt.YRKE:
            return sorterBasertPaYrke(arbeidsforhold);
        case SorteringsAttributt.VARSEL:
            return sorterBasertPaKode(arbeidsforhold);

        default:
            return arbeidsforhold;
    }
};

export const filtrerAktiveOgAvsluttede = (arbeidsforhold: Arbeidsforhold[], aktiv: boolean) => {
    const navarendeDato = new Date();
    if (aktiv) {
        return arbeidsforhold.filter(forhold => {
            const avslutningsdato = new Date(skrivOmDatoForm(forhold.ansattTom));
            return avslutningsdato > navarendeDato;
        });
    }
    return arbeidsforhold.filter(forhold => {
        const avslutningsdato = new Date(skrivOmDatoForm(forhold.ansattTom));
        return avslutningsdato < navarendeDato;
    });
};

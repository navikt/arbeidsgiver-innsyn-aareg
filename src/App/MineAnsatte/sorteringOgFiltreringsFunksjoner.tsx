import { SorteringsAttributt } from './MineAnsatte';
import { Arbeidsforhold } from '../Objekter/ArbeidsForhold';

export const sorterBasertPaDatoFom = (arbeidsforhold: Array<Arbeidsforhold>) => {
    const sortert: Arbeidsforhold[] = arbeidsforhold.sort((a, b) => {
        const datoA = new Date(a.ansattFom);
        const datoB = new Date(b.ansattFom);
        if (datoA > datoB) {
            return -1;
        }
        return 1;
    });
    return sortert;
};

export const sorterBasertPaDatoTom = (arbeidsforhold: Arbeidsforhold[]) => {
    const sortert = arbeidsforhold.sort((a, b) => {
        if(!a.ansattTom) {
            return -1
        }
        if(!b.ansattTom) {
            return 1
        }
        const datoA = new Date(a.ansattTom);
        const datoB = new Date(b.ansattTom);
        if (datoA < datoB) {
            return -1;
        }
        return 1;
    });
    return sortert;
};

const sorterBasertPaNavn = (arbeidsforhold: Arbeidsforhold[]) => {
    const sortert = arbeidsforhold.sort((a, b) => {
        if (a.arbeidstaker.navn > b.arbeidstaker.navn) {
            return 1;
        }
        return -1;
    });
    return sortert;
};

const sorterBasertPaKode = (arbeidsforhold: Arbeidsforhold[]) => {
    const sortert = arbeidsforhold.sort((a, b) => {
        if(!a.varslingskode) {
            return -1
        }
        if(!b.varslingskode) {
            return 1
        }
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

export const sorterArbeidsforhold = (arbeidsforhold: Arbeidsforhold[], atributt: SorteringsAttributt) => {
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
            if(forhold.ansattTom) {
            const avslutningsdato = new Date(forhold.ansattTom);
            return avslutningsdato > navarendeDato;
            }else{return true}
        });
    }
    return arbeidsforhold.filter(forhold => {
        if(forhold.ansattTom) {
        const avslutningsdato = new Date(forhold.ansattTom);
        return avslutningsdato < navarendeDato;
        }
        else{return false}
    });
};

export const tellAntallAktiveOgInaktiveArbeidsforhold = (listeMedArbeidsforhold: Arbeidsforhold[]): number[] => {
    const antallOversikt: number[] = [listeMedArbeidsforhold.length,0,0];
    const navarendeDato = new Date();
    listeMedArbeidsforhold.forEach(forhold => {
        if(forhold.ansattTom) {
            const avslutningsdato = new Date(forhold.ansattTom);
            if (avslutningsdato<navarendeDato) {
                antallOversikt[2] ++;
                console.log("avslutningsdato: ", avslutningsdato, "<" ,navarendeDato);
            }
            else {
                antallOversikt[1] ++;
            }
        }else{antallOversikt[1] ++}
    });
    console.log(antallOversikt, antallOversikt[0])
    return antallOversikt;
};

import { SyntheticEvent } from 'react';
import { ToggleKnappPureProps } from 'nav-frontend-toggle';
import {KolonneState, SorteringsAttributt} from './MineAnsatte';
import { Arbeidsforhold } from '../Objekter/ArbeidsForhold';
import { byggArbeidsforholdSokeresultat } from './Sokefelt/byggArbeidsforholdSokeresultat';

export const lagListeBasertPaUrl = (alleArbeidsforhold: Arbeidsforhold[]) => {
    const sortertPå = getSorteringsOgFiltreringsValg('sorter') || '0'
    const reversSortering = getSorteringsOgFiltreringsValg('revers') ? getSorteringsOgFiltreringsValg('revers') === 'true' : true;
    const valgtKolonne: KolonneState = {
        erValgt: true,
        sorteringsAttributt: parseInt(sortertPå),
        reversSortering: reversSortering
    };
    const filtreringsvalg = getSorteringsOgFiltreringsValg('filter') || 'Alle';
    const sokefeltTekst = getSorteringsOgFiltreringsValg('sok') || '';
    const filtrertPaVarsler = getSorteringsOgFiltreringsValg('varsler') === 'true';



    const filtrertListe = byggListeBasertPaPArametere(
        alleArbeidsforhold,
        filtreringsvalg,
        filtrertPaVarsler,
        sokefeltTekst
    );
    const filtrertOgSortertListe: Arbeidsforhold[] = valgtKolonne.reversSortering ?  sorterArbeidsforhold(filtrertListe, valgtKolonne.sorteringsAttributt).reverse() : sorterArbeidsforhold(filtrertListe, valgtKolonne.sorteringsAttributt);
    return filtrertOgSortertListe
}

export const byggListeBasertPaPArametere = (
    originalListe: Arbeidsforhold[],
    filtrerPaAktiveAvsluttede: string,
    skalFiltrerePaVarsler: boolean,
    soketekst: string
) => {
    let nyListe = filtrerAktiveOgAvsluttede(originalListe, filtrerPaAktiveAvsluttede);
    if (soketekst.length > 0) {
        nyListe = byggArbeidsforholdSokeresultat(nyListe, soketekst);
    }
    if (skalFiltrerePaVarsler) {
        nyListe = filtrerPaVarsler(nyListe, skalFiltrerePaVarsler);
    }
    return nyListe;
};

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
    return arbeidsforhold.sort((a, b) => {
        if (!a.ansattTom) {
            return -1;
        }
        if (!b.ansattTom) {
            return 1;
        }
        const datoA = new Date(a.ansattTom);
        const datoB = new Date(b.ansattTom);
        if (datoA < datoB) {
            return -1;
        }
        return 1;
    });
};

const sorterBasertPaNavn = (arbeidsforhold: Arbeidsforhold[]) => {
    return arbeidsforhold.sort((a, b) => {
        if (a.arbeidstaker.navn > b.arbeidstaker.navn) {
            return 1;
        }
        return -1;
    });
};

const sorterBasertPaProsent = (
    arbeidsforhold: Arbeidsforhold[],
    sorterPaStillingsprosent: boolean,
    sorterPaPermisjonsprosent: boolean
) => {
    return arbeidsforhold.sort((a, b) => {
        if (sorterPaStillingsprosent) {
            if (Number(a.stillingsprosent) > Number(b.stillingsprosent)) {
                return 1;
            } else return -1;
        }
        if (sorterPaPermisjonsprosent) {
            if (Number(a.permisjonPermitteringsprosent) > Number(b.permisjonPermitteringsprosent)) {
                return 1;
            } else return -1;
        } else {
            return 1;
        }
    });
};

const sorterBasertPaKode = (arbeidsforhold: Arbeidsforhold[]) => {
    return arbeidsforhold.sort((a, b) => {
        if (!a.varsler) {
            return -1;
        }
        if (!b.varsler) {
            return 1;
        }
        if (a.varsler.length > b.varsler.length) {
            return 1;
        }
        return -1;
    });
};

const sorterBasertPaFnr = (arbeidsforhold: Arbeidsforhold[]) => {
    return arbeidsforhold.sort((a, b) => {
        if (a.arbeidstaker.offentligIdent > b.arbeidstaker.offentligIdent) {
            return 1;
        }
        return -1;
    });
};

const sorterBasertPaYrke = (arbeidsforhold: Arbeidsforhold[]) => {
    return arbeidsforhold.sort((a, b) => {
        if (a.yrkesbeskrivelse > b.yrkesbeskrivelse) {
            return 1;
        }
        return -1;
    });
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
        case SorteringsAttributt.PERMITTERINGSPROSENT:
            return sorterBasertPaProsent(arbeidsforhold, false, true);
        case SorteringsAttributt.STILLINGSPROSENT:
            return sorterBasertPaProsent(arbeidsforhold, true, false);
        default:
            return arbeidsforhold;
    }
};

export const filtrerAktiveOgAvsluttede = (arbeidsforhold: Arbeidsforhold[], filtrerPa: string) => {
    const navarendeDato = new Date();
    if (filtrerPa === 'Aktive') {
        return arbeidsforhold.filter(forhold => {
            if (forhold.ansattTom) {
                const avslutningsdato = new Date(forhold.ansattTom);
                return avslutningsdato > navarendeDato;
            } else {
                return true;
            }
        });
    }
    if (filtrerPa === 'Avsluttede')
        return arbeidsforhold.filter(forhold => {
            if (forhold.ansattTom) {
                const avslutningsdato = new Date(forhold.ansattTom);
                return avslutningsdato <= navarendeDato;
            } else {
                return false;
            }
        });
    return arbeidsforhold;
};

export const tellAntallAktiveOgInaktiveArbeidsforhold = (listeMedArbeidsforhold: Arbeidsforhold[]): number[] => {
    const antallOversikt: number[] = [listeMedArbeidsforhold.length, 0, 0];
    const navarendeDato = new Date();
    listeMedArbeidsforhold.forEach(forhold => {
        if (forhold.ansattTom) {
            const avslutningsdato = new Date(forhold.ansattTom);
            if (avslutningsdato <= navarendeDato) {
                antallOversikt[2]++;
            } else {
                antallOversikt[1]++;
            }
        } else {
            antallOversikt[1]++;
        }
    });
    console.log(antallOversikt)
    return antallOversikt;
};

export const filtrerPaVarsler = (listeMedArbeidsforhold: Arbeidsforhold[], filtrerPaVarsler: boolean) => {
    const filtrertPaVarsler = listeMedArbeidsforhold.filter(forhold => {
        if (forhold.varsler && filtrerPaVarsler) {
            if (forhold.varsler.length) {
                return forhold;
            }
        }
        if (!filtrerPaVarsler) {
            return forhold;
        }
        return null;
    });
    return filtrertPaVarsler;
};

export const getSorteringsOgFiltreringsValg = (variabel: string) => {
    const url = new URL(window.location.href);
    return url.searchParams.get(variabel);
}

export const filtreringValgt = (event: SyntheticEvent<EventTarget>, toggles: ToggleKnappPureProps[]): string => {
    let valg = 'Alle';
    toggles.forEach(toggle => {
        if (toggle.pressed === true && toggle.children) {
            const includesString: boolean = true;
            switch (includesString) {
                case toggle.children.toString().startsWith('Alle'):
                    valg = 'Alle';
                    break;
                case toggle.children.toString().startsWith('Aktive'):
                    valg = 'Aktive';
                    break;
                case toggle.children.toString().startsWith('Avsluttede'):
                    valg = 'Avsluttede';
                    break;
                default:
                    break;
            }
        }
    });
    return valg;
};
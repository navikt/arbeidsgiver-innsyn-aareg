import { SorteringsAttributt } from './MineAnsatte';
import { Arbeidsforhold } from '../Objekter/ArbeidsForhold';
import { byggArbeidsforholdSokeresultat } from './Sokefelt/byggArbeidsforholdSokeresultat';
import { useSearchParameters } from '../../utils/UrlManipulation';

export const StatusFilterValues = ['Alle', 'Aktive', 'Avsluttede'] as const;
export type StatusFilter = (typeof StatusFilterValues)[number];

export function mapToStatusFilter(value: string | null): StatusFilter | null {
    return StatusFilterValues.includes(value as StatusFilter) ? (value as StatusFilter) : null;
}

export type ArbeidsForholdGroupedByFilterStatus = Record<StatusFilter, Arbeidsforhold[]>;
export const arbeidsForholdGroupedByFilterStatus = (
    listeMedArbeidsforhold: Arbeidsforhold[]
): Record<StatusFilter, Arbeidsforhold[]> => {
    return listeMedArbeidsforhold.reduce(
        (acc, forhold) => {
            acc['Alle'].push(forhold);

            const navarendeDato = new Date();
            if (forhold.ansattTom) {
                const avslutningsdato = new Date(forhold.ansattTom);
                if (avslutningsdato < navarendeDato) {
                    acc['Avsluttede'].push(forhold);
                } else {
                    acc['Aktive'].push(forhold);
                }
            } else {
                acc['Aktive'].push(forhold);
            }

            return acc;
        },
        {
            Alle: [],
            Aktive: [],
            Avsluttede: [],
            MedVarsler: [],
        } as ArbeidsForholdGroupedByFilterStatus
    );
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

const sorterBasertPaDatoTom = (arbeidsforhold: Arbeidsforhold[]) => {
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
        case SorteringsAttributt.PERMITTERINGSPROSENT:
            return sorterBasertPaProsent(arbeidsforhold, false, true);
        case SorteringsAttributt.STILLINGSPROSENT:
            return sorterBasertPaProsent(arbeidsforhold, true, false);
        default:
            return arbeidsforhold;
    }
};

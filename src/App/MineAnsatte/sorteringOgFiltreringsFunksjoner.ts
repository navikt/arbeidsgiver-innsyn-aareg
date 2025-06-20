import { Arbeidsforhold } from '../Objekter/ArbeidsForhold';

export const StatusFilterValues = ['Alle', 'Aktive', 'Avsluttede'] as const;
export type StatusFilter = (typeof StatusFilterValues)[number];
export function mapToStatusFilter(value: string | null): StatusFilter | null {
    return StatusFilterValues.includes(value as StatusFilter) ? (value as StatusFilter) : null;
}

export const SorteringValues = [
    'NAVN',
    'FNR',
    'YRKE',
    'STARTDATO',
    'SLUTTDATO',
    'VARSEL',
    'PERMITTERINGSPROSENT',
    'STILLINGSPROSENT',
] as const;
export type Sortering = (typeof SorteringValues)[number];
export function mapToSortering(value: string | null): Sortering | null {
    return SorteringValues.includes(value as Sortering) ? (value as Sortering) : null;
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

export const sorterArbeidsforhold = (arbeidsforhold: Arbeidsforhold[], atributt: Sortering) => {
    switch (atributt) {
        case 'NAVN':
            return arbeidsforhold.sort((a, b) => {
                if (a.arbeidstaker.navn > b.arbeidstaker.navn) {
                    return 1;
                }
                return -1;
            });
        case 'STARTDATO':
            return arbeidsforhold.sort((a, b) => {
                const datoA = new Date(a.ansattFom);
                const datoB = new Date(b.ansattFom);
                if (datoA > datoB) {
                    return -1;
                }
                return 1;
            });
        case 'SLUTTDATO':
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
        case 'FNR':
            return arbeidsforhold.sort((a, b) => {
                if (a.arbeidstaker.offentligIdent > b.arbeidstaker.offentligIdent) {
                    return 1;
                }
                return -1;
            });
        case 'YRKE':
            return arbeidsforhold.sort((a, b) => {
                if (a.yrkesbeskrivelse > b.yrkesbeskrivelse) {
                    return 1;
                }
                return -1;
            });
        case 'VARSEL':
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
        case 'PERMITTERINGSPROSENT':
            return arbeidsforhold.sort((a, b) => {
                if (
                    Number(a.permisjonPermitteringsprosent) >
                    Number(b.permisjonPermitteringsprosent)
                ) {
                    return 1;
                } else return -1;
            });
        case 'STILLINGSPROSENT':
            return arbeidsforhold.sort((a, b) => {
                if (Number(a.stillingsprosent) > Number(b.stillingsprosent)) {
                    return 1;
                } else return -1;
            });
        default:
            return arbeidsforhold;
    }
};

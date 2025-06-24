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

export const sorterArbeidsforhold = (
    arbeidsforhold: Arbeidsforhold[],
    attributt: Sortering,
    direction: 'ascending' | 'descending' | 'none'
): Arbeidsforhold[] => {
    const sorted = [...arbeidsforhold];
    sorted.sort((a, b) => {
        const reverse = direction === 'descending' ? -1 : 1;

        switch (attributt) {
            case 'NAVN':
                return a.arbeidstaker.navn.localeCompare(b.arbeidstaker.navn) * reverse;
            case 'STARTDATO':
                return (
                    (new Date(a.ansattFom).getTime() - new Date(b.ansattFom).getTime()) * reverse
                );
            case 'SLUTTDATO':
                return (
                    (new Date(a.ansattTom ?? 0).getTime() - new Date(b.ansattTom ?? 0).getTime()) *
                    reverse
                );
            case 'FNR':
                return (
                    a.arbeidstaker.offentligIdent.localeCompare(b.arbeidstaker.offentligIdent) *
                    reverse
                );
            case 'YRKE':
                return a.yrkesbeskrivelse.localeCompare(b.yrkesbeskrivelse) * reverse;
            case 'VARSEL':
                return ((a.varsler?.length ?? 0) - (b.varsler?.length ?? 0)) * reverse;
            case 'PERMITTERINGSPROSENT':
                return (
                    (Number(a.permisjonPermitteringsprosent) -
                        Number(b.permisjonPermitteringsprosent)) *
                    reverse
                );
            case 'STILLINGSPROSENT':
                return (Number(a.stillingsprosent) - Number(b.stillingsprosent)) * reverse;
            default:
                return 0;
        }
    });
    return sorted;
};

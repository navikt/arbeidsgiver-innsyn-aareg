import React, { createContext, FunctionComponent, PropsWithChildren, useContext } from 'react';
import { ArbeidsforholdContext } from './ArbeidsforholdProvider';
import { Arbeidsforhold } from '../Objekter/ArbeidsForhold';
import { useSearchParameters } from '../../utils/UrlManipulation';
import { byggArbeidsforholdSokeresultat } from '../MineAnsatte/Sokefelt/byggArbeidsforholdSokeresultat';
import {
    arbeidsForholdGroupedByFilterStatus,
    mapToSortering,
    mapToStatusFilter,
    sorterArbeidsforhold,
    Sortering,
    StatusFilter,
} from '../MineAnsatte/sorteringOgFiltreringsFunksjoner';
import { paginer } from '../MineAnsatte/pagineringsFunksjoner';

export type FiltrerteOgSorterteArbeidsforholdContext = {
    aareg: ArbeidsforholdContext;
    searchParams: {
        side: string;
        sok: string;
        sorter: Sortering;
        revers: boolean;
        varsler: boolean;
        filter: StatusFilter;
    };
    setSearchParams: (params: {
        sok?: string;
        sorter?: Sortering;
        revers?: boolean;
        varsler?: boolean;
        filter?: StatusFilter;
        side: string;
    }) => void;
    count: Record<StatusFilter | 'MedVarsler', number>;
    antallSider: number;
    grouped: Record<StatusFilter, Arbeidsforhold[]>;
    currentSelection: Arbeidsforhold[];
};
export const FiltrerteOgSorterteArbeidsforholdContext =
    createContext<FiltrerteOgSorterteArbeidsforholdContext>({
        aareg: {} as ArbeidsforholdContext,
        searchParams: {
            sok: '',
            side: '1',
            sorter: 'NAVN',
            revers: false,
            varsler: false,
            filter: 'Alle',
        },
        setSearchParams: () => {},
        count: {
            Alle: 0,
            Aktive: 0,
            Avsluttede: 0,
            MedVarsler: 0,
        },
        antallSider: 0,
        grouped: {
            Alle: [],
            Aktive: [],
            Avsluttede: [],
        },
        currentSelection: [],
    });

const ARBEIDSFORHOLDPERSIDE = 25;
const useFiltreringOgSortering = (
    alleArbeidsforhold: Arbeidsforhold[]
): Omit<FiltrerteOgSorterteArbeidsforholdContext, 'aareg'> => {
    const { getSearchParameter, setSearchParameter } = useSearchParameters();
    const sok = getSearchParameter('sok') || '';
    const sorter = mapToSortering(getSearchParameter('sorter')) ?? 'NAVN';
    const side = getSearchParameter('side') || '1';
    const revers = getSearchParameter('revers') === 'true';
    const varsler = getSearchParameter('varsler') === 'true';
    const filter = mapToStatusFilter(getSearchParameter('filter')) ?? 'Alle';

    const groupedByFilterStatus = arbeidsForholdGroupedByFilterStatus(alleArbeidsforhold);

    let currentSelection = groupedByFilterStatus[filter];
    if (varsler) {
        currentSelection = currentSelection.filter((forhold) => (forhold.varsler ?? []).length > 0);
    }
    if (sok.length > 0) {
        currentSelection = byggArbeidsforholdSokeresultat(currentSelection, sok);
    }
    currentSelection = revers
        ? sorterArbeidsforhold(currentSelection, sorter, 'descending')
        : sorterArbeidsforhold(currentSelection, sorter, 'ascending');

    const antallSider = Math.ceil(currentSelection.length / ARBEIDSFORHOLDPERSIDE);
    currentSelection = paginer(parseInt(side, 10), ARBEIDSFORHOLDPERSIDE, currentSelection);

    const setSearchParams = ({
        side = '1',
        sok,
        sorter,
        revers,
        varsler,
        filter,
    }: {
        side?: string;
        sok?: string;
        sorter?: Sortering;
        revers?: boolean;
        varsler?: boolean;
        filter?: StatusFilter;
    }) => {
        setSearchParameter({
            side,
            ...(sok !== undefined && { sok }),
            ...(sorter !== undefined && { sorter }),
            ...(revers !== undefined && { revers: String(revers) }),
            ...(varsler !== undefined && { varsler: String(varsler) }),
            ...(filter !== undefined && { filter }),
        });
    };

    return {
        searchParams: {
            side,
            sok,
            sorter,
            revers,
            varsler,
            filter,
        },
        setSearchParams,
        count: {
            Alle: groupedByFilterStatus.Alle.length,
            Aktive: groupedByFilterStatus.Aktive.length,
            Avsluttede: groupedByFilterStatus.Avsluttede.length,
            MedVarsler: groupedByFilterStatus.Alle.filter(
                (forhold) => (forhold.varsler ?? []).length > 0
            ).length,
        },
        grouped: groupedByFilterStatus,
        antallSider,
        currentSelection,
    };
};

const FiltrerteOgSorterteArbeidsforholdProvider: FunctionComponent<PropsWithChildren> = ({
    children,
}) => {
    const aareg: ArbeidsforholdContext = useContext(ArbeidsforholdContext);

    const alleArbeidsforhold =
        aareg?.lastestatus?.status === 'ferdig' ? aareg.lastestatus.arbeidsforhold : [];

    const context = useFiltreringOgSortering(alleArbeidsforhold);

    return (
        <FiltrerteOgSorterteArbeidsforholdContext.Provider value={{ aareg, ...context }}>
            {children}
        </FiltrerteOgSorterteArbeidsforholdContext.Provider>
    );
};

export default FiltrerteOgSorterteArbeidsforholdProvider;

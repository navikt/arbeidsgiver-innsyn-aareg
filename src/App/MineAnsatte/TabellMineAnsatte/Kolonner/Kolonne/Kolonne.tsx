import React from 'react';
import { SorteringsAttributt } from '../../../MineAnsatte';
import { useSearchParameters } from '../../../../../utils/UrlManipulation';
import './Kolonne.css';

interface Props {
    label: string;
    attributt: SorteringsAttributt;
}

const Kolonne = (props: Props) => {
    const { getSearchParameter, setSearchParameter } = useSearchParameters();

    const erReversSortert = getSearchParameter('revers') === 'true';
    const erValgt = getSearchParameter('sorter') === props.attributt.toString();

    const setKolonneTilAktiv = () => {
        if (erValgt) {
            setSearchParameter({ revers: (!erReversSortert).toString() });
        } else {
            setSearchParameter({ revers: 'false', sorter: props.attributt.toString() });
        }
    };

    let klasseNavnPostfiks = '';
    let AriaSort: 'none' | 'ascending' | 'descending' | 'other' = 'none';

    if (erValgt) {
        AriaSort = erReversSortert ? 'descending' : 'ascending';
        klasseNavnPostfiks = erReversSortert ? 'desc' : 'asc';
    }

    return (
        <th
            className={`tabell__th--sortert-${klasseNavnPostfiks} tabell__button`}
            role="columnheader"
            aria-sort={AriaSort}
        >
            <button
                aria-label={`Sorter ${props.label} ${erReversSortert ? 'stigende' : 'synkende'}`}
                onClick={() => {
                    setKolonneTilAktiv();
                }}
            >
                {props.label}
            </button>
        </th>
    );
};

export default Kolonne;

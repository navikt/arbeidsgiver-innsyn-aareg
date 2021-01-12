import React from 'react';
import { SorteringsAttributt } from '../../../MineAnsatte';
import Lenke from 'nav-frontend-lenker';
import './Kolonne.less';
import { useSearchParameters } from '../../../../../utils/UrlManipulation';

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
            className={`tabell__th--sortert-${klasseNavnPostfiks} tabell__lenke`}
            role="columnheader"
            aria-sort={AriaSort}
        >
            <Lenke
                role="button"
                href={''}
                onClick={e => {
                    setKolonneTilAktiv();
                    e.preventDefault();
                }}
            >
                {props.label}
            </Lenke>
        </th>
    );
};

export default Kolonne;

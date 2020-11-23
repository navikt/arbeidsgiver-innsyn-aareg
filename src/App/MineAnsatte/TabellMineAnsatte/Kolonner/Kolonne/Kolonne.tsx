import React from 'react';
import {  SorteringsAttributt } from '../../../MineAnsatte';
import Lenke from "nav-frontend-lenker";
import {getVariabelFraUrl} from "../../../sorteringOgFiltreringsFunksjoner";
import './Kolonne.less';

interface Props {
    label: string;
    attributt: SorteringsAttributt;
    setParameterIUrl: (parameter: string, variabel: string) => void;
}

const Kolonne = (props: Props) => {
    let erReversSortert = getVariabelFraUrl('revers') === 'true'
    const erValgt = getVariabelFraUrl("sorter") === props.attributt.toString();

    const setKolonneTilAktiv = () => {
        props.setParameterIUrl("sorter", props.attributt.toString())
        if (erValgt) {
            erReversSortert = !erReversSortert;
            props.setParameterIUrl("revers", erReversSortert.toString())
        }
    };

    let klasseNavnPostfiks = '';
    let AriaSort: "none" | "ascending" | "descending" | "other" = "none"
    if (erValgt) {
        AriaSort = erReversSortert? "descending" : "ascending"
        klasseNavnPostfiks = erReversSortert? "desc" : "asc"
    }

    return (
        <th className={`tabell__th--sortert-${klasseNavnPostfiks} tabell__lenke`} role = "columnheader" aria-sort={AriaSort}>
           <Lenke role="button" href={""} onClick={(e) => {
               setKolonneTilAktiv();
               e.preventDefault()
           }
           }>
               {props.label}</Lenke>
        </th>
    );
};

export default Kolonne;
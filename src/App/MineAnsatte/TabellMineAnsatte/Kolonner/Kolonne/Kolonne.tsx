import React from 'react';
import { KolonneState, SorteringsAttributt } from '../../../MineAnsatte';
import Lenke from "nav-frontend-lenker";
import {getVariabelFraUrl} from "../../../sorteringOgFiltreringsFunksjoner";

interface Props {
    label: string;
    attributt: SorteringsAttributt;
    setParameterIUrl: (parameter: string, variabel: string) => void;
}

const Kolonne = (props: Props) => {
    const erReversSortert = getVariabelFraUrl('revers') === 'true'
    const erValgt = getVariabelFraUrl("sorter") === props.attributt.toString();

    let kolonneState: KolonneState = {
        erValgt: erValgt,
        sorteringsAttributt: props.attributt,
        reversSortering: erReversSortert
    };

const setKolonneTilAktiv = () => {
        props.setParameterIUrl("sorter", kolonneState.sorteringsAttributt.toString())
        if (kolonneState.erValgt) {
            kolonneState.reversSortering = !kolonneState.reversSortering;
            props.setParameterIUrl("revers", kolonneState.reversSortering.toString())
        }
    };

    let klasseNavnPostfiks = '';
    let AriaSort: "none" | "ascending" | "descending" | "other" = "none"
    if (erValgt) {
        AriaSort = erReversSortert? "descending" : "ascending"
        klasseNavnPostfiks = erReversSortert? "desc" : "asc"
    }

    return (
        <th className={`tabell__th--sortert-${klasseNavnPostfiks}`}  role = "columnheader" aria-label={`sorter på ${props.label}`} aria-sort={AriaSort}>
           <Lenke href={"#"} onClick={() => setKolonneTilAktiv()}>{props.label}</Lenke>
        </th>
    );
};

export default Kolonne;
import React from 'react';
import pilOpp from './pil-opp.svg';
import pilNed from './pil-ned.svg';
import sorteringsikon from './sorteringsikon.svg';
import { KolonneState, SorteringsAttributt } from '../../../MineAnsatte';
import './Kolonne.less';

interface Props {
    label: string;
    attributt: SorteringsAttributt;
    setNavarendeKolonne: (kolonne: KolonneState) => void;
    navarendeKolonne: KolonneState;
    setParameterIUrl: (parameter: string, variabel: string) => void;
}

const Kolonne = (props: Props) => {
    const erValgt = props.navarendeKolonne.sorteringsAttributt === props.attributt;
    const erReversSortert = erValgt && props.navarendeKolonne.reversSortering === true;

    let kolonneState: KolonneState = {
        erValgt: props.navarendeKolonne.sorteringsAttributt === props.attributt,
        sorteringsAttributt: props.attributt,
        reversSortering: erReversSortert
    };

    let bildeSrc = sorteringsikon;
    if (erValgt) {
        if (erReversSortert) {
            bildeSrc = pilOpp;
        }
        if (!erReversSortert) {
            bildeSrc = pilNed;
        }
    }

    const setKolonneTilAktiv = () => {
        props.setParameterIUrl("sorter", kolonneState.sorteringsAttributt.toString())
        if (kolonneState.erValgt) {
            kolonneState.reversSortering = !kolonneState.reversSortering;
            props.setParameterIUrl("revers", kolonneState.reversSortering.toString())
        }
        props.setNavarendeKolonne(kolonneState);
    };

    return (
        <th className="kolonne__th" onClick={() => setKolonneTilAktiv()}>
            <button className="kolonne__sorteringsbutton">{props.label}</button>
            <img src={bildeSrc} className="kolonne__sorteringspil" alt="pil-opp" />
        </th>
    );
};

export default Kolonne;

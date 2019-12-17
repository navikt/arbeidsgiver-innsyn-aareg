import React, { FunctionComponent } from 'react';
import KolonnerFullSkjerm from './Kolonner/Kolonner';

import './TabellMineAnsatte.less';
import 'nav-frontend-tabell-style';
import { KolonneState } from '../MineAnsatte';
import {Arbeidsforhold} from "../../Objekter/ArbeidsForhold";
import {Link} from "react-router-dom";



interface Props {
    className?: string;
    listeMedArbeidsForhold: Arbeidsforhold[];
    setNavarendeKolonne: (kolonne: KolonneState) => void;
    byttSide: (indeks: number) => void;
    navarendeKolonne: KolonneState;
    settValgtArbeidsgiver:(indeks: number) => void;
    valgtBedrift:string
}

const TabellMineAnsatte: FunctionComponent<Props> = props => {
    function oppdaterValgtArbeidsgiver (fnr:string){
        const fnrSomheltall: number = parseInt(fnr);
        props.settValgtArbeidsgiver(fnrSomheltall);
    }
    const rader = props.listeMedArbeidsForhold.map(arbeidsforhold => {
        return (
            <tr key={arbeidsforhold.navArbeidsforholdId}>
                <td className={'td'}><div onClick={() => oppdaterValgtArbeidsgiver(arbeidsforhold.arbeidstaker.offentligIdent)}><Link  to={"enkeltarbeidsforhold/?bedrift=" + props.valgtBedrift +"&arbeidsforhold="+arbeidsforhold.navArbeidsforholdId}>{arbeidsforhold.arbeidstaker.navn}</Link></div></td>
                <td className={'td'}>{arbeidsforhold.arbeidstaker.offentligIdent}</td>
                <td className={'td'}>{arbeidsforhold.yrke}</td>
                <td className={'td'}>{arbeidsforhold.ansattFom}</td>
                <td className={'td'}>{arbeidsforhold.ansattTom}</td>
                <td className={'td'}>{arbeidsforhold.varslingskode}</td>
            </tr>
        );
    });

    return (
        <div className="tabell-container">
            <table className={'tabell tabell--stripet'}>
                <KolonnerFullSkjerm
                    setNavarendeKolonne={props.setNavarendeKolonne}
                    navarendeKolonne={props.navarendeKolonne}
                />
                <tbody>{rader}</tbody>
            </table>
        </div>
    );
};

export default TabellMineAnsatte;

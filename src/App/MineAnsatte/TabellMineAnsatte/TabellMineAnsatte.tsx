import React, { FunctionComponent } from 'react';
import KolonnerFullSkjerm from './Kolonner/Kolonner';

import './TabellMineAnsatte.less';
import 'nav-frontend-tabell-style';
import { KolonneState } from '../MineAnsatte';
import {Arbeidsforhold} from "../../Objekter/ArbeidsForhold";
import Lenke from "nav-frontend-lenker";



interface Props {
    className?: string;
    listeMedArbeidsForhold: Arbeidsforhold[];
    setNavarendeKolonne: (kolonne: KolonneState) => void;
    byttSide: (indeks: number) => void;
    navarendeKolonne: KolonneState;
    settValgtArbeidsgiver:(indeks: number) => void;
}

const TabellMineAnsatte: FunctionComponent<Props> = props => {
    function oppdaterValgtArbeidsgiver (fnr:string){
        const fnrSomheltall: number = parseInt(fnr);
        props.settValgtArbeidsgiver(fnrSomheltall);
    }
    const rader = props.listeMedArbeidsForhold.map(arbeidsforhold => {
        return (
            <tr key={arbeidsforhold.navArbeidsforholdId}>
                <td className={'td'}><div ><Lenke onClick={() => oppdaterValgtArbeidsgiver(arbeidsforhold.arbeidstaker.offentligIdent)} href={"enkeltarbeidsforhold/?arbeidsforhold="+arbeidsforhold.navArbeidsforholdId}>{arbeidsforhold.arbeidstaker.navn}</Lenke></div></td>
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

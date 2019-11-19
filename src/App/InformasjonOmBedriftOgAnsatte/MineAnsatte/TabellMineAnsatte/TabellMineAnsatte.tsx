import React, { FunctionComponent } from 'react';
import KolonnerFullSkjerm from './Kolonner/Kolonner';
import { arbeidsforhold } from '../../../../Objekter/Ansatte';
import './TabellMineAnsatte.less';
import 'nav-frontend-tabell-style';
import { KolonneState } from '../MineAnsatte';

interface Props {
    className?: string;
    listeMedArbeidsForhold: arbeidsforhold[];
    setNavarendeKolonne: (kolonne: KolonneState) => void;
    byttSide: (indeks: number) => void;
    navarendeKolonne: KolonneState;
}

const TabellMineAnsatte: FunctionComponent<Props> = props => {
    let index: number = 0;
    const rader = props.listeMedArbeidsForhold.map(arbeidsforhold => {
        index++;
        return (
            <tr>
                <td className={'td'}>{arbeidsforhold.navn + index.toString()}</td>
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

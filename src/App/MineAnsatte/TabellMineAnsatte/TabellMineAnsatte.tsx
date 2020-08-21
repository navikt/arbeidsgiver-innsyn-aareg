import React, { FunctionComponent } from 'react';
import 'nav-frontend-tabell-style';
import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';
import { KolonneState } from '../MineAnsatte';
import KolonnerFullSkjerm from './Kolonner/Kolonner';
import YrkesbeskrivelsePopover from './KolonnerMedTooltip/YrkesbeskrivelsePopover';
import NavnPopover from './KolonnerMedTooltip/NavnPopover';
import VarslingPopover from './KolonnerMedTooltip/VarslingPopover';
import './TabellMineAnsatte.less';

interface Props {
    className?: string;
    listeMedArbeidsForhold: Arbeidsforhold[];
    fullListe: Arbeidsforhold[];
    setNavarendeKolonne: (kolonne: KolonneState) => void;
    byttSide: (indeks: number) => void;
    navarendeKolonne: KolonneState;
    setValgtArbeidsforhold: (arbeidsforhold: Arbeidsforhold) => void;
    valgtBedrift: string;
    setParameterIUrl: (parameter: string, variabel: string) => void;

}

const TabellMineAnsatte: FunctionComponent<Props> = props => {


    const rader = props.listeMedArbeidsForhold.map(arbeidsforhold => {
        return (
            <tr key={arbeidsforhold.navArbeidsforholdId}>
                <td className="td">
                    <NavnPopover
                        arbeidsforhold={arbeidsforhold}
                        setValgtArbeidsforhold={props.setValgtArbeidsforhold}
                        valgtBedrift={props.valgtBedrift}
                    />
                </td>
                <td className="td">{arbeidsforhold.arbeidstaker.offentligIdent}</td>
                <td className="td">{arbeidsforhold.ansattFom}</td>
                <td className="td">{arbeidsforhold.ansattTom}</td>
                <td className="td">{arbeidsforhold.stillingsprosent}</td>
                <td className="td">
                    <YrkesbeskrivelsePopover tekst={arbeidsforhold.yrkesbeskrivelse} />
                </td>
                <td className="td">
                    {arbeidsforhold.varsler && (
                        <div>
                            <VarslingPopover varsler={arbeidsforhold.varsler} />
                        </div>
                    )}
                </td>
            </tr>
        );
    });

    return (
        <div className="tabell-container">
            <table className="tabell tabell--stripet">
                <KolonnerFullSkjerm
                    setParameterIUrl={props.setParameterIUrl}
                    setNavarendeKolonne={props.setNavarendeKolonne}
                    navarendeKolonne={props.navarendeKolonne}
                />
                <tbody>{rader}</tbody>
            </table>
        </div>
    );
};

export default TabellMineAnsatte;

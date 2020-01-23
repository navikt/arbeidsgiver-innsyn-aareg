import React, { FunctionComponent} from 'react';
import KolonnerFullSkjerm from './Kolonner/Kolonner';

import './TabellMineAnsatte.less';
import 'nav-frontend-tabell-style';
import { KolonneState } from '../MineAnsatte';
import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';
import { Arbeidstaker } from '../../Objekter/Arbeidstaker';
import VarslingPopover from './KolonnerMedTooltip/VarslingPopover';
import YrkesbeskrivelsePopover from "./KolonnerMedTooltip/YrkesbeskrivelsePopover";
import NavnPopover from "./KolonnerMedTooltip/NavnPopover";

interface Props {
    className?: string;
    listeMedArbeidsForhold: Arbeidsforhold[];
    setNavarendeKolonne: (kolonne: KolonneState) => void;
    byttSide: (indeks: number) => void;
    navarendeKolonne: KolonneState;
    settValgtArbeidsgiver: (valgtArbeidstaker: Arbeidstaker) => void;
    valgtBedrift: string;
}

const TabellMineAnsatte: FunctionComponent<Props> = props => {
    const rader = props.listeMedArbeidsForhold.map(arbeidsforhold => {
        return (
            <tr key={arbeidsforhold.navArbeidsforholdId}>
                <td className={'td'}>
                    <NavnPopover arbeidsforhold={arbeidsforhold} settValgtArbeidsgiver={props.settValgtArbeidsgiver} valgtBedrift={props.valgtBedrift} />
                </td>
                <td className={'td'}>{arbeidsforhold.arbeidstaker.offentligIdent}</td>
                <td className={'td'}>{arbeidsforhold.ansattFom}</td>
                <td className={'td'}>{arbeidsforhold.ansattTom}</td>
                <td className={'td'}>{arbeidsforhold.stillingsprosent}</td>
                <td className={'td'}>
                        <YrkesbeskrivelsePopover tekst={arbeidsforhold.yrke}/>
                </td>
                <td className={'td'}>
                    {arbeidsforhold.varslingskode && arbeidsforhold.varslingskodeForklaring &&
                    <div>
             <VarslingPopover  tekst={arbeidsforhold.varslingskodeForklaring}/>
                    </div>
                    }
                </td>
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

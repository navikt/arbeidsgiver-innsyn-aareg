import React, { FunctionComponent, useContext } from 'react';

import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';
import KolonnerFullSkjerm from './Kolonner/Kolonner';
import YrkesbeskrivelsePopover from './KolonnerMedTooltip/YrkesbeskrivelsePopover';
import NavnPopover from './KolonnerMedTooltip/NavnPopover';
import VarslingPopover from './KolonnerMedTooltip/VarslingPopover';
import './TabellMineAnsatte.css';
import { datoformat } from '../utils';
import { FiltrerteOgSorterteArbeidsforholdContext } from '../../Context/FiltrerteOgSorterteArbeidsforholdProvider';

const TabellMineAnsatte: FunctionComponent = () => {
    const { currentSelection } = useContext(FiltrerteOgSorterteArbeidsforholdContext);

    const rader = currentSelection.map((arbeidsforhold: Arbeidsforhold) => {
        return (
            <tr key={arbeidsforhold.navArbeidsforholdId}>
                <td className="td">
                    <NavnPopover arbeidsforhold={arbeidsforhold} />
                </td>
                <td className="td">{arbeidsforhold.arbeidstaker.offentligIdent}</td>
                <td className="td">{datoformat(arbeidsforhold.ansattFom)}</td>
                <td className="td">{datoformat(arbeidsforhold.ansattTom)}</td>
                <td className="td">{arbeidsforhold.stillingsprosent + ' %'}</td>
                <td className="td">
                    <YrkesbeskrivelsePopover tekst={arbeidsforhold.yrkesbeskrivelse} />
                </td>
                <td className="td">
                    {arbeidsforhold.varsler && <VarslingPopover varsler={arbeidsforhold.varsler} />}
                </td>
            </tr>
        );
    });

    return (
        <table className="tabell tabell--stripet tabell-container">
            <KolonnerFullSkjerm />
            <tbody>{rader}</tbody>
        </table>
    );
};

export default TabellMineAnsatte;

import React, { FunctionComponent, useState } from 'react';
import KolonnerFullSkjerm from './Kolonner/Kolonner';

import './TabellMineAnsatte.less';
import 'nav-frontend-tabell-style';
import { KolonneState } from '../MineAnsatte';
import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';
import { Link } from 'react-router-dom';
import { Arbeidstaker } from '../../Objekter/Arbeidstaker';
import VarslingPopover from './VarslingPopover/VarslingPopover';
import Popover from 'nav-frontend-popover';
import varselikon from "./varselikon.svg";
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

    function oppdaterValgtArbeidsgiver(fnr: string, navn: string) {
        const fnrSomheltall: number = parseInt(fnr);
        props.settValgtArbeidsgiver({ fnr: fnrSomheltall, navn: navn });
    }
    const rader = props.listeMedArbeidsForhold.map(arbeidsforhold => {
        return (
            <tr key={arbeidsforhold.navArbeidsforholdId}>
                <td className={'td'}>
                    <div
                        onClick={() =>
                            oppdaterValgtArbeidsgiver(
                                arbeidsforhold.arbeidstaker.offentligIdent,
                                arbeidsforhold.arbeidstaker.navn
                            )
                        }
                    >
                        <Link
                            to={
                                'enkeltarbeidsforhold/?bedrift=' +
                                props.valgtBedrift +
                                '&arbeidsforhold=' +
                                arbeidsforhold.navArbeidsforholdId
                            }
                        >
                            {arbeidsforhold.arbeidstaker.navn}
                        </Link>
                    </div>
                </td>
                <td className={'td'}>{arbeidsforhold.arbeidstaker.offentligIdent}</td>
                <td className={'td'}>{arbeidsforhold.yrke}</td>
                <td className={'td'}>{arbeidsforhold.ansattFom}</td>
                <td className={'td'}>{arbeidsforhold.ansattTom}</td>
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

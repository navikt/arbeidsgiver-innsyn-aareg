import React, { FunctionComponent } from 'react';
import './Ansatt.less';

import AttributtVisning from './AttributtVisning/AttributtVisning';
import { Link } from 'react-router-dom';
import { Arbeidstaker } from '../../../Objekter/Arbeidstaker';
import { Arbeidsforhold } from '../../../Objekter/ArbeidsForhold';

interface Props {
    className?: string;
    arbeidsforhold: Arbeidsforhold;
    settValgtArbeidsgiver: (valgtArbeidstaker: Arbeidstaker) => void;
    valgtBedrift: string;
}

const Ansatt: FunctionComponent<Props> = props => {
    function oppdaterValgtArbeidsgiver(fnr: string, navn: string) {
        const fnrSomheltall: number = parseInt(fnr);
        props.settValgtArbeidsgiver({ fnr: fnrSomheltall, navn: navn });
    }

    return (
        <li className="arbeidsforhold">
            <ul className="arbeidsforhold__liste">
                <div>
                    <li className="attributt">
                        <div className={'attributt__navn'}> Navn</div>
                        <div
                            onClick={() =>
                                oppdaterValgtArbeidsgiver(
                                    props.arbeidsforhold.arbeidstaker.offentligIdent,
                                    props.arbeidsforhold.arbeidstaker.navn
                                )
                            }
                        >
                            <Link
                                to={
                                    'enkeltarbeidsforhold/?bedrift=' +
                                    props.valgtBedrift +
                                    '&arbeidsforhold=' +
                                    props.arbeidsforhold.navArbeidsforholdId
                                }
                            >
                                {props.arbeidsforhold.arbeidstaker.navn}
                            </Link>
                        </div>
                    </li>
                </div>
                <AttributtVisning
                    attributt="Offentlig Ident"
                    attributtVerdi={props.arbeidsforhold.arbeidstaker.offentligIdent}
                />
                <AttributtVisning attributt="Startet" attributtVerdi={props.arbeidsforhold.ansattFom} />
                <AttributtVisning attributt="Slutter" attributtVerdi={props.arbeidsforhold.ansattTom} />
                <AttributtVisning
                    attributt="Stillingsprosent %"
                    attributtVerdi={props.arbeidsforhold.stillingsprosent}
                />
                <AttributtVisning attributt="Yrke" attributtVerdi={props.arbeidsforhold.yrke} />
                {props.arbeidsforhold.varslingskodeForklaring && (
                    <AttributtVisning
                        attributt="Varsling"
                        attributtVerdi={props.arbeidsforhold.varslingskodeForklaring}
                    />
                )}
            </ul>
        </li>
    );
};

export default Ansatt;

import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { Arbeidsforhold } from '../../../Objekter/ArbeidsForhold';
import AttributtVisning from './AttributtVisning/AttributtVisning';
import './Ansatt.less';
import {loggBrukerTrykketPaVarsel} from "../../../amplitudefunksjonerForLogging";

interface Props {
    className?: string;
    arbeidsforhold: Arbeidsforhold;
    setValgtArbeidsforhold: (arbeidsforhold: Arbeidsforhold) => void;
    valgtBedrift: string;
    nesteArbeidsforhold?: Arbeidsforhold;
}

const Ansatt: FunctionComponent<Props> = props => {

  const oppdaterValgtArbeidsforhold= (arbeidsforhold: Arbeidsforhold) => {
    props.setValgtArbeidsforhold(arbeidsforhold)
    if (props.arbeidsforhold.varsler?.length) {
      loggBrukerTrykketPaVarsel();
    }
  };

    return (
        <li className="arbeidsforhold">
            <ul className="arbeidsforhold__liste">
                <li className="attributt">
                    <div className="attributt__navn">Navn</div>
                    <div
                        className="attributt__verdi"
                        onClick={() =>
                            oppdaterValgtArbeidsforhold(
                                props.arbeidsforhold
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
                <AttributtVisning attributt="Yrke" attributtVerdi={props.arbeidsforhold.yrkesbeskrivelse} />
                {props.arbeidsforhold.varsler && (
                    <AttributtVisning
                        attributt="Varsling"
                        attributtVerdi={props.arbeidsforhold.varsler[0].varslingskodeForklaring}
                    />
                )}
            </ul>
        </li>
    );
};

export default Ansatt;

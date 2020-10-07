import {AlertStripeAdvarsel} from "nav-frontend-alertstriper";
import React, {FunctionComponent} from "react";
import {Arbeidsforhold} from "../../../Objekter/ArbeidsForhold";
import './EnkeltArbeidsforholdVarselVisning.less';

interface Props {
    valgtArbeidsforhold: Arbeidsforhold | null;
  }
const EnkeltArbeidsforholdVarselVisning: FunctionComponent<Props> = ( props:Props) => {
    if (props.valgtArbeidsforhold?.varsler) {
        return (
            <div className="enkelt-arbeidsforhold-varsel-container">
            <AlertStripeAdvarsel>
                <ul className={'enkelt-arbeidsforhold-varsel-liste'}>
                {props.valgtArbeidsforhold.varsler.map(varsel => (
                    <li key={varsel.varslingskode} style={{ padding: '0 0 1rem 0' }}>
                        {varsel.varslingskodeForklaring}
                    </li>
                ))}
                </ul>
             </AlertStripeAdvarsel>
            </div>
        )
    }
    else return null;
};

export default EnkeltArbeidsforholdVarselVisning;

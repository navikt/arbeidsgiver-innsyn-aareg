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
                {props.valgtArbeidsforhold.varsler.map(varsel => (
                    <div key={varsel.varslingskode} style={{ padding: '0 0 1rem 0' }}>
                        {varsel.varslingskodeForklaring}
                    </div>
                ))}
             </AlertStripeAdvarsel>
            </div>
        )
    }
    else return null;
};

export default EnkeltArbeidsforholdVarselVisning;

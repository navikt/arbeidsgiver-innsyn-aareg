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
                <div>{props.valgtArbeidsforhold.varsler[0].varslingskodeForklaring}</div>
            </AlertStripeAdvarsel>
            </div>
        )
    }
    else return null;
};

export default EnkeltArbeidsforholdVarselVisning;

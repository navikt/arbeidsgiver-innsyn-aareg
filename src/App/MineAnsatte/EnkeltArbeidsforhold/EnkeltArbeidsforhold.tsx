import React, {FunctionComponent} from "react";
import {DetaljertArbeidsforhold } from "@navikt/arbeidsforhold/dist";
import environment from "../../../utils/environment";

const miljo = () => {
    if (environment.MILJO === 'dev-sbs') {
        return "Q0"
    }
    return "LOCAL"
};

export const EnkeltArbeidsforhold:FunctionComponent = props =>{
    const locale = "nb" as "nb" | "en";
    const arbeidsforholdIdFraUrl = new URL(window.location.href).searchParams.get('arbeidsforhold');
    if(arbeidsforholdIdFraUrl) {
        const arbeidsforholdId = parseInt(arbeidsforholdIdFraUrl);
        return <div>
            <DetaljertArbeidsforhold
                locale={locale}
                miljo={miljo()}
                navArbeidsforholdId={arbeidsforholdId}
                rolle={"ARBEIDSGIVER"}
                fnrArbeidstaker={27127424204}
            />
        </div>
    }
    return <div>
       Ugyldig arbeidsforholdId
    </div>
};
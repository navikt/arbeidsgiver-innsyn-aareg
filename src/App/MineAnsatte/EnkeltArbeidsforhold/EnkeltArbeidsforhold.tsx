import React, {FunctionComponent} from "react";
import {DetaljertArbeidsforhold } from "@navikt/arbeidsforhold/dist";



const arbeidsforholdIdFraUrl = () => new URL(window.location.href).searchParams.get('arbeidsforhold');

export const EnkeltArbeidsforhold:FunctionComponent = props =>{
    const locale = "nb" as "nb" | "en";
    const miljo = "LOCAL";
    const arbeidsforholdIdFraUrl = new URL(window.location.href).searchParams.get('arbeidsforhold');
    if(arbeidsforholdIdFraUrl) {
        const arbeidsforholdId = parseInt(arbeidsforholdIdFraUrl);
        return <div>
            <DetaljertArbeidsforhold
                locale={locale}
                miljo={miljo}
                navArbeidsforholdId={arbeidsforholdId} />
        </div>
    }
    return <div>
       Ugyldig arbeidsforholdId
    </div>
};
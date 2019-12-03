import React, {FunctionComponent} from "react";
import {DetaljertArbeidsforhold} from "@navikt/arbeidsforhold/dist";

export interface EnkeltArbeidsforholdProps {
    navArbeidsforholdId: number;
}

const arbeidsforholdIdFraUrl = () => new URL(window.location.href).searchParams.get('arbeidsforhold');

export const EnkeltArbeidsforhold:FunctionComponent<EnkeltArbeidsforholdProps> = props =>{
    const locale = "nb" as "nb" | "en";
    const miljo = "LOCAL";
    const arbeidsforholdIdFraUrl = new URL(window.location.href).searchParams.get('arbeidsforhold');

    console.log(arbeidsforholdIdFraUrl);
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
import React, {FunctionComponent} from "react";
import {DetaljertArbeidsforhold} from "@navikt/arbeidsforhold/dist";

export interface EnkeltArbeidsforholdProps {
    navArbeidsforholdId: number;
}



export const EnkeltArbeidsforhold:FunctionComponent<EnkeltArbeidsforholdProps> = props =>{
    const locale = "nb" as "nb" | "en";
    const miljo = "LOCAL";
    //const arbeidsforholdId = 123;
    return <div>
        <DetaljertArbeidsforhold
        locale={locale}
        miljo={miljo}
        navArbeidsforholdId={props.navArbeidsforholdId||123} />
    </div>
};
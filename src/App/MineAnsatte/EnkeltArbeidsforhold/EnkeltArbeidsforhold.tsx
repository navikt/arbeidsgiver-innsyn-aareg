import React, {FunctionComponent} from "react";
import {DetaljertArbeidsforhold } from "@navikt/arbeidsforhold/dist";
import environment from "../../../utils/environment";

export declare type EnkeltArbeidsforholdProps = {
    valgtArbeidsTaker:number
}

const miljo = () => {
    if (environment.MILJO === 'dev-sbs') {
        return "Q0"
    }
    return "LOCAL"
};

export const EnkeltArbeidsforhold:FunctionComponent<EnkeltArbeidsforholdProps> = (props:EnkeltArbeidsforholdProps) =>{
    const locale = "nb" as "nb" | "en";
    const arbeidsforholdIdFraUrl = new URL(window.location.href).searchParams.get('arbeidsforhold');

    if(arbeidsforholdIdFraUrl) {
        const arbeidsforholdId = parseInt(arbeidsforholdIdFraUrl);
        return <div>
            <DetaljertArbeidsforhold
                locale={locale}
                miljo={miljo()}
                navArbeidsforholdId={arbeidsforholdId}
                rolle="ARBEIDSGIVER"
                fnrArbeidstaker={props.valgtArbeidsTaker}
                customApiUrl={"https://arbeidsgiver-q.nav.no/bedriftsoversikt-og-ansatte/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver/{id}"}
            />
        </div>
    }
    return <div>
       Ugyldig arbeidsforholdId
    </div>
};
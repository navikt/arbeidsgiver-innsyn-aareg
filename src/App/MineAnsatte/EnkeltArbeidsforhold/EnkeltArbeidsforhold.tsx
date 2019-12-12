import React, {FunctionComponent} from "react";
import {DetaljertArbeidsforhold } from "@navikt/arbeidsforhold/dist";
import environment from "../../../utils/environment";
import AlertStripe from "nav-frontend-alertstriper";


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
    if(arbeidsforholdIdFraUrl && props.valgtArbeidsTaker) {
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
        <AlertStripe type={"feil"} >Mangler gyldig arbeidsforholdsId eller fødselsnummer på arbeidstaker.</AlertStripe>

    </div>
};
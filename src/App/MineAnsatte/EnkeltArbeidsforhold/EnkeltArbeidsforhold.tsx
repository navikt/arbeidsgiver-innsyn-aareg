import React, { FunctionComponent } from 'react';
import { DetaljertArbeidsforhold } from '@navikt/arbeidsforhold/dist';
import environment from '../../../utils/environment';
import AlertStripe from 'nav-frontend-alertstriper';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Arbeidstaker } from '../../Objekter/Arbeidstaker';
import './EnkeltArbeidsforhold.less';
export declare type EnkeltArbeidsforholdProps = {
    valgtArbeidstaker: Arbeidstaker | null;
};

const miljo = () => {
    if (environment.MILJO === 'dev-sbs') {
        return 'Q0';
    }
    return 'LOCAL';
};

export const EnkeltArbeidsforhold: FunctionComponent<EnkeltArbeidsforholdProps> = (
    props: EnkeltArbeidsforholdProps
) => {
    const locale = 'nb' as 'nb' | 'en';
    const arbeidsforholdIdFraUrl = new URL(window.location.href).searchParams.get('arbeidsforhold');
    if (arbeidsforholdIdFraUrl && props.valgtArbeidstaker) {
        const arbeidsforholdId = parseInt(arbeidsforholdIdFraUrl);
        return (
            <div className="enkelt-arbeidsforhold">
                <div className="af-detaljert__header">
                    <span className="af-detaljert__kolonne">
                        <>
                            <Undertittel>{props.valgtArbeidstaker.navn}</Undertittel>
                        </>
                        <Normaltekst>Fødselsnummer: {props.valgtArbeidstaker.fnr}</Normaltekst>
                    </span>
                    <span className="af-detaljert__kolonne">
                        <Undertittel>Ansattforhold ID</Undertittel>
                        <Normaltekst>123456789123</Normaltekst>
                    </span>
                </div>
                <DetaljertArbeidsforhold
                    locale={locale}
                    miljo={miljo()}
                    navArbeidsforholdId={arbeidsforholdId}
                    rolle="ARBEIDSGIVER"
                    fnrArbeidstaker={props.valgtArbeidstaker.fnr}
                    customApiUrl={
                        'https://arbeidsgiver-q.nav.no/bedriftsoversikt-og-ansatte/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver/{id}'
                    }
                />
            </div>
        );
    }
    return (
        <div>
            <AlertStripe type={'feil'}>
                Mangler gyldig arbeidsforholdsId eller fødselsnummer på arbeidstaker.
            </AlertStripe>
        </div>
    );
};

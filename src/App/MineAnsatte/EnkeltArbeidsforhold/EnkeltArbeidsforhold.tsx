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

const apiURL = () => {
    if (environment.MILJO === 'prod-sbs') {
        return 'https://arbeidsgiver.nav.no/arbeidsforhold/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver/{id}';
    }
    return 'https://arbeidsgiver-q.nav.no/arbeidsforhold/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver/{id}';
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
                        <div className={'af-detaljert__arbeidsgiver'}>
                            <>
                                <Undertittel>{props.valgtArbeidstaker.navn}</Undertittel>
                            </>
                            <Normaltekst>Fødselsnummer: {props.valgtArbeidstaker.fnr}</Normaltekst>
                        </div>
                    </span>
                    <span className="af-detaljert__kolonne">
                        <div className={'af-detaljert__arbeidsgiver'}>
                            <Undertittel>Ansattforhold ID</Undertittel>
                            <Normaltekst>{arbeidsforholdId}</Normaltekst>
                        </div>
                    </span>
                </div>
                <DetaljertArbeidsforhold
                    locale={locale}
                    miljo={miljo()}
                    navArbeidsforholdId={arbeidsforholdId}
                    rolle="ARBEIDSGIVER"
                    fnrArbeidstaker={props.valgtArbeidstaker.fnr}
                    customApiUrl={apiURL()}
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

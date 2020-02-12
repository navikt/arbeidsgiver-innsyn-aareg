import React, { FunctionComponent } from 'react';
import './EnkeltArbeidsforhold.less';
import AlertStripe from 'nav-frontend-alertstriper';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { DetaljertArbeidsforhold } from '@navikt/arbeidsforhold/dist';
import { basename } from '../../paths';
import environment from '../../../utils/environment';
import { Arbeidstaker } from '../../Objekter/Arbeidstaker';
import { Organisasjon } from '../../Objekter/OrganisasjonFraAltinn';
import { linkTilMinSideArbeidsgiver } from '../../lenker';

export declare type EnkeltArbeidsforholdProps = {
    valgtArbeidstaker: Arbeidstaker | null;
    valgtOrganisasjon: Organisasjon;
};

const miljo = () => {
    if (environment.MILJO === 'prod-sbs') {
        return 'PROD';
    }
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
        const TilbakeTilArbeidsforhold = `${basename}?bedrift=${props.valgtOrganisasjon.OrganizationNumber}`;
        return (
            <div className="enkelt-arbeidsforhold-container">
                <div className="enkelt-arbeidsforhold-innhold">
                    <Normaltekst className="brodsmule">
                        <Lenke href={linkTilMinSideArbeidsgiver(props.valgtOrganisasjon.OrganizationNumber)}>
                            Min side – arbeidsgiver
                        </Lenke>{' / '}<Lenke href={TilbakeTilArbeidsforhold}>arbeidsforhold</Lenke>{' / enkeltarbeidsforhold'}
                    </Normaltekst>
                    <div className="enkelt-arbeidsforhold">
                        <div className="af-detaljert__header">
                            <span className="af-detaljert__kolonne">
                                <div className="af-detaljert__arbeidsgiver">
                                    <Undertittel>{props.valgtArbeidstaker.navn}</Undertittel>
                                    <Normaltekst>Fødselsnummer: {props.valgtArbeidstaker.fnr}</Normaltekst>
                                </div>
                            </span>
                            <span className="af-detaljert__kolonne">
                                <div className="af-detaljert__arbeidsgiver">
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
                </div>
            </div>
        );
    }
    return (
        <div className="feilmelding-ugyldig">
            <AlertStripe type={'feil'} className="feilmelding">
                Mangler gyldig arbeidsforholdsId eller fødselsnummer på arbeidstaker.
            </AlertStripe>
        </div>
    );
};

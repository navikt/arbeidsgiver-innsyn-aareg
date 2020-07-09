import React from 'react';
import { DetaljertArbeidsforhold } from '@navikt/arbeidsforhold/dist';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { basename } from '../../paths';
import environment from '../../../utils/environment';
import { Arbeidstaker } from '../../Objekter/Arbeidstaker';
import { Organisasjon } from '../../Objekter/OrganisasjonFraAltinn';
import { linkTilMinSideArbeidsgiver } from '../../lenker';
import './EnkeltArbeidsforhold.less';

export declare type EnkeltArbeidsforholdProps = {
    valgtArbeidstaker: Arbeidstaker | null;
    valgtOrganisasjon: Organisasjon;
    queryParametereHovedSiden?: string;
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

export const EnkeltArbeidsforhold = (props: EnkeltArbeidsforholdProps) => {
    const locale = 'nb' as 'nb' | 'en';
    const arbeidsforholdIdFraUrl = new URL(window.location.href).searchParams.get('arbeidsforhold');

    if (!arbeidsforholdIdFraUrl || !props.valgtArbeidstaker) {
        window.location.href = basename + '/' +props.queryParametereHovedSiden;
    }

    const url = new URL(window.location.href);
    url.searchParams.delete('arbeidsforhold');
    const urlString = url.toString();
    const indeksqueryStart = urlString.indexOf("?");
    const sistedelAvUrl = urlString.substr(indeksqueryStart,urlString.length);

    return (
        <>
            {arbeidsforholdIdFraUrl && props.valgtArbeidstaker && (
                <div className="enkelt-arbeidsforhold-container">
                    <div className="enkelt-arbeidsforhold-innhold">
                        <Normaltekst className="brodsmule">
                            <Lenke href={linkTilMinSideArbeidsgiver(props.valgtOrganisasjon.OrganizationNumber)}>
                                Min side – arbeidsgiver
                            </Lenke>
                            {' / '}
                            <Lenke href={basename + '/'+ sistedelAvUrl}>
                                arbeidsforhold
                            </Lenke>
                            {' / enkeltarbeidsforhold'}
                        </Normaltekst>
                        <div className="enkelt-arbeidsforhold">
                            <div className="af-detaljert__header">
                                <span className="af-detaljert__kolonne">
                                    <div className={'af-detaljert__arbeidsgiver'}>
                                        <Undertittel>{props.valgtArbeidstaker.navn}</Undertittel>
                                        <Normaltekst>Fødselsnummer: {props.valgtArbeidstaker.fnr}</Normaltekst>
                                    </div>
                                </span>
                            </div>
                            <DetaljertArbeidsforhold
                                locale={locale}
                                miljo={miljo()}
                                navArbeidsforholdId={parseInt(arbeidsforholdIdFraUrl)}
                                rolle="ARBEIDSGIVER"
                                fnrArbeidstaker={props.valgtArbeidstaker.fnr}
                                customApiUrl={apiURL()}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

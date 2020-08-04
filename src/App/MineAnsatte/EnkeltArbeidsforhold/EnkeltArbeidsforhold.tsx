import React, {FunctionComponent} from 'react';
import { DetaljertArbeidsforhold } from '@navikt/arbeidsforhold/dist';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { basename } from '../../paths';
import environment from '../../../utils/environment';
import { Arbeidstaker } from '../../Objekter/Arbeidstaker';
import { Organisasjon } from '../../Objekter/OrganisasjonFraAltinn';
import { linkTilMinSideArbeidsgiver } from '../../lenker';
import './EnkeltArbeidsforhold.less';
import {RouteComponentProps, withRouter} from "react-router";

interface Props extends RouteComponentProps{
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

const EnkeltArbeidsforhold: FunctionComponent<Props> = ({history, valgtArbeidstaker, queryParametereHovedSiden, valgtOrganisasjon}) => {
    const locale = 'nb' as 'nb' | 'en';
    const arbeidsforholdIdFraUrl = new URL(window.location.href).searchParams.get('arbeidsforhold');

    if (!arbeidsforholdIdFraUrl || !valgtArbeidstaker) {
        window.location.href = basename + '/' +queryParametereHovedSiden;
    }

    const redirectTilbake = () => {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete(('arbeidsforhold'));
        const { search } = currentUrl;
        history.replace({ search: search , pathname: '/'})

    }

    return (
        <>
            {arbeidsforholdIdFraUrl && valgtArbeidstaker && (
                <div className="enkelt-arbeidsforhold-container">
                    <div className="enkelt-arbeidsforhold-innhold">
                        <Normaltekst className="brodsmule">
                            <Lenke href={linkTilMinSideArbeidsgiver(valgtOrganisasjon.OrganizationNumber)}>
                                Min side – arbeidsgiver
                            </Lenke>
                            {' / '}
                            <div onClick={redirectTilbake} >
                                arbeidsforhold
                            </div>
                            {' / enkeltarbeidsforhold'}
                        </Normaltekst>
                        <div className="enkelt-arbeidsforhold">
                            <div className="af-detaljert__header">
                                <span className="af-detaljert__kolonne">
                                    <div className={'af-detaljert__arbeidsgiver'}>
                                        <Undertittel>{}</Undertittel>
                                        <Normaltekst>Fødselsnummer: {valgtArbeidstaker.fnr}</Normaltekst>
                                    </div>
                                </span>
                            </div>
                            <DetaljertArbeidsforhold
                                locale={locale}
                                miljo={miljo()}
                                navArbeidsforholdId={parseInt(arbeidsforholdIdFraUrl)}
                                rolle="ARBEIDSGIVER"
                                fnrArbeidstaker={valgtArbeidstaker.fnr}
                                customApiUrl={apiURL()}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default withRouter(EnkeltArbeidsforhold);

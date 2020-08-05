import React, {FunctionComponent} from 'react';
import { DetaljertArbeidsforhold } from '@navikt/arbeidsforhold/dist';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import environment from '../../../utils/environment';
import { Arbeidstaker } from '../../Objekter/Arbeidstaker';
import { Organisasjon } from '../../Objekter/OrganisasjonFraAltinn';
import Chevron from 'nav-frontend-chevron';
import './EnkeltArbeidsforhold.less';
import {RouteComponentProps, withRouter} from "react-router";
import {Arbeidsforhold} from "../../Objekter/ArbeidsForhold";

interface Props extends RouteComponentProps{
    valgtArbeidsforhold: Arbeidsforhold | null;
    nesteArbeidsforhold?: Arbeidsforhold;
    valgtOrganisasjon: Organisasjon;
    sortertListe: Arbeidsforhold[];
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

const EnkeltArbeidsforhold: FunctionComponent<Props> = ({history, valgtArbeidsforhold, valgtOrganisasjon, sortertListe}) => {
    const locale = 'nb' as 'nb' | 'en';
    const arbeidsforholdIdFraUrl = new URL(window.location.href).searchParams.get('arbeidsforhold');

    const indeksValgtArbeidsforhold = sortertListe.findIndex( arbeidsforhold => arbeidsforhold.navArbeidsforholdId === valgtArbeidsforhold?.navArbeidsforholdId)
    console.log(sortertListe[indeksValgtArbeidsforhold+1].arbeidstaker.navn);

    const redirectTilbake = () => {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete(('arbeidsforhold'));
        const { search } = currentUrl;
        history.replace({ search: search , pathname: '/'})
    }
    if (!arbeidsforholdIdFraUrl || !valgtArbeidsforhold) {
        redirectTilbake()
    }

    return (
        <>
            {arbeidsforholdIdFraUrl && valgtArbeidsforhold && (
                <div className="enkelt-arbeidsforhold-container">
                    <div className="enkelt-arbeidsforhold-innhold">
                            <button className="brodsmule" onClick={redirectTilbake} >
                                <Chevron type={'venstre'} />
                                <Normaltekst >
                                Tilbake til liste
                                </Normaltekst>
                            </button>
                        <div className="enkelt-arbeidsforhold">
                            <div className="af-detaljert__header">
                                <span className="af-detaljert__kolonne">
                                    <div className={'af-detaljert__arbeidsgiver'}>
                                        <Undertittel>{}</Undertittel>
                                        <Normaltekst>Fødselsnummer: {valgtArbeidsforhold.arbeidstaker.offentligIdent}</Normaltekst>
                                    </div>
                                </span>
                            </div>
                            <DetaljertArbeidsforhold
                                locale={locale}
                                miljo={miljo()}
                                navArbeidsforholdId={parseInt(arbeidsforholdIdFraUrl)}
                                rolle="ARBEIDSGIVER"
                                fnrArbeidstaker={valgtArbeidsforhold.arbeidstaker.offentligIdent}
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
import React, { FunctionComponent, useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { DetaljertArbeidsforhold } from '@navikt/arbeidsforhold';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Chevron from 'nav-frontend-chevron';
import environment from '../../../utils/environment';
import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';
import EnkeltArbeidsforholdVarselVisning from './EnkeltArbeidsforholdVarselVisning/EnkeltArbeidsforholdVarselVisning';
import Brodsmulesti from '../../Brodsmulesti/Brodsmulesti';
import './EnkeltArbeidsforhold.less';
import { BedriftsmenyContext } from '../../BedriftsmenyProvider';
import { useSearchParameters } from '../../../utils/UrlManipulation';
import { FiltrerteOgSorterteArbeidsforholdContext } from '../../FiltrerteOgSorterteArbeidsforholdProvider';

const miljo = () => {
    if (environment.MILJO === 'prod-sbs') {
        return 'PROD';
    }
    if (environment.MILJO === 'dev-sbs') {
        return 'Q1';
    }
    return 'LOCAL';
};

const apiURL = () => {
    if (environment.MILJO === 'prod-sbs') {
        return 'https://arbeidsgiver.nav.no/arbeidsforhold/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver/{id}';
    }
    return 'https://arbeidsgiver-q.nav.no/arbeidsforhold/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver/{id}';
};

const EnkeltArbeidsforhold: FunctionComponent<RouteComponentProps> = ({ history, location }) => {
    const { underenhet } = useContext(BedriftsmenyContext);
    const aareg = useContext(FiltrerteOgSorterteArbeidsforholdContext);

    const { getSearchParameter } = useSearchParameters();

    const redirectTilbake = () => {
        const ERPATIDLIGEREARBEIDSFORHOLD = location.pathname.startsWith('/tidligere-arbeidsforhold');
        const redirectPath = ERPATIDLIGEREARBEIDSFORHOLD ? '/tidligere-arbeidsforhold' : '/';
        const params = new URLSearchParams(location.search);
        params.delete('arbeidsforhold');
        history.replace({ search: params.toString(), pathname: redirectPath });
    };

    const locale = 'nb' as 'nb' | 'en';
    const arbeidsforholdIdFraUrl = getSearchParameter('arbeidsforhold');
    window.scrollTo(0, 0);

    if (arbeidsforholdIdFraUrl === null) {
        redirectTilbake();
    }

    const filtrertOgSortertListe: Arbeidsforhold[] =
        aareg?.lastestatus?.status === 'ferdig' ? aareg.lastestatus.arbeidsforhold : [];
    const indeksValgtArbeidsforhold = filtrertOgSortertListe.findIndex(
        arbeidsforhold => arbeidsforhold.navArbeidsforholdId === arbeidsforholdIdFraUrl
    );

    if (filtrertOgSortertListe.length && indeksValgtArbeidsforhold === -1) {
        redirectTilbake();
    }

    const nesteArbeidsforhold = filtrertOgSortertListe[indeksValgtArbeidsforhold + 1];
    const forrigeArbeidsforhold = filtrertOgSortertListe[indeksValgtArbeidsforhold - 1];
    const valgtArbeidsforhold = filtrertOgSortertListe[indeksValgtArbeidsforhold];

    const redirectTilArbeidsforhold = (arbeidsforhold: Arbeidsforhold) => {
        setTimeout(() => {}, 2500);
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('arbeidsforhold', arbeidsforhold.navArbeidsforholdId);
        const { search } = currentUrl;
        history.replace({ search: search });
    };

    if (arbeidsforholdIdFraUrl && valgtArbeidsforhold) {
        return (
            <>
                <div className="enkelt-arbeidsforhold-container">
                    <Brodsmulesti valgtOrg={underenhet.OrganizationNumber} />
                    <div className="enkelt-arbeidsforhold-innhold">
                        <div className="enkelt-arbeidsforhold-innhold__topp">
                            <button className="brodsmule" onClick={redirectTilbake}>
                                <Chevron type="venstre" />
                                <Normaltekst>Tilbake til liste</Normaltekst>
                            </button>
                            <div className="enkelt-arbeidsforhold-innhold__fram-tilbake-knapp">
                                {forrigeArbeidsforhold && (
                                    <button
                                        className="brodsmule"
                                        onClick={() => redirectTilArbeidsforhold(forrigeArbeidsforhold)}
                                    >
                                        <Chevron type="venstre" />
                                        <Normaltekst>Forrige</Normaltekst>
                                    </button>
                                )}
                                {nesteArbeidsforhold && (
                                    <button
                                        className="brodsmule"
                                        onClick={() => redirectTilArbeidsforhold(nesteArbeidsforhold)}
                                    >
                                        <Normaltekst>Neste</Normaltekst>
                                        <Chevron type={'høyre'} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="enkelt-arbeidsforhold">
                            <EnkeltArbeidsforholdVarselVisning valgtArbeidsforhold={valgtArbeidsforhold} />
                            <div className="af-detaljert__header">
                                <span className="af-detaljert__kolonne">
                                    <div className="af-detaljert__arbeidsgiver">
                                        <Undertittel>{valgtArbeidsforhold.arbeidstaker.navn}</Undertittel>
                                        <Normaltekst>
                                            Fødselsnummer: {valgtArbeidsforhold.arbeidstaker.offentligIdent}
                                        </Normaltekst>
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
                                printActivated={true}
                                printName={valgtArbeidsforhold.arbeidstaker.navn}
                                printSSN={valgtArbeidsforhold.arbeidstaker.offentligIdent}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return null;
    }
};

export default withRouter(EnkeltArbeidsforhold);

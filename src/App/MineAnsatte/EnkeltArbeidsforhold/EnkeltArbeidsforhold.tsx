import React, { FunctionComponent, useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { DetaljertArbeidsforhold } from '@navikt/arbeidsforhold';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Chevron from 'nav-frontend-chevron';
import environment from '../../../utils/environment';
import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';
import { getVariabelFraUrl, lagListeBasertPaUrl } from '../sorteringOgFiltreringsFunksjoner';
import EnkeltArbeidsforholdVarselVisning from './EnkeltArbeidsforholdVarselVisning/EnkeltArbeidsforholdVarselVisning';
import Brodsmulesti from '../../Brodsmulesti/Brodsmulesti';
import { OrganisasjonsdetaljerContext } from '../../OrganisasjonsdetaljerProvider';
import './EnkeltArbeidsforhold.less';

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

const EnkeltArbeidsforhold: FunctionComponent<RouteComponentProps> = ({ history, }) => {
    const {
        valgtAktivOrganisasjon,
        setVisProgressbar,
        valgtArbeidsforhold,
        setValgtArbeidsforhold,
        listeMedArbeidsforholdFraAareg
    } = useContext(OrganisasjonsdetaljerContext);

    const redirectTilbake = () => {
        const naVærendeUrl = new URL(window.location.href);
        const ERPATIDLIGEREARBEIDSFORHOLD = naVærendeUrl.toString().includes('tidligere-arbeidsforhold');
        const redirectPath = ERPATIDLIGEREARBEIDSFORHOLD ? '/tidligere-arbeidsforhold' : '/';
        naVærendeUrl.searchParams.delete('arbeidsforhold');
        const { search } = naVærendeUrl;
        setVisProgressbar(false);
        history.replace({ search: search, pathname: redirectPath });
    };

    const locale = 'nb' as 'nb' | 'en';
    const arbeidsforholdIdFraUrl = getVariabelFraUrl('arbeidsforhold');
    window.scrollTo(0, 0);

    if (arbeidsforholdIdFraUrl === null) {
        redirectTilbake();
    }

    const filtrertOgSortertListe: Arbeidsforhold[] = lagListeBasertPaUrl(listeMedArbeidsforholdFraAareg);
    const indeksValgtArbeidsforhold = filtrertOgSortertListe.findIndex(arbeidsforhold => {
        return arbeidsforhold.navArbeidsforholdId === arbeidsforholdIdFraUrl;
    });

    if (filtrertOgSortertListe.length && indeksValgtArbeidsforhold === -1) {
        redirectTilbake();
    }

    const nesteArbeidsforhold = filtrertOgSortertListe[indeksValgtArbeidsforhold + 1];
    const forrigeArbeidsforhold = filtrertOgSortertListe[indeksValgtArbeidsforhold - 1];
    setValgtArbeidsforhold(filtrertOgSortertListe[indeksValgtArbeidsforhold]);

    const redirectTilArbeidsforhold = (arbeidsforhold: Arbeidsforhold) => {
        setTimeout(() => {}, 2500);
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('arbeidsforhold', arbeidsforhold.navArbeidsforholdId);
        const { search } = currentUrl;
        history.replace({ search: search });
    };

    return (
        <>
            {arbeidsforholdIdFraUrl && valgtArbeidsforhold && (
                <div className="enkelt-arbeidsforhold-container">
                    <Brodsmulesti valgtOrg={valgtAktivOrganisasjon.OrganizationNumber} />
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
            )}
        </>
    );
};

export default withRouter(EnkeltArbeidsforhold);

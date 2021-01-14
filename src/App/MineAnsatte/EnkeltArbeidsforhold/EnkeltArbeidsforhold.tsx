import React, { FunctionComponent, useContext, useEffect } from 'react';
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
import IngenTilgangInfo from '../../IngenTilgangInfo/IngenTilgangInfo';
import { AlertStripeAdvarsel } from "nav-frontend-alertstriper";

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

const EnkeltArbeidsforhold: FunctionComponent<RouteComponentProps> = ({ history }) => {
    const { underenhet } = useContext(BedriftsmenyContext);
    const aareg = useContext(FiltrerteOgSorterteArbeidsforholdContext);
    const { setSearchParameter, getSearchParameter } = useSearchParameters();

    const redirectTilbake = () => {
        const params = new URLSearchParams(history.location.search);
        params.delete('arbeidsforhold');
        history.replace({ search: params.toString(), pathname: '..' });
    };

    const redirectTilArbeidsforhold = (arbeidsforhold: Arbeidsforhold) => {
        setSearchParameter({ arbeidsforhold: arbeidsforhold.navArbeidsforholdId });
    };

    const arbeidsforholdIdFraUrl = getSearchParameter('arbeidsforhold');
    window.scrollTo(0, 0);

    useEffect(() => {
        if (arbeidsforholdIdFraUrl === null) {
            redirectTilbake();
        }
    });

    const filtrertOgSortertListe: Arbeidsforhold[] =
        aareg?.lastestatus?.status === 'ferdig' ? aareg.lastestatus.arbeidsforhold : [];
    const indeksValgtArbeidsforhold = filtrertOgSortertListe.findIndex(
        arbeidsforhold => arbeidsforhold.navArbeidsforholdId === arbeidsforholdIdFraUrl
    );

    const nesteArbeidsforhold: Arbeidsforhold | undefined = filtrertOgSortertListe[indeksValgtArbeidsforhold + 1];
    const forrigeArbeidsforhold: Arbeidsforhold | undefined = filtrertOgSortertListe[indeksValgtArbeidsforhold - 1];
    const valgtArbeidsforhold: Arbeidsforhold | undefined = filtrertOgSortertListe[indeksValgtArbeidsforhold];

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

                    {aareg === null || aareg?.lastestatus?.status === 'ikke-tilgang' ? (
                        <IngenTilgangInfo underenhet={underenhet} />
                    ) : valgtArbeidsforhold === undefined ? (
                        <AlertStripeAdvarsel>Arbeidsforhold ikke funnet</AlertStripeAdvarsel>
                    ) : (
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
                                locale="nb"
                                miljo={miljo()}
                                navArbeidsforholdId={parseInt(valgtArbeidsforhold.navArbeidsforholdId)}
                                rolle="ARBEIDSGIVER"
                                fnrArbeidstaker={valgtArbeidsforhold.arbeidstaker.offentligIdent}
                                customApiUrl={apiURL()}
                                printActivated={true}
                                printName={valgtArbeidsforhold.arbeidstaker.navn}
                                printSSN={valgtArbeidsforhold.arbeidstaker.offentligIdent}
                            />
                            }
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default withRouter(EnkeltArbeidsforhold);

import React, {FunctionComponent} from 'react';
import { DetaljertArbeidsforhold } from "@navikt/arbeidsforhold"
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import environment from '../../../utils/environment';
import { Organisasjon } from '../../Objekter/OrganisasjonFraAltinn';
import Chevron from 'nav-frontend-chevron';
import './EnkeltArbeidsforhold.less';
import {RouteComponentProps, withRouter} from "react-router";
import {Arbeidsforhold} from "../../Objekter/ArbeidsForhold";
import {byggListeBasertPaPArametere, sorterArbeidsforhold} from "../sorteringOgFiltreringsFunksjoner";

interface Props extends RouteComponentProps{
    valgtArbeidsforhold: Arbeidsforhold | null;
    nesteArbeidsforhold?: Arbeidsforhold;
    valgtOrganisasjon: Organisasjon;
    alleArbeidsforhold: Arbeidsforhold[];
    setValgtArbeidsforhold: (arbeidsforhold: Arbeidsforhold) => void;
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

const EnkeltArbeidsforhold: FunctionComponent<Props> = ({history, valgtArbeidsforhold, valgtOrganisasjon, alleArbeidsforhold, setValgtArbeidsforhold}) => {
    const locale = 'nb' as 'nb' | 'en';
    const arbeidsforholdIdFraUrl = new URL(window.location.href).searchParams.get('arbeidsforhold');
    window.scrollTo(0, 0);

    const redirectTilbake = () => {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete(('arbeidsforhold'));
        const { search } = currentUrl;
        history.replace({ search: search , pathname: '/'})
    }

    if (arbeidsforholdIdFraUrl === null) {
        redirectTilbake()
    }

    const finnParametereFraUrlOgGenererListe = () => {
        const currentUrl = new URL(window.location.href);
        let filter = 'Alle'
        if (currentUrl.searchParams.get("filter") && currentUrl.searchParams.get("filter") !== "Alle") {
            filter = currentUrl.searchParams.get("filter")!!;
        }
        let skalFiltrere = false;
        if (currentUrl.searchParams.get("varsler") && currentUrl.searchParams.get("varsler") === "true") {
            skalFiltrere=true;
        }
        let sok = '';
        if (currentUrl.searchParams.get("sok") && currentUrl.searchParams.get("sok") !== '') {
            sok = currentUrl.searchParams.get("sok")!!;
        }
        let sorter = 0;
        if (currentUrl.searchParams.get("sorter") && currentUrl.searchParams.get("sorter") !== '1') {
            sorter = parseInt(currentUrl.searchParams.get("sorter")!!);
        }
        let revers = false;
        if (currentUrl.searchParams.get("revers") && currentUrl.searchParams.get("revers") !== 'false') {
            revers = true
        }
        const listeBasertPaParametere = byggListeBasertPaPArametere(alleArbeidsforhold, filter,skalFiltrere, sok);
        if (revers) {
            return sorterArbeidsforhold(listeBasertPaParametere, sorter).reverse()
        }
        return sorterArbeidsforhold(listeBasertPaParametere, sorter);

    }

    const arbeidsforhold = finnParametereFraUrlOgGenererListe();
    const indeksValgtArbeidsforhold = arbeidsforhold.findIndex( arbeidsforhold => {
        return arbeidsforhold.navArbeidsforholdId === arbeidsforholdIdFraUrl
    })
    if (arbeidsforhold.length && indeksValgtArbeidsforhold === -1) {
        redirectTilbake()
    }

    const nesteArbeidsforhold = arbeidsforhold[indeksValgtArbeidsforhold+1];
    const forrigeArbeidsforhold = arbeidsforhold[indeksValgtArbeidsforhold-1];
    setValgtArbeidsforhold(arbeidsforhold[indeksValgtArbeidsforhold])

    const redirectTilArbeidsforhold = (arbeidsforhold: Arbeidsforhold) => {
        setTimeout(() => {}, 2500);
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('arbeidsforhold', arbeidsforhold.navArbeidsforholdId);
        const { search } = currentUrl;
        history.replace({ search: search })
    }

    return (
        <>
            {arbeidsforholdIdFraUrl && valgtArbeidsforhold && (
                <div className="enkelt-arbeidsforhold-container">
                    <div className="enkelt-arbeidsforhold-innhold">
                        <div className={"enkelt-arbeidsforhold-innhold__topp"}>
                            <button className="brodsmule" onClick={redirectTilbake} >
                                <Chevron type={'venstre'} />
                                <Normaltekst >
                                Tilbake til liste
                                </Normaltekst>
                            </button>
                            <div className={"enkelt-arbeidsforhold-innhold__fram-tilbake-knapp"}>
                                { forrigeArbeidsforhold && <button className="brodsmule" onClick={() => redirectTilArbeidsforhold(forrigeArbeidsforhold)} >
                                    <Chevron type={'venstre'} />
                                    <Normaltekst >
                                        Forrige
                                    </Normaltekst>
                                </button>}
                            { nesteArbeidsforhold && <button className="brodsmule" onClick={() => redirectTilArbeidsforhold(nesteArbeidsforhold)} >
                                <Normaltekst >
                                    Neste
                                </Normaltekst>
                                <Chevron type={'høyre'} />
                            </button>}
                            </div>
                            </div>
                        <div className="enkelt-arbeidsforhold">
                            <div className="af-detaljert__header">
                                <div className="af-detaljert__kolonne">
                                    <div className={'af-detaljert__arbeidsgiver'}>
                                        <Undertittel>{valgtArbeidsforhold.arbeidstaker.navn}</Undertittel>
                                        <Normaltekst>Fødselsnummer: {valgtArbeidsforhold.arbeidstaker.offentligIdent}</Normaltekst>
                                    </div>
                                </div>
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
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { basename } from './paths';
import environment from '../utils/environment';
import { APISTATUS } from '../api/api-utils';
import { Organisasjon, tomaAltinnOrganisasjon } from './Objekter/OrganisasjonFraAltinn';
import { Arbeidsforhold } from './Objekter/ArbeidsForhold';
import amplitude from '../utils/amplitude';
import {
    loggForbiddenFraAltinn,
    loggInfoOmFeil,
    loggInfoOmFeilFraAltinn,
    loggInfoOmFeilTidligereOrganisasjoner
} from './amplitudefunksjonerForLogging';
import {
    hentOrganisasjonerFraAltinn,
    hentOrganisasjonerMedTilgangTilAltinntjeneste
} from '../api/altinnApi';
import {
    hentAntallArbeidsforholdFraAareg,
    hentArbeidsforholdFraAAreg,
    hentTidligereVirksomheter
} from '../api/aaregApi';
import LoginBoundary from './LoggInnBoundary';
import { redirectTilLogin } from './LoggInn/LoggInn';
import EnkeltArbeidsforhold from './MineAnsatte/EnkeltArbeidsforhold/EnkeltArbeidsforhold';
import HovedBanner from './MineAnsatte/HovedBanner/HovedBanner';
import MineAnsatte from './MineAnsatte/MineAnsatte';
import IngenTilgangInfo from './IngenTilgangInfo/IngenTilgangInfo';
import './App.less';
import {FeatureToggleProvider} from "./FeatureToggleProvider";

enum TILGANGSSTATE {
    LASTER,
    TILGANG,
    IKKE_TILGANG
}

export const MAKS_ANTALL_ARBEIDSFORHOLD = 25000;
export const SERVICEKODEINNSYNAAREGISTERET = '5441';
export const SERVICEEDITIONINNSYNAAREGISTERET = '1';

export const erGyldigOrganisasjon = (organisasjon: Organisasjon) => {
    return (
        organisasjon.Type === 'Enterprise' ||
        organisasjon.OrganizationForm === 'FLI' ||
        organisasjon.OrganizationForm === 'BEDR' || organisasjon.OrganizationForm === 'AAFY'
    );
};

const App = () => {
    const [tilgangArbeidsforholdState, setTilgangArbeidsforholdState] = useState(TILGANGSSTATE.LASTER);
    const [tilgangTilTidligereArbeidsforhold, setTilgangTilTidligereArbeidsforhold] = useState(false);

    const [organisasjonerFraAltinnLasteState, setOrganisasjonerFraAltinnLasteState] = useState<APISTATUS>(APISTATUS.LASTER);
    const [organisasjonerFraAltinn, setorganisasjoneFraAltinn] = useState(Array<Organisasjon>());
    const [organisasjonerFraAltinnMedTilgang, setOrganisasjonerFraAltinnMedTilgang] = useState<Array<Organisasjon> | null>(null);

    const [valgtAktivOrganisasjon, setValgtAktivOrganisasjon] = useState(tomaAltinnOrganisasjon);

    const [tidligereVirksomhet, setTidligereVirksomhet] = useState(tomaAltinnOrganisasjon);
    const [tidligereVirksomheter, setTidligereVirksomheter] = useState<Array<Organisasjon> | undefined>(undefined);

    const [
        abortControllerAntallArbeidsforhold,
        setAbortControllerAntallArbeidsforhold
    ] = useState<AbortController | null>(null);

    const [aaregLasteState, setAaregLasteState] = useState<APISTATUS>(APISTATUS.LASTER);
    const [visProgressbar, setVisProgressbar] = useState(false);
    const [listeMedArbeidsforholdFraAareg, setListeMedArbeidsforholdFraAareg] = useState(Array<Arbeidsforhold>());
    const [antallArbeidsforhold, setAntallArbeidsforhold] = useState(0);
    const [abortControllerArbeidsforhold, setAbortControllerArbeidsforhold] = useState<AbortController | null>(null);

    const [feilkodeFraAareg, setFeilkodeFraAareg] = useState<string>('');
    const [antallArbeidsforholdUkjent, setAntallArbeidsforholdUkjent] = useState(false);
    const [valgtArbeidsforhold, setValgtArbeidsforhold] = useState<Arbeidsforhold | null>(null);

    const [nåværendeUrlString, setNåværendeUrlString] = useState(window.location.href);

    const ERPATIDLIGEREARBEIDSFORHOLD = window.location.href.includes('tidligere-arbeidsforhold')
    const enkeltArbeidsforholdPath = ERPATIDLIGEREARBEIDSFORHOLD ? '/tidligere-arbeidsforhold/enkeltArbeidsforhold' : '/enkeltArbeidsforhold';
    const arbeidsforholdPath = ERPATIDLIGEREARBEIDSFORHOLD ? '/tidligere-arbeidsforhold' : '/';

    useEffect(() => {
        if (ERPATIDLIGEREARBEIDSFORHOLD && valgtAktivOrganisasjon === tomaAltinnOrganisasjon) {
            window.location.href = basename;
        }
    }, [valgtAktivOrganisasjon, ERPATIDLIGEREARBEIDSFORHOLD]);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        hentOrganisasjonerFraAltinn(signal)
            .then(organisasjonsliste => {
                setorganisasjoneFraAltinn(organisasjonsliste);
                hentOrganisasjonerMedTilgangTilAltinntjeneste(
                    SERVICEKODEINNSYNAAREGISTERET,
                    SERVICEEDITIONINNSYNAAREGISTERET,
                    signal
                )
                    .then(organisasjonerMedTilgangFraAltinn => {
                        setOrganisasjonerFraAltinnMedTilgang(organisasjonerMedTilgangFraAltinn.filter(organisasjon => erGyldigOrganisasjon(organisasjon)))
                        setOrganisasjonerFraAltinnLasteState(APISTATUS.OK);
                    })
                    .catch((e: Error) => {
                        loggInfoOmFeilFraAltinn(e.message);
                        setOrganisasjonerFraAltinnLasteState(APISTATUS.FEILET);
                    });
            })
            .catch((e: Error) => {
                if (e.message === 'Forbidden') {
                    loggForbiddenFraAltinn();
                    loggInfoOmFeilFraAltinn(e.message);
                    setOrganisasjonerFraAltinnMedTilgang([]);
                    setOrganisasjonerFraAltinnLasteState(APISTATUS.OK);
                } else {
                    setOrganisasjonerFraAltinnLasteState(APISTATUS.FEILET);
                }
            });
        return function cleanup() {
            abortController.abort();
        };
    }, []);

    useEffect(() => {
        if (valgtAktivOrganisasjon.ParentOrganizationNumber.length  && tilgangTilTidligereArbeidsforhold) {
            const abortController = new AbortController();
            const signal = abortController.signal;
            hentTidligereVirksomheter(valgtAktivOrganisasjon.ParentOrganizationNumber, signal)
                .then(virksomheter => {
                    setTidligereVirksomheter(virksomheter)
        })
                .catch(e =>
                loggInfoOmFeilTidligereOrganisasjoner(e))
        }

    }, [valgtAktivOrganisasjon.ParentOrganizationNumber, tilgangTilTidligereArbeidsforhold]);

    const abortTidligereRequests = () => {
        if (abortControllerAntallArbeidsforhold && abortControllerArbeidsforhold) {
            abortControllerAntallArbeidsforhold.abort();
            abortControllerArbeidsforhold.abort();
        }
    };

    const hentOgSetAntallOgArbeidsforhold = (organisasjon: Organisasjon, erTidligereVirksomhet: boolean) => {
        setAaregLasteState(APISTATUS.LASTER);
        setAntallArbeidsforholdUkjent(true);
        const abortControllerAntallKall = new AbortController();
        const signal = abortControllerAntallKall.signal;
        setAbortControllerAntallArbeidsforhold(abortControllerAntallKall);
        setAntallArbeidsforhold(0);

        hentAntallArbeidsforholdFraAareg(
            organisasjon.OrganizationNumber,
            organisasjon.ParentOrganizationNumber,
            signal
        ).then(antall => {
            if (antall === -1) {
                setAntallArbeidsforholdUkjent(true);
                setVisProgressbar(true);
            } else if (antall > MAKS_ANTALL_ARBEIDSFORHOLD) {
                setVisProgressbar(false);
                setAntallArbeidsforhold(antall);
                setAaregLasteState(APISTATUS.OK);
            } else {
                setAntallArbeidsforholdUkjent(false);
                setAntallArbeidsforhold(antall);
                setVisProgressbar(true);
            }
            if (antall <= MAKS_ANTALL_ARBEIDSFORHOLD) {
                const abortControllerArbeidsforhold = new AbortController();
                setAbortControllerArbeidsforhold(abortControllerArbeidsforhold);
                const signal = abortControllerArbeidsforhold.signal;
                hentArbeidsforholdFraAAreg(
                    organisasjon.OrganizationNumber,
                    organisasjon.ParentOrganizationNumber,
                    signal, erTidligereVirksomhet
                )
                    .then(respons => {
                        setListeMedArbeidsforholdFraAareg(respons.arbeidsforholdoversikter);
                        setAaregLasteState(APISTATUS.OK);
                        if (antallArbeidsforholdUkjent) {
                            setAntallArbeidsforhold(respons.arbeidsforholdoversikter.length);
                        }
                        if (respons.arbeidsforholdoversikter.length === 0) {
                            setVisProgressbar(false);
                        }
                    })
                    .catch(error => {
                        const feilmelding = error.response.status ? error.response.status : 'Ukjent feil'
                        loggInfoOmFeil(feilmelding, erTidligereVirksomhet );
                        if (error.response.status === 401) {
                            redirectTilLogin();
                        }
                        setAaregLasteState(APISTATUS.FEILET);
                        setFeilkodeFraAareg(error.response.status.toString());
                    });
            }
        });
    };

    const harTilgang = (orgnr: string) => {
        return organisasjonerFraAltinnMedTilgang?.filter(org => org.OrganizationNumber === orgnr).length;
    };

    const setValgtOrg = (organisasjon: Organisasjon) => {
        setValgtAktivOrganisasjon(organisasjon);
        if (harTilgang(organisasjon.ParentOrganizationNumber)) {
            setTilgangTilTidligereArbeidsforhold(true);
        }
        else {
            setTilgangTilTidligereArbeidsforhold(false);
        }
        abortTidligereRequests();
        if (organisasjon.OrganizationNumber.length && harTilgang(organisasjon.OrganizationNumber)) {
            hentOgSetAntallOgArbeidsforhold(organisasjon, false);
        }
    };

    useEffect(() => {
        setTilgangArbeidsforholdState(TILGANGSSTATE.LASTER);
        if (organisasjonerFraAltinnMedTilgang && valgtAktivOrganisasjon !== tomaAltinnOrganisasjon) {
            if (
                organisasjonerFraAltinnMedTilgang.filter(organisasjonMedTilgang => {
                    return organisasjonMedTilgang.OrganizationNumber === valgtAktivOrganisasjon.OrganizationNumber;
                }).length >= 1
            ) {
                setTilgangArbeidsforholdState(TILGANGSSTATE.TILGANG);
            } else {
                setTilgangArbeidsforholdState(TILGANGSSTATE.IKKE_TILGANG);
            }
        }
        if (organisasjonerFraAltinnMedTilgang && organisasjonerFraAltinnMedTilgang.length === 0) {
            setTilgangArbeidsforholdState(TILGANGSSTATE.IKKE_TILGANG);
        }
    }, [valgtAktivOrganisasjon, organisasjonerFraAltinnMedTilgang]);

    useEffect(() => {
        if (
            organisasjonerFraAltinnMedTilgang &&
            organisasjonerFraAltinnMedTilgang.length > 0 &&
            valgtAktivOrganisasjon === tomaAltinnOrganisasjon &&
            environment.MILJO === 'dev-sbs'
        ) {
            setTilgangArbeidsforholdState(TILGANGSSTATE.IKKE_TILGANG);
        }
        setTimeout(() => {}, 3000);
    }, [valgtAktivOrganisasjon, organisasjonerFraAltinnMedTilgang]);

    useEffect(() => {
        if (environment.MILJO) {
            amplitude.logEvent('#arbeidsforhold bruker er innlogget');
        }
    }, []);

    return (
        <div className="app">
            <LoginBoundary>
                <Router basename={basename}>
                    <FeatureToggleProvider>
                    {organisasjonerFraAltinnLasteState !== APISTATUS.LASTER &&
                        <HovedBanner
                            setEndringIUrlAlert={setNåværendeUrlString}
                            valgtAktivOrganisasjon={valgtAktivOrganisasjon}
                            byttOrganisasjon={setValgtOrg}
                            organisasjoner={organisasjonerFraAltinnLasteState === APISTATUS.OK ? organisasjonerFraAltinn : []}
                        />
                    }
                    {organisasjonerFraAltinnLasteState === APISTATUS.OK ? (
                        <>
                            {tilgangArbeidsforholdState !== TILGANGSSTATE.LASTER && (
                                <>
                                    <Route exact path={enkeltArbeidsforholdPath}>
                                        <EnkeltArbeidsforhold
                                            setValgtArbeidsforhold={setValgtArbeidsforhold}
                                            valgtArbeidsforhold={valgtArbeidsforhold}
                                            alleArbeidsforhold={listeMedArbeidsforholdFraAareg}
                                            setVisProgressbar={setVisProgressbar}
                                            valgtOrganisasjon={valgtAktivOrganisasjon}
                                        />
                                    </Route>
                                    <Route exact path={arbeidsforholdPath}>
                                        {tilgangArbeidsforholdState === TILGANGSSTATE.IKKE_TILGANG && (
                                            <IngenTilgangInfo
                                                valgtOrganisasjon={valgtAktivOrganisasjon}
                                                bedrifterMedTilgang={
                                                    organisasjonerFraAltinnMedTilgang &&
                                                    organisasjonerFraAltinnMedTilgang.filter(organisasjonMedTilgang => {
                                                        return organisasjonMedTilgang.OrganizationForm === 'BEDR';
                                                    })
                                                }
                                            />
                                        )}
                                        {tilgangArbeidsforholdState === TILGANGSSTATE.TILGANG && (
                                            <MineAnsatte
                                                valgtAktivOrganisasjon={valgtAktivOrganisasjon}
                                                valgtTidligereVirksomhet= {tidligereVirksomhet}
                                                listeMedArbeidsforholdFraAareg={listeMedArbeidsforholdFraAareg}
                                                antallArbeidsforhold={antallArbeidsforhold}
                                                antallArbeidsforholdUkjent={antallArbeidsforholdUkjent}
                                                hentOgSetAntallOgArbeidsforhold = {hentOgSetAntallOgArbeidsforhold}
                                                tilgangTilTidligereArbeidsforhold = {tilgangTilTidligereArbeidsforhold}
                                                tidligereVirksomheter={tidligereVirksomheter}
                                                organisasjonerFraAltinn={organisasjonerFraAltinn}
                                                setTidligereVirksomhet = {setTidligereVirksomhet }
                                                setNåværendeUrlString={setNåværendeUrlString}
                                                setVisProgressbar={setVisProgressbar}
                                                visProgressbar={visProgressbar}
                                                aaregLasteState={aaregLasteState}
                                                feilkodeFraAareg={feilkodeFraAareg}
                                                nåværendeUrlString={nåværendeUrlString}
                                            />
                                        )}
                                    </Route>
                                </>
                            )}
                        </>
                    ) : organisasjonerFraAltinnLasteState === APISTATUS.LASTER ? (
                        <NavFrontendSpinner type="S" />
                    ) : (
                        <div className="feilmelding-altinn">
                            <AlertStripeFeil>
                                Vi opplever ustabilitet med Altinn. Hvis du mener at du har roller i Altinn kan du prøve
                                å laste siden på nytt.
                            </AlertStripeFeil>
                        </div>
                    )}
                    </FeatureToggleProvider>
                </Router>
            </LoginBoundary>
        </div>
    );
};

export default App;

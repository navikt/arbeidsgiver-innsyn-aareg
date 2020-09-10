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
    hentOrganisasjonerFraAltinnNyBackend,
    hentOrganisasjonerMedTilgangTilAltinntjenesteNyBackend
} from '../api/altinnApi';
import {
    hentAntallArbeidsforholdFraAaregNyBackend,
    hentArbeidsforholdFraAAregNyBackend,
    hentTidligereVirksomheter
} from '../api/aaregApi';
import LoginBoundary from './LoggInnBoundary';
import { redirectTilLogin } from './LoggInn/LoggInn';
import EnkeltArbeidsforhold from './MineAnsatte/EnkeltArbeidsforhold/EnkeltArbeidsforhold';
import HovedBanner from './MineAnsatte/HovedBanner/HovedBanner';
import MineAnsatte from './MineAnsatte/MineAnsatte';
import IngenTilgangInfo from './IngenTilgangInfo/IngenTilgangInfo';
import './App.less';

enum TILGANGSSTATE {
    LASTER,
    TILGANG,
    IKKE_TILGANG
}

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
    const MAKS_ANTALL_ARBEIDSFORHOLD = 10000;

    const [tilgangArbeidsforholdState, setTilgangArbeidsforholdState] = useState(TILGANGSSTATE.LASTER);

    const [organisasjonerFraAltinnLasteState, setOrganisasjonerFraAltinnLasteState] = useState<APISTATUS>(APISTATUS.LASTER);
    const [organisasjonerFraAltinn, setorganisasjoneFraAltinn] = useState(Array<Organisasjon>());
    const [organisasjonerFraAltinnMedTilgang, setOrganisasjonerFraAltinnMedTilgang] = useState<Array<Organisasjon> | null>(null);

    const [valgtAktivOrganisasjon, setValgtAktivOrganisasjon] = useState(tomaAltinnOrganisasjon);
    const [valgtJuridiskEnhet, setValgtJuridiskEnhet] = useState(tomaAltinnOrganisasjon);

    const [tidligereVirksomhet, setTidligereVirksomhet] = useState(tomaAltinnOrganisasjon);
    const [tidligereVirksomheter, setTidligereVirksomheter] = useState<Array<Organisasjon> | null>(null);

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
    const [forMangeArbeidsforhold, setForMangeArbeidsforhold] = useState(false);
    const [antallArbeidsforholdUkjent, setAntallArbeidsforholdUkjent] = useState(false);
    const [valgtArbeidsforhold, setValgtArbeidsforhold] = useState<Arbeidsforhold | null>(null);

    const [endringIUrlAlert, setEndringIUrlAlert] = useState(window.location.href);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        hentOrganisasjonerFraAltinnNyBackend(signal)
            .then(organisasjonsliste => {
                setorganisasjoneFraAltinn(organisasjonsliste.filter(organisasjon => erGyldigOrganisasjon(organisasjon)));
                hentOrganisasjonerMedTilgangTilAltinntjenesteNyBackend(
                    SERVICEKODEINNSYNAAREGISTERET,
                    SERVICEEDITIONINNSYNAAREGISTERET,
                    signal
                )
                    .then(organisasjonerMedTilgangFraAltinn => {
                        setOrganisasjonerFraAltinnMedTilgang(organisasjonerMedTilgangFraAltinn);
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
        if (valgtAktivOrganisasjon.ParentOrganizationNumber.length) {
            const abortController = new AbortController();
            const signal = abortController.signal;
            hentTidligereVirksomheter(valgtAktivOrganisasjon.ParentOrganizationNumber, signal)
                .then(virksomheter => {
                    setTidligereVirksomheter(virksomheter)
        })
                .catch(e =>
                loggInfoOmFeilTidligereOrganisasjoner(e,valgtAktivOrganisasjon.ParentOrganizationNumber ))
        }

    }, [valgtAktivOrganisasjon.ParentOrganizationNumber]);

    const abortTidligereRequests = () => {
        if (abortControllerAntallArbeidsforhold && abortControllerArbeidsforhold) {
            abortControllerAntallArbeidsforhold.abort();
            abortControllerArbeidsforhold.abort();
        }
    };

    const hentOgSetAntallOgArbeidsforhold = (organisasjon: Organisasjon) => {
        setAaregLasteState(APISTATUS.LASTER);
        setAntallArbeidsforholdUkjent(true);
        const abortControllerAntallKall = new AbortController();
        const signal = abortControllerAntallKall.signal;
        setAbortControllerAntallArbeidsforhold(abortControllerAntallKall);
        setAntallArbeidsforhold(0);
        setForMangeArbeidsforhold(false);

        hentAntallArbeidsforholdFraAaregNyBackend(
            organisasjon.OrganizationNumber,
            organisasjon.ParentOrganizationNumber,
            signal
        ).then(antall => {
            if (antall === -1) {
                setAntallArbeidsforholdUkjent(true);
            } else if (antallArbeidsforhold > MAKS_ANTALL_ARBEIDSFORHOLD) {
                setForMangeArbeidsforhold(true);
                setVisProgressbar(false);
                setAaregLasteState(APISTATUS.OK);
            } else {
                setVisProgressbar(true);
                setAntallArbeidsforholdUkjent(false);
                setAntallArbeidsforhold(antall);
                setAntallArbeidsforhold(antall);
            }
            if (antall <= MAKS_ANTALL_ARBEIDSFORHOLD) {
                const abortControllerArbeidsforhold = new AbortController();
                setAbortControllerArbeidsforhold(abortControllerArbeidsforhold);
                const signal = abortControllerArbeidsforhold.signal;
                hentArbeidsforholdFraAAregNyBackend(
                    organisasjon.OrganizationNumber,
                    organisasjon.ParentOrganizationNumber,
                    signal
                )
                    .then(respons => {
                        setListeMedArbeidsforholdFraAareg(respons.arbeidsforholdoversikter);
                        setAaregLasteState(APISTATUS.OK);
                        if (!antallArbeidsforholdUkjent) {
                            setAntallArbeidsforhold(respons.arbeidsforholdoversikter.length);
                        }
                    })
                    .catch(error => {
                        loggInfoOmFeil(error.response.status, organisasjon.OrganizationNumber);
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
        abortTidligereRequests();
        if (organisasjon.OrganizationNumber.length && harTilgang(organisasjon.OrganizationNumber)) {
            hentOgSetAntallOgArbeidsforhold(organisasjon);
        }
    };

    const setTidligereVirksomhetOgHentArbeidsforhold = (organisasjon: Organisasjon) => {
        setTidligereVirksomhet(organisasjon);
        if (organisasjon !== tomaAltinnOrganisasjon) {
            const juridiskEnhet = organisasjonerFraAltinn.filter(organisasjon => organisasjon.OrganizationNumber === valgtAktivOrganisasjon.ParentOrganizationNumber)[0];
            juridiskEnhet && setValgtJuridiskEnhet(juridiskEnhet);
            hentOgSetAntallOgArbeidsforhold(organisasjon);
        }
    }

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
                    {organisasjonerFraAltinnLasteState !== APISTATUS.LASTER && (
                        <HovedBanner
                            erPaTidligereArbeidsforhold={true}
                            setEndringIUrlAlert={setEndringIUrlAlert}
                            valgtOrganisasjon={valgtAktivOrganisasjon}
                            byttOrganisasjon={setValgtOrg}
                            organisasjoner={organisasjonerFraAltinnLasteState === APISTATUS.OK ? organisasjonerFraAltinn : []}
                        />
                    )}
                    {organisasjonerFraAltinnLasteState === APISTATUS.OK ? (
                        <>
                            {tilgangArbeidsforholdState !== TILGANGSSTATE.LASTER && (
                                <>
                                    <Route exact path="/enkeltArbeidsforhold">
                                        <EnkeltArbeidsforhold
                                            setValgtArbeidsforhold={setValgtArbeidsforhold}
                                            valgtArbeidsforhold={valgtArbeidsforhold}
                                            alleArbeidsforhold={listeMedArbeidsforholdFraAareg}
                                        />


                                    </Route>
                                    <Route exact path="/tidligere-arbeidsforhold">
                                        {tilgangArbeidsforholdState === TILGANGSSTATE.TILGANG && (
                                        <MineAnsatte
                                            setValgtOrganisasjon={setValgtOrg}
                                            valgtJuridiskEnhet = {valgtJuridiskEnhet}
                                            tidligereVirksomhet = {tidligereVirksomhet}
                                            setTidligereVirksomhet = {setTidligereVirksomhetOgHentArbeidsforhold  }
                                            tidligereVirksomheter={tidligereVirksomheter!!}
                                            endringIUrlAlert={endringIUrlAlert}
                                            setEndringIUrlAlert={setEndringIUrlAlert}
                                            setVisProgressbar={setVisProgressbar}
                                            visProgressbar={visProgressbar}
                                            antallArbeidsforholdUkjent={antallArbeidsforholdUkjent}
                                            antallArbeidsforhold={antallArbeidsforhold}
                                            listeFraAareg={listeMedArbeidsforholdFraAareg}
                                            aaregLasteState={aaregLasteState}
                                            feilkode={feilkodeFraAareg}
                                            forMangeArbeidsforhold={forMangeArbeidsforhold}
                                            valgtOrganisasjon={valgtAktivOrganisasjon}
                                        />)}
                                    </Route>
                                    <Route exact path="/">
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
                                                setValgtOrganisasjon={setValgtOrg}
                                                setTidligereVirksomhet={setTidligereVirksomhet}
                                                valgtJuridiskEnhet = {valgtJuridiskEnhet}
                                                tidligereVirksomhet = {tidligereVirksomhet}
                                                tidligereVirksomheter={tidligereVirksomheter!!}
                                                endringIUrlAlert={endringIUrlAlert}
                                                setEndringIUrlAlert={setEndringIUrlAlert}
                                                setVisProgressbar={setVisProgressbar}
                                                visProgressbar={visProgressbar}
                                                antallArbeidsforholdUkjent={antallArbeidsforholdUkjent}
                                                antallArbeidsforhold={antallArbeidsforhold}
                                                listeFraAareg={listeMedArbeidsforholdFraAareg}
                                                aaregLasteState={aaregLasteState}
                                                feilkode={feilkodeFraAareg}
                                                forMangeArbeidsforhold={forMangeArbeidsforhold}
                                                valgtOrganisasjon={valgtAktivOrganisasjon}
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
                </Router>
            </LoginBoundary>
        </div>
    );
};

export default App;
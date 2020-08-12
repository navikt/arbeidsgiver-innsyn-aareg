import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import { basename } from './paths';
import { Organisasjon, tomaAltinnOrganisasjon } from './Objekter/OrganisasjonFraAltinn';

import LoginBoundary from './LoggInnBoundary';

import  EnkeltArbeidsforhold  from './MineAnsatte/EnkeltArbeidsforhold/EnkeltArbeidsforhold';
import HovedBanner from './MineAnsatte/HovedBanner/HovedBanner';
import {
  hentOrganisasjonerFraAltinnNyBackend,
    hentOrganisasjonerMedTilgangTilAltinntjenesteNyBackend
} from '../api/altinnApi';
import IngenTilgangInfo from './IngenTilgangInfo/IngenTilgangInfo';
import environment from '../utils/environment';
import './App.less';

import {APISTATUS} from '../api/api-utils';
import MineAnsatte from './MineAnsatte/MineAnsatte';
import NavFrontendSpinner from 'nav-frontend-spinner';
import {AlertStripeFeil} from 'nav-frontend-alertstriper';
import amplitude from "../utils/amplitude";
import {
    loggForbiddenFraAltinn,
    loggInfoOmFeil,
    loggNyBackendFungerer
} from "./amplitudefunksjonerForLogging";
import {
    hentAntallArbeidsforholdFraAaregNyBackend,
    hentArbeidsforholdFraAAregNyBackend
} from "../api/aaregApi";
import {redirectTilLogin} from "./LoggInn/LoggInn";
import {Arbeidsforhold} from "./Objekter/ArbeidsForhold";

enum TILGANGSSTATE {
    LASTER,
    TILGANG,
    IKKE_TILGANG
}


export const SERVICEKODEINNSYNAAREGISTERET = '5441';
export const SERVICEEDITIONINNSYNAAREGISTERET = '1';

export const erGyldigOrganisasjon = (organisasjon: Organisasjon) => {
    return ((organisasjon.Type === 'Enterprise' || organisasjon.OrganizationForm === 'FLI') || (organisasjon.OrganizationForm ==='BEDR' || organisasjon.OrganizationForm === 'AAFY'));
}

const App = () => {
    const MAKS_ANTALL_ARBEIDSFORHOLD = 10000;

    const [tilgangArbeidsforholdState, setTilgangArbeidsforholdState] = useState(TILGANGSSTATE.LASTER);
    const [organisasjonerLasteState, setOrganisasjonerLasteState] = useState<APISTATUS>(APISTATUS.LASTER);

    const [organisasjoner, setorganisasjoner] = useState(Array<Organisasjon>());
    const [organisasjonerMedTilgang, setOrganisasjonerMedTilgang] = useState<Array<Organisasjon> | null>(null);
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState(tomaAltinnOrganisasjon);

    const [valgtArbeidsforhold, setValgtArbeidsforhold] = useState<Arbeidsforhold | null>(null);
    const [abortControllerAntallArbeidsforhold, setAbortControllerAntallArbeidsforhold] = useState<AbortController | null>(null);
    const [abortControllerArbeidsforhold, setAbortControllerArbeidsforhold] = useState<AbortController | null>(null);

    const [listeFraAareg, setListeFraAareg] = useState(Array<Arbeidsforhold>());
    const [antallArbeidsforhold, setAntallArbeidsforhold] = useState(0);
    const [visProgressbar, setVisProgressbar] = useState(false);

    const [aaregLasteState, setAaregLasteState] = useState<APISTATUS>(APISTATUS.LASTER);
    const [feilkode, setFeilkode] = useState<string>('');
    const [forMangeArbeidsforhold, setForMangeArbeidsforhold] = useState(false);
    const [antallArbeidsforholdUkjent, setAntallArbeidsforholdUkjent] = useState(false);
    const [endringAlert, setEndringAlert] = useState(window.location.href);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        hentOrganisasjonerFraAltinnNyBackend(signal)
            .then(organisasjonsliste => {
                setorganisasjoner(
                    organisasjonsliste.filter(
                        organisasjon => erGyldigOrganisasjon(organisasjon)
                    )
                );
                hentOrganisasjonerMedTilgangTilAltinntjenesteNyBackend(
                    SERVICEKODEINNSYNAAREGISTERET,
                    SERVICEEDITIONINNSYNAAREGISTERET,
                    signal
                )
                    .then(organisasjonerMedTilgangFraAltinn => {
                        setOrganisasjonerMedTilgang(
                            organisasjonerMedTilgangFraAltinn
                        );
                        setOrganisasjonerLasteState(APISTATUS.OK);
                    })
                    .catch(() => {
                        setOrganisasjonerLasteState(APISTATUS.FEILET);
                    });
            })
            .catch((e: Error) => {
                if(e.message==="Forbidden"){
                    loggForbiddenFraAltinn();
                    setOrganisasjonerMedTilgang([]);
                    setOrganisasjonerLasteState(APISTATUS.OK);
                }
                else{
                setOrganisasjonerLasteState(APISTATUS.FEILET);}
            });
        return function cleanup() {
            abortController.abort();
        };
    }, []);

    const abortTidligereRequests = () => {
            if (abortControllerAntallArbeidsforhold && abortControllerArbeidsforhold) {
                abortControllerAntallArbeidsforhold.abort();
                abortControllerArbeidsforhold.abort();
            }
    }

    const hentAntallArbeidsforholdogArbeidsforhold = (organisasjon: Organisasjon) => {
        console.log('kaller hent arbeidsforhold');
        setAaregLasteState(APISTATUS.LASTER);
        setAntallArbeidsforholdUkjent(true);
        const abortControllerAntallKall = new AbortController();
        const signal = abortControllerAntallKall.signal;
        setAbortControllerAntallArbeidsforhold(abortControllerAntallKall)
        setAntallArbeidsforhold(0);
        setForMangeArbeidsforhold(false);
        hentAntallArbeidsforholdFraAaregNyBackend(organisasjon.OrganizationNumber, organisasjon.ParentOrganizationNumber, signal).then(antall => {
            if (antall === -1) {
                setAntallArbeidsforholdUkjent(true);
            }
            else if (antallArbeidsforhold>MAKS_ANTALL_ARBEIDSFORHOLD){
                setForMangeArbeidsforhold(true);
                setVisProgressbar(false);
                setAaregLasteState(APISTATUS.OK);
            }
            else {
                setVisProgressbar(true);
                setAntallArbeidsforholdUkjent(false);
                setAntallArbeidsforhold(antall)
                setAntallArbeidsforhold(antall);
            }
            if (antall<= MAKS_ANTALL_ARBEIDSFORHOLD) {
                const abortControllerArbeidsforhold = new AbortController();
                setAbortControllerArbeidsforhold(abortControllerArbeidsforhold)
                const signal = abortControllerArbeidsforhold.signal;
                hentArbeidsforholdFraAAregNyBackend(
                    organisasjon.OrganizationNumber,
                    organisasjon.ParentOrganizationNumber,
                    signal
                )
                    .then(responsAareg => {
                        setListeFraAareg(responsAareg.arbeidsforholdoversikter);
                        setAaregLasteState(APISTATUS.OK);
                        if (!antallArbeidsforholdUkjent) {
                            setAntallArbeidsforhold(responsAareg.arbeidsforholdoversikter.length);
                        }
                    })
                    .catch(error => {
                        loggInfoOmFeil(error.response.status, valgtOrganisasjon.OrganizationNumber )
                        if (error.response.status === 401) {
                            redirectTilLogin();
                        }
                        setAaregLasteState(APISTATUS.FEILET);
                        setFeilkode(error.response.status.toString());
                    });
            }
        });
        }


    const harTilgang = (orgnr: string) => {
        return organisasjonerMedTilgang?.filter(org=> org.OrganizationNumber === orgnr).length
    }

    const setValgtOrg = (organisasjon: Organisasjon) => {
        setValgtOrganisasjon(organisasjon);
        abortTidligereRequests()
        if (organisasjon.OrganizationNumber.length  && harTilgang(organisasjon.OrganizationNumber)) {
            hentAntallArbeidsforholdogArbeidsforhold(organisasjon);
        }
    }

    useEffect(() => {
        setTilgangArbeidsforholdState(TILGANGSSTATE.LASTER);
        if (organisasjonerMedTilgang && valgtOrganisasjon !== tomaAltinnOrganisasjon) {
            if (
                organisasjonerMedTilgang.filter(organisasjonMedTilgang => {
                    return organisasjonMedTilgang.OrganizationNumber === valgtOrganisasjon.OrganizationNumber;
                }).length >= 1
            ) {
                setTilgangArbeidsforholdState(TILGANGSSTATE.TILGANG);
            } else {
                setTilgangArbeidsforholdState(TILGANGSSTATE.IKKE_TILGANG);
            }
        }
        if (organisasjonerMedTilgang && organisasjonerMedTilgang.length === 0) {
            setTilgangArbeidsforholdState(TILGANGSSTATE.IKKE_TILGANG);
        }
    }, [valgtOrganisasjon, organisasjonerMedTilgang]);

    useEffect(() => {
        if (
            organisasjonerMedTilgang &&
            organisasjonerMedTilgang.length > 0 &&
            valgtOrganisasjon === tomaAltinnOrganisasjon &&
            environment.MILJO === 'dev-sbs'
        ) {
            setTilgangArbeidsforholdState(TILGANGSSTATE.IKKE_TILGANG);
        }
        setTimeout(() => {}, 3000);
    }, [valgtOrganisasjon, organisasjonerMedTilgang]);


    //skyggekall til ny backend
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const abortController2 = new AbortController();
        const signal2 = abortController2.signal;
        hentOrganisasjonerFraAltinnNyBackend(signal).then(organisasjoner=> loggNyBackendFungerer('antall org: ' +organisasjoner.length.toString()))
            .catch((e: Error) => loggNyBackendFungerer('antall org: feilet' + e.message ));
        hentOrganisasjonerMedTilgangTilAltinntjenesteNyBackend(SERVICEKODEINNSYNAAREGISTERET,
            SERVICEEDITIONINNSYNAAREGISTERET,signal2).then(organisasjoner =>loggNyBackendFungerer('antall org med tilgang: ' +organisasjoner.length.toString()))
            .catch((e: Error) => loggNyBackendFungerer('antall org med tilgang: feilet' + e.message ));
    }, []);


    useEffect(() => {
        if (environment.MILJO) {
            amplitude.logEvent("#arbeidsforhold bruker er innlogget");
        }
    }, []);

    return (
        <div className="app">
            <LoginBoundary>
                <Router basename={basename}>
                    {organisasjonerLasteState !== APISTATUS.LASTER && (
                        <HovedBanner
                            endringAlert={endringAlert}
                            setEndringAlert={setEndringAlert}
                            url={window.location.href}
                            valgtOrganisasjon = {valgtOrganisasjon}
                            byttOrganisasjon={setValgtOrg}
                            organisasjoner={organisasjonerLasteState === APISTATUS.OK ? organisasjoner : []}
                        />
                    )}
                    {organisasjonerLasteState === APISTATUS.OK ? (
                        <>
                            {tilgangArbeidsforholdState !== TILGANGSSTATE.LASTER && (
                                <>
                                    <Route exact path="/enkeltArbeidsforhold">
                                        <EnkeltArbeidsforhold
                                            setValgtArbeidsforhold={setValgtArbeidsforhold}
                                            valgtArbeidsforhold={valgtArbeidsforhold}
                                            valgtOrganisasjon={valgtOrganisasjon}
                                            alleArbeidsforhold={listeFraAareg}
                                        />
                                    </Route>
                                    <Route exact path="/">
                                        {tilgangArbeidsforholdState === TILGANGSSTATE.IKKE_TILGANG && (
                                            <IngenTilgangInfo
                                                valgtOrganisasjon={valgtOrganisasjon}
                                                bedrifterMedTilgang={
                                                    organisasjonerMedTilgang &&
                                                    organisasjonerMedTilgang.filter(organisasjonMedTilgang => {
                                                        return organisasjonMedTilgang.OrganizationForm === 'BEDR';
                                                    })
                                                }
                                            />
                                        )}

                                        {tilgangArbeidsforholdState === TILGANGSSTATE.TILGANG && (
                                            <MineAnsatte
                                                endringAlert={endringAlert}
                                                setEndringAlert={setEndringAlert}
                                                setVisProgressbar={setVisProgressbar}
                                                visProgressbar={visProgressbar}
                                                antallArbeidsforholdUkjent={antallArbeidsforholdUkjent}
                                                antallArbeidsforhold={antallArbeidsforhold}
                                                listeFraAareg={listeFraAareg}
                                                aaregLasteState={aaregLasteState}
                                                feilkode={feilkode}
                                                forMangeArbeidsforhold={forMangeArbeidsforhold}
                                                valgtOrganisasjon={valgtOrganisasjon}/>
                                        )}
                                    </Route>
                                </>
                            )}
                        </>
                    ) : organisasjonerLasteState === APISTATUS.LASTER ? (
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
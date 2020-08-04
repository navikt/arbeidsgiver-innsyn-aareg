import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { basename } from './paths';
import { Organisasjon, tomaAltinnOrganisasjon } from './Objekter/OrganisasjonFraAltinn';
import { Arbeidstaker } from './Objekter/Arbeidstaker';

import LoginBoundary from './LoggInnBoundary';

import  EnkeltArbeidsforhold  from './MineAnsatte/EnkeltArbeidsforhold/EnkeltArbeidsforhold';
import HovedBanner from './MineAnsatte/HovedBanner/HovedBanner';
import {
    hentOrganisasjonerFraAltinn,
    hentOrganisasjonerFraAltinnNyBackend,
    hentOrganisasjonerMedTilgangTilAltinntjeneste, hentOrganisasjonerMedTilgangTilAltinntjenesteNyBackend
} from '../api/altinnApi';
import IngenTilgangInfo from './IngenTilgangInfo/IngenTilgangInfo';
import environment from '../utils/environment';
import './App.less';

import { APISTATUS } from '../api/api-utils';
import MineAnsatte from './MineAnsatte/MineAnsatte';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import amplitude from "../utils/amplitude";
import {loggForbiddenFraAltinn, loggNyBackendFungerer} from "./amplitudefunksjonerForLogging";

enum TILGANGSSTATE {
    LASTER,
    TILGANG,
    IKKE_TILGANG
}


export const SERVICEKODEINNSYNAAREGISTERET = '5441';
export const SERVICEEDITIONINNSYNAAREGISTERET = '1';

const App = () => {
    const [tilgangArbeidsforholdState, setTilgangArbeidsforholdState] = useState(TILGANGSSTATE.LASTER);
    const [organisasjonerLasteState, setOrganisasjonerLasteState] = useState<APISTATUS>(APISTATUS.LASTER);

    const [organisasjoner, setorganisasjoner] = useState(Array<Organisasjon>());
    const [organisasjonerMedTilgang, setOrganisasjonerMedTilgang] = useState<Array<Organisasjon> | null>(null);
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState(tomaAltinnOrganisasjon);
    const [valgtArbeidstaker, setValgtArbeidstaker] = useState<Arbeidstaker | null>(null);

    const [abortControllerAntallArbeidsforhold, setAbortControllerAntallArbeidsforhold] = useState<AbortController | null>(null);
    const [abortControllerArbeidsforhold, setAbortControllerArbeidsforhold] = useState<AbortController | null>(null);

    const [tilgangTiLOpplysningspliktigOrg, setTilgangTiLOpplysningspliktigOrg] = useState(false);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        hentOrganisasjonerFraAltinn(signal)
            .then(organisasjonsliste => {
                setorganisasjoner(
                    organisasjonsliste.filter(
                        organisasjon => organisasjon.OrganizationForm === 'BEDR' || organisasjon.Type === 'Enterprise'
                    )
                );
                hentOrganisasjonerMedTilgangTilAltinntjeneste(
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
                console.log("error",e.message);
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

    const setValgtOrg = (org: Organisasjon) => {
        setTilgangArbeidsforholdState(TILGANGSSTATE.LASTER);
        setValgtOrganisasjon(org);
        setTilgangTiLOpplysningspliktigOrg(false);
        abortTidligereRequests()
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
                if (organisasjonerMedTilgang.filter(org => org.OrganizationNumber === valgtOrganisasjon.ParentOrganizationNumber).length>0){
                    setTilgangTiLOpplysningspliktigOrg(true)
                }
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


    useEffect(() => {
        if (environment.MILJO) {
            amplitude.logEvent("#arbeidsforhold bruker er innlogget");
        }
    }, []);

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


    const url = window.location.href.toString();
    const indeksqueryStart = url.indexOf("?");
    const sistedelAvUrl = url.substr(indeksqueryStart,url.length)

    return (
        <div className="app">
            <LoginBoundary>
                <Router basename={basename}>
                    {organisasjonerLasteState !== APISTATUS.LASTER && (
                        <HovedBanner
                            url={window.location.href}
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
                                            valgtArbeidstaker={valgtArbeidstaker}
                                            valgtOrganisasjon={valgtOrganisasjon}
                                            queryParametereHovedSiden={sistedelAvUrl}
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
                                                antallOrganisasjonerMedTilgang={organisasjonerMedTilgang?.length || 0}
                                                antallOrganisasjonerTotalt={organisasjoner.length}
                                                tilgangTiLOpplysningspliktigOrg={tilgangTiLOpplysningspliktigOrg}
                                                setValgtArbeidstaker={setValgtArbeidstaker}
                                                valgtOrganisasjon={valgtOrganisasjon}
                                                setAbortControllerAntallArbeidsforhold={setAbortControllerAntallArbeidsforhold}
                                                setAbortControllerArbeidsforhold={setAbortControllerArbeidsforhold}/>
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
import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import { basename } from './paths';
import { Organisasjon, tomaAltinnOrganisasjon } from './Objekter/OrganisasjonFraAltinn';
import { Arbeidstaker } from './Objekter/Arbeidstaker';

import LoginBoundary from './LoggInnBoundary';

import  EnkeltArbeidsforhold  from './MineAnsatte/EnkeltArbeidsforhold/EnkeltArbeidsforhold';
import HovedBanner from './MineAnsatte/HovedBanner/HovedBanner';
import {
    hentOrganisasjonerFraAltinn,

    hentOrganisasjonerMedTilgangTilAltinntjeneste
} from '../api/altinnApi';
import IngenTilgangInfo from './IngenTilgangInfo/IngenTilgangInfo';
import environment from '../utils/environment';
import './App.less';

import {APISTATUS} from '../api/api-utils';
import MineAnsatte from './MineAnsatte/MineAnsatte';
import NavFrontendSpinner from 'nav-frontend-spinner';
import {AlertStripeFeil} from 'nav-frontend-alertstriper';
import amplitude from "../utils/amplitude";
import {loggForbiddenFraAltinn, loggInfoOmFeil} from "./amplitudefunksjonerForLogging";
import {hentAntallArbeidsforholdFraAareg, hentArbeidsforholdFraAAreg} from "../api/aaregApi";
import {redirectTilLogin} from "./LoggInn/LoggInn";
import {Arbeidsforhold} from "./Objekter/ArbeidsForhold";

enum TILGANGSSTATE {
    LASTER,
    TILGANG,
    IKKE_TILGANG
}


export const SERVICEKODEINNSYNAAREGISTERET = '5441';
export const SERVICEEDITIONINNSYNAAREGISTERET = '1';

const App = () => {
    const MAKS_ANTALL_ARBEIDSFORHOLD = 10000;

    const [tilgangArbeidsforholdState, setTilgangArbeidsforholdState] = useState(TILGANGSSTATE.LASTER);
    const [organisasjonerLasteState, setOrganisasjonerLasteState] = useState<APISTATUS>(APISTATUS.LASTER);

    const [organisasjoner, setorganisasjoner] = useState(Array<Organisasjon>());
    const [organisasjonerMedTilgang, setOrganisasjonerMedTilgang] = useState<Array<Organisasjon> | null>(null);
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState(tomaAltinnOrganisasjon);
    const [valgtArbeidstaker, setValgtArbeidstaker] = useState<Arbeidstaker | null>(null);

    const [abortControllerAntallArbeidsforhold, setAbortControllerAntallArbeidsforhold] = useState<AbortController | null>(null);
    const [abortControllerArbeidsforhold, setAbortControllerArbeidsforhold] = useState<AbortController | null>(null);

    const [listeFraAareg, setListeFraAareg] = useState(Array<Arbeidsforhold>());
    const [antallArbeidsforhold, setAntallArbeidsforhold] = useState(0);
    const [visProgressbar, setVisProgressbar] = useState(false);

    const [aaregLasteState, setAaregLasteState] = useState<APISTATUS>(APISTATUS.LASTER);
    const [feilkode, setFeilkode] = useState<string>('');
    const [forMangeArbeidsforhold, setForMangeArbeidsforhold] = useState(false);
    const [antallArbeidsforholdUkjent, setAntallArbeidsforholdUkjent] = useState(false);


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

    const harTilgang = (orgnr: string) => {
        return organisasjonerMedTilgang?.filter(org=> org.OrganizationNumber === orgnr).length
    }

    const setValgtOrg = (org: Organisasjon) => {
        console.log('set valgt org kallt');
        setValgtOrganisasjon(org);
        if (org.OrganizationNumber.length  && harTilgang(org.OrganizationNumber)) {
            const abortController = new AbortController();
            setAntallArbeidsforholdUkjent(true);
            setAbortControllerAntallArbeidsforhold(abortController)
            const signal = abortController.signal;
            setAntallArbeidsforholdUkjent(true);
             hentAntallArbeidsforholdFraAareg(
                org.OrganizationNumber,
                org.ParentOrganizationNumber, signal
            ).then(antall => {
                const antallForhold = antall.valueOf();
                if (antallForhold > 0) {
                    setAntallArbeidsforholdUkjent(false);
                    setAntallArbeidsforhold(antallForhold);
                    if (antallForhold>MAKS_ANTALL_ARBEIDSFORHOLD) {
                        setVisProgressbar(false);
                        setAaregLasteState(APISTATUS.OK);
                        setForMangeArbeidsforhold(true);
                    }
                }
                if (antallForhold <= MAKS_ANTALL_ARBEIDSFORHOLD) {
                    setVisProgressbar(true);
                }
                 if ((antallForhold>0 || antallArbeidsforholdUkjent) && !forMangeArbeidsforhold) {
                     const abortController = new AbortController();
                     setAbortControllerArbeidsforhold(abortController)
                     const signal = abortController.signal;
                     hentArbeidsforholdFraAAreg(
                         org.OrganizationNumber,
                         org.ParentOrganizationNumber,
                         signal
                     )
                         .then(responsAareg => {
                             setListeFraAareg(responsAareg.arbeidsforholdoversikter);
                             setAaregLasteState(APISTATUS.OK);
                             if (antallArbeidsforholdUkjent) {
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
            }).catch(error => {
                loggInfoOmFeil(error.response.status, valgtOrganisasjon.OrganizationNumber )
                if (error.response.status === 401) {
                    redirectTilLogin();
                }
                setAaregLasteState(APISTATUS.FEILET);
                setFeilkode(error.response.status.toString());
            });
        }
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
                                                setVisProgressbar={setVisProgressbar}
                                                visProgressbar={visProgressbar}
                                                antallArbeidsforholdUkjent={antallArbeidsforholdUkjent}
                                                antallArbeidsforhold={antallArbeidsforhold}
                                                listeFraAareg={listeFraAareg}
                                                aaregLasteState={aaregLasteState}
                                                feilkode={feilkode}
                                                forMangeArbeidsforhold={forMangeArbeidsforhold}
                                                setValgtArbeidstaker={setValgtArbeidstaker}
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
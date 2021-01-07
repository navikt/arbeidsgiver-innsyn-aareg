import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { basename } from './paths';
import environment from '../utils/environment';
import { APISTATUS } from '../api/api-utils';
import { Organisasjon, tomaAltinnOrganisasjon } from './Objekter/OrganisasjonFraAltinn';
import { Arbeidsforhold } from './Objekter/ArbeidsForhold';
import amplitude from '../utils/amplitude';
import { loggInfoOmFeil } from './amplitudefunksjonerForLogging';
import { hentAntallArbeidsforholdFraAareg, hentArbeidsforholdFraAAreg } from '../api/aaregApi';
import { redirectTilLogin } from './LoggInn/LoggInn';
import { OrganisasjonerOgTilgangerContext, TILGANGSSTATE } from './OrganisasjonerOgTilgangerProvider';
import HovedBanner from './MineAnsatte/HovedBanner/HovedBanner';
import EnkeltArbeidsforhold from './MineAnsatte/EnkeltArbeidsforhold/EnkeltArbeidsforhold';
import MineAnsatte from './MineAnsatte/MineAnsatte';
import IngenTilgangInfo from './IngenTilgangInfo/IngenTilgangInfo';
import './App.less';

export const MAKS_ANTALL_ARBEIDSFORHOLD = 25000;

const ArbeidsforholdRoutes = () => {
    const { valgtAktivOrganisasjon, tilgangArbeidsforhold } = useContext(OrganisasjonerOgTilgangerContext);

    const [valgtTidligereVirksomhet, setValgtTidligereVirksomhet] = useState(tomaAltinnOrganisasjon);
    const [visProgressbar, setVisProgressbar] = useState(false);
    const [aaregLasteState, setAaregLasteState] = useState<APISTATUS>(APISTATUS.LASTER);
    const [feilkodeFraAareg, setFeilkodeFraAareg] = useState<string>('');

    const [listeMedArbeidsforholdFraAareg, setListeMedArbeidsforholdFraAareg] = useState(Array<Arbeidsforhold>());
    const [antallArbeidsforhold, setAntallArbeidsforhold] = useState(0);
    const [antallArbeidsforholdUkjent, setAntallArbeidsforholdUkjent] = useState(false);
    const [valgtArbeidsforhold, setValgtArbeidsforhold] = useState<Arbeidsforhold | null>(null);

    const [abortControllerAntallArbeidsforhold, setAbortControllerAntallArbeidsforhold] = useState<AbortController | null>(null);
    const [abortControllerArbeidsforhold, setAbortControllerArbeidsforhold] = useState<AbortController | null>(null);

    const [nåværendeUrlString, setNåværendeUrlString] = useState<string>(window.location.href);

    const ERPATIDLIGEREARBEIDSFORHOLD = window.location.href.includes('tidligere-arbeidsforhold');
    const enkeltArbeidsforholdPath = ERPATIDLIGEREARBEIDSFORHOLD
        ? '/tidligere-arbeidsforhold/enkeltArbeidsforhold'
        : '/enkeltArbeidsforhold';
    const arbeidsforholdPath = ERPATIDLIGEREARBEIDSFORHOLD ? '/tidligere-arbeidsforhold' : '/';

    useEffect(() => {
        if (ERPATIDLIGEREARBEIDSFORHOLD && valgtAktivOrganisasjon === tomaAltinnOrganisasjon) {
            window.location.href = basename;
        }
    }, [valgtAktivOrganisasjon, ERPATIDLIGEREARBEIDSFORHOLD]);

    useEffect(() => {
        if (environment.MILJO) {
            amplitude.logEvent('#arbeidsforhold bruker er innlogget');
        }
    }, []);

    const hentOgSetAntallOgArbeidsforhold = (organisasjon: Organisasjon, erTidligereVirksomhet: boolean) => {
        const abortControllerAntallKall = new AbortController();
        const signal = abortControllerAntallKall.signal;
        setAbortControllerAntallArbeidsforhold(abortControllerAntallKall);

        setAaregLasteState(APISTATUS.LASTER);
        setAntallArbeidsforholdUkjent(true);
        setAntallArbeidsforhold(0);

        hentAntallArbeidsforholdFraAareg(
            organisasjon.OrganizationNumber,
            organisasjon.ParentOrganizationNumber,
            signal
        ).then(antall => {
            if (antall === -1) {
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
                    signal,
                    erTidligereVirksomhet
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
                        const feilmelding = 'Hent arbeidsforhold fra AAreg feilet: ' + error.response.status
                            ? error.response.status
                            : 'Ukjent feil';
                        loggInfoOmFeil(feilmelding, erTidligereVirksomhet);
                        if (error.response.status === 401) {
                            redirectTilLogin();
                        }
                        setAaregLasteState(APISTATUS.FEILET);
                        setFeilkodeFraAareg(error.response.status.toString());
                    });
            }
        })
        .catch(error => {
            const feilmelding = 'Hent antall arbeidsforhold feilet';
            loggInfoOmFeil(feilmelding, erTidligereVirksomhet);
            if (error?.response.status === 401) {
                redirectTilLogin();
            }
        });
    };

    const abortTidligereRequests = () => {
        if (abortControllerAntallArbeidsforhold && abortControllerArbeidsforhold) {
            abortControllerAntallArbeidsforhold.abort();
            abortControllerArbeidsforhold.abort();
        }
    };

    return (
        <Router basename={basename}>
            <HovedBanner
                hentOgSetAntallOgArbeidsforhold={hentOgSetAntallOgArbeidsforhold}
                abortTidligereRequests={abortTidligereRequests}
                setEndringIUrlAlert={setNåværendeUrlString}
            />
            <>
                {tilgangArbeidsforhold !== TILGANGSSTATE.LASTER ? (
                    <>
                        <Route exact path={enkeltArbeidsforholdPath}>
                            <EnkeltArbeidsforhold
                                alleArbeidsforhold={listeMedArbeidsforholdFraAareg}
                                setVisProgressbar={setVisProgressbar}
                                valgtArbeidsforhold={valgtArbeidsforhold}
                                setValgtArbeidsforhold={setValgtArbeidsforhold}
                            />
                        </Route>
                        <Route exact path={arbeidsforholdPath}>
                            {tilgangArbeidsforhold === TILGANGSSTATE.IKKE_TILGANG && aaregLasteState !== APISTATUS.LASTER && (
                                <IngenTilgangInfo/>
                            )}
                            {tilgangArbeidsforhold === TILGANGSSTATE.TILGANG && (
                                <MineAnsatte
                                    hentOgSetAntallOgArbeidsforhold={hentOgSetAntallOgArbeidsforhold}
                                    aaregLasteState={aaregLasteState}
                                    feilkodeFraAareg={feilkodeFraAareg}
                                    valgtTidligereVirksomhet={valgtTidligereVirksomhet}
                                    setTidligereVirksomhet ={setValgtTidligereVirksomhet }
                                    listeMedArbeidsforholdFraAareg={listeMedArbeidsforholdFraAareg}
                                    antallArbeidsforhold={antallArbeidsforhold}
                                    antallArbeidsforholdUkjent={antallArbeidsforholdUkjent}
                                    nåværendeUrlString={nåværendeUrlString}
                                    setNåværendeUrlString={setNåværendeUrlString}
                                    visProgressbar={visProgressbar}
                                    setVisProgressbar={setVisProgressbar}
                                />
                            )}
                        </Route>
                    </>
                ) : (
                    <div className="spinner">
                        <NavFrontendSpinner type="L" />
                    </div>
                )}
            </>
        </Router>
    );
};

export default ArbeidsforholdRoutes;
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { basename } from './paths';
import { Organisasjon, tomaAltinnOrganisasjon } from './Objekter/OrganisasjonFraAltinn';
import { Arbeidstaker } from './Objekter/Arbeidstaker';
import LoginBoundary from './LoggInnBoundary';
import MineAnsatte from './MineAnsatte/MineAnsatte';
import { EnkeltArbeidsforhold } from './MineAnsatte/EnkeltArbeidsforhold/EnkeltArbeidsforhold';
import HovedBanner from './MineAnsatte/HovedBanner/HovedBanner';
import { hentOrganisasjonerFraAltinn, hentOrganisasjonerMedTilgangTilAltinntjeneste } from '../api/altinnApi';
import IngenTilgangInfo from './IngenTilgangInfo/IngenTilgangInfo';
import './App.less';
import environment from '../utils/environment';

enum TILGANGSSTATE {
    LASTER,
    TILGANG,
    IKKE_TILGANG
}

const App = () => {
    const SERVICEKODEINNSYNAAREGISTERET = '5441';
    const SERVICEEDITIONINNSYNAAREGISTERET = '1';

    const [tilgangArbeidsforholdState, setTilgangArbeidsforholdState] = useState(TILGANGSSTATE.LASTER);
    const [organisasjonerLasteState, setOrganisasjonerLasteState] = useState(TILGANGSSTATE.LASTER);
    const [organisasjoner, setorganisasjoner] = useState(Array<Organisasjon>());
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState(tomaAltinnOrganisasjon);
    const [valgtArbeidstaker, setValgtArbeidstaker] = useState<Arbeidstaker | null>(null);
    const [organisasjonerMedTilgang, setOrganisasjonerMedTilgang] = useState<Array<Organisasjon> | null>(null);

    const hentOgSettOrganisasjoner = async () => {
        const organisasjonliste: Organisasjon[] = await hentOrganisasjonerFraAltinn();
        return organisasjonliste;
    };

    useEffect(() => {
        hentOgSettOrganisasjoner().then(organisasjonsliste => {
            setorganisasjoner(
                organisasjonsliste.filter(
                    organisasjon => organisasjon.OrganizationForm === 'BEDR' || organisasjon.Type === 'Enterprise'
                )
            );
            hentOrganisasjonerMedTilgangTilAltinntjeneste(
                SERVICEKODEINNSYNAAREGISTERET,
                SERVICEEDITIONINNSYNAAREGISTERET
            ).then(organisasjonerMedTilgangFraAltinn => {
                setOrganisasjonerMedTilgang(
                    organisasjonerMedTilgangFraAltinn.filter(
                        organisasjon =>
                            organisasjon.ParentOrganizationNumber && organisasjon.OrganizationForm === 'BEDR'
                    )
                );
            });
            setOrganisasjonerLasteState(TILGANGSSTATE.TILGANG);
        });
    }, []);

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

    return (
        <div className="app">
            <LoginBoundary>
                <Router basename={basename}>
                    {organisasjonerLasteState !== TILGANGSSTATE.LASTER && (
                        <HovedBanner byttOrganisasjon={setValgtOrganisasjon} organisasjoner={organisasjoner} />
                    )}
                    {tilgangArbeidsforholdState !== TILGANGSSTATE.LASTER && (
                        <>
                            <Route exact path="/enkeltArbeidsforhold">
                                <EnkeltArbeidsforhold
                                    valgtArbeidstaker={valgtArbeidstaker}
                                    valgtOrganisasjon={valgtOrganisasjon}
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
                                        setValgtArbeidstaker={setValgtArbeidstaker}
                                        valgtOrganisasjon={valgtOrganisasjon}
                                    />
                                )}
                            </Route>
                        </>
                    )}
                </Router>
            </LoginBoundary>
        </div>
    );
};

export default App;

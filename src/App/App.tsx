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

enum TILGANGSSTATE {
    LASTER,
    TILGANG,
    IKKE_TILGANG
}

const App = () => {
    const SERVICEKODEINNSYNAAREGISTERET = '5441';
    const SERVICEEDITIONINNSYNAAREGISTERET = '1';

    const [tilgangState, setTilgangState] = useState(TILGANGSSTATE.LASTER);
    const [organisasjoner, setorganisasjoner] = useState(Array<Organisasjon>());
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState(tomaAltinnOrganisasjon);
    const [valgtArbeidstaker, setValgtArbeidstaker] = useState<Arbeidstaker | null>(null);
    const [organisasjonerMedTilgang, setOrganisasjonerMedTilgang] = useState<Array<Organisasjon> | null>(null);

    const hentOgSettOrganisasjoner = async () => {
        const organisasjonliste: Organisasjon[] = await hentOrganisasjonerFraAltinn();
        return organisasjonliste;
    };

    useEffect(() => {
        hentOgSettOrganisasjoner().then(organisasjonsliste =>
            setorganisasjoner(organisasjonsliste.filter(organisasjon =>
            organisasjon.OrganizationForm === 'BEDR' || organisasjon.OrganizationForm === 'Enterprise')));
        hentOrganisasjonerMedTilgangTilAltinntjeneste(
            SERVICEKODEINNSYNAAREGISTERET,
            SERVICEEDITIONINNSYNAAREGISTERET
        ).then(organisasjonerMedTilgangFraAltinn => {
            setOrganisasjonerMedTilgang(organisasjonerMedTilgangFraAltinn.filter(organisasjon =>
                organisasjon.ParentOrganizationNumber && organisasjon.OrganizationForm === 'BEDR'));
        });
    }, []);

    console.log(organisasjonerMedTilgang);
    console.log(organisasjoner);

    useEffect(() => {
        setTilgangState(TILGANGSSTATE.LASTER);
        if (organisasjonerMedTilgang && valgtOrganisasjon !== tomaAltinnOrganisasjon) {
            if (
                organisasjonerMedTilgang.filter(organisasjonMedTilgang => {
                    return organisasjonMedTilgang.OrganizationNumber === valgtOrganisasjon.OrganizationNumber;
                }).length >= 1
            ) {
                setTilgangState(TILGANGSSTATE.TILGANG);
            } else {
                setTilgangState(TILGANGSSTATE.IKKE_TILGANG);
            }
        }
        if (organisasjonerMedTilgang && organisasjonerMedTilgang.length === 0) {
            setTilgangState(TILGANGSSTATE.IKKE_TILGANG);
        }
    }, [valgtOrganisasjon, organisasjonerMedTilgang]);

    return (
        <div className="app">
            <LoginBoundary>
                <Router basename={basename}>
                    <HovedBanner byttOrganisasjon={setValgtOrganisasjon} organisasjoner={organisasjoner} />
                    <Route exact path="/enkeltArbeidsforhold">
                        <EnkeltArbeidsforhold
                            valgtArbeidstaker={valgtArbeidstaker}
                            valgtOrganisasjon={valgtOrganisasjon}
                        />
                    </Route>
                    <Route exact path="/">
                        {tilgangState !== TILGANGSSTATE.LASTER && (
                            <>
                                {tilgangState === TILGANGSSTATE.IKKE_TILGANG && (
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

                                {tilgangState === TILGANGSSTATE.TILGANG && (
                                    <MineAnsatte
                                        setValgtArbeidstaker={setValgtArbeidstaker}
                                        valgtOrganisasjon={valgtOrganisasjon}
                                    />
                                )}
                            </>
                        )}
                    </Route>
                </Router>
            </LoginBoundary>
        </div>
    );
};

export default App;

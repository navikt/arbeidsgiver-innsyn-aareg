import React, { FunctionComponent, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { basename } from './paths';
import './App.less';
import LoginBoundary from './LoggInnBoundary';
import MineAnsatte from './MineAnsatte/MineAnsatte';
import { EnkeltArbeidsforhold } from './MineAnsatte/EnkeltArbeidsforhold/EnkeltArbeidsforhold';
import HovedBanner from './MineAnsatte/HovedBanner/HovedBanner';
import { JuridiskEnhetMedUnderEnheterArray } from './Objekter/JuridiskEnhetMedUnderenhetArray';
import { Organisasjon, tomaAltinnOrganisasjon } from './Objekter/OrganisasjonFraAltinn';
import { hentOrganisasjonerFraAltinn, hentOrganisasjonerMedTilgangTilAltinntjeneste } from '../api/altinnApi';
import { byggOrganisasjonstre } from './MineAnsatte/HovedBanner/byggOrganisasjonsTre';
import { Arbeidstaker } from './Objekter/Arbeidstaker';
import IngenTilgangInfo from './IngenTilgangInfo/IngenTilgangInfo';

enum TILGANSSTATE {
    LASTER,
    TILGANG,
    IKKE_TILGANG,
}

const App: FunctionComponent = () => {
    const SERVICEKODEINNSYNAAREGISTERET = '5441';
    const SERVICEEDITIONINNSYNAAREGISTERET = '1';
    const [tilgangState, setTilgangState] = useState(TILGANSSTATE.LASTER);
    const [organisasjonstre, setorganisasjonstre] = useState(Array<JuridiskEnhetMedUnderEnheterArray>());
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState(tomaAltinnOrganisasjon);
    const [valgtArbeidstaker, setValgtArbeidstaker] = useState<Arbeidstaker | null>(null);
    const [organisasjonerMedTilgang, setOrganisasjonerMedTilgang] = useState<Array<Organisasjon> | null>(null);

    useEffect(() => {
        setTilgangState(TILGANSSTATE.LASTER);
        const hentOgSettOrganisasjoner = async () => {
            const organisasjonliste: Organisasjon[] = await hentOrganisasjonerFraAltinn();
            return organisasjonliste;
        };
        const lagOgSettTre = async (organisasjoner: Organisasjon[]) => {
            const juridiskeenheterMedBarn: JuridiskEnhetMedUnderEnheterArray[] = await byggOrganisasjonstre(
                organisasjoner
            );
            return juridiskeenheterMedBarn;
        };
        hentOgSettOrganisasjoner().then(organisasjoner => {
            lagOgSettTre(organisasjoner).then(juridiskeenheterMedBarn => setorganisasjonstre(juridiskeenheterMedBarn));
        });
        hentOrganisasjonerMedTilgangTilAltinntjeneste(
            SERVICEKODEINNSYNAAREGISTERET,
            SERVICEEDITIONINNSYNAAREGISTERET
        ).then(organisasjonerMedTilgangFraAltinn => {
            setOrganisasjonerMedTilgang(organisasjonerMedTilgangFraAltinn);
        });
    }, []);

    useEffect(() => {
        setTilgangState(TILGANSSTATE.LASTER);
        if (organisasjonerMedTilgang && valgtOrganisasjon !== tomaAltinnOrganisasjon) {
            if (
                organisasjonerMedTilgang.filter(organisasjonMedTilgang => {
                    return organisasjonMedTilgang.OrganizationNumber === valgtOrganisasjon.OrganizationNumber;
                }).length >= 1
            ) {
                setTilgangState(TILGANSSTATE.TILGANG);
            }
            else {
                setTilgangState(TILGANSSTATE.IKKE_TILGANG);
            }
        }
    }, [valgtOrganisasjon, organisasjonerMedTilgang]);

    return (
        <div className={'app'}>
            <LoginBoundary>

                    <Router basename={basename}>
                        <Route exact path="/enkeltArbeidsforhold">
                            <HovedBanner byttOrganisasjon={() => {
                            }} organisasjonstre={[]}/>
                            <EnkeltArbeidsforhold
                                valgtArbeidstaker={valgtArbeidstaker}
                                valgtOrganisasjon={valgtOrganisasjon}
                            />
                        </Route>

                        <Route exact path="/">
                            <HovedBanner byttOrganisasjon={setValgtOrganisasjon} organisasjonstre={organisasjonstre}/>
                            { tilgangState !== TILGANSSTATE.LASTER && <>
                            { tilgangState === TILGANSSTATE.IKKE_TILGANG &&
                                <IngenTilgangInfo bedrifterMedTilgang={organisasjonerMedTilgang}/> }
                            { tilgangState === TILGANSSTATE.TILGANG && <MineAnsatte
                                setValgtArbeidstaker={setValgtArbeidstaker}
                                valgtOrganisasjon={valgtOrganisasjon}
                            />}

                            </>
                                }
                        </Route>
                    </Router>
                }
            </LoginBoundary>
        </div>
    );
};

export default App;

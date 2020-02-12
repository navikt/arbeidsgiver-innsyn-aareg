import React, { FunctionComponent, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { basename } from './paths';
import { JuridiskEnhetMedUnderEnheterArray } from './Objekter/JuridiskEnhetMedUnderenhetArray';
import { Organisasjon, tomaAltinnOrganisasjon } from './Objekter/OrganisasjonFraAltinn';
import { Arbeidstaker } from './Objekter/Arbeidstaker';
import LoginBoundary from './LoggInnBoundary';
import MineAnsatte from './MineAnsatte/MineAnsatte';
import { EnkeltArbeidsforhold } from './MineAnsatte/EnkeltArbeidsforhold/EnkeltArbeidsforhold';
import HovedBanner from './MineAnsatte/HovedBanner/HovedBanner';
import { hentOrganisasjonerFraAltinn, hentOrganisasjonerMedTilgangTilAltinntjeneste } from '../api/altinnApi';
import { byggOrganisasjonstre } from './MineAnsatte/HovedBanner/byggOrganisasjonsTre';
import IngenTilgangInfo from './IngenTilgangInfo/IngenTilgangInfo';
import './App.less';

const App: FunctionComponent = () => {
    const SERVICEKODEINNSYNAAREGISTERET = '5441';
    const SERVICEEDITIONINNSYNAAREGISTERET = '1';

    const [organisasjonstre, setorganisasjonstre] = useState(Array<JuridiskEnhetMedUnderEnheterArray>());
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState(tomaAltinnOrganisasjon);
    const [valgtArbeidstaker, setValgtArbeidstaker] = useState<Arbeidstaker | null>(null);
    const [organisasjonerMedTilgang, setOrganisasjonerMedTilgang] = useState<Array<Organisasjon> | null>(null);
    // const organisasjonerMedTilgang = hentOrganisasjonerMedTilgangTilAltinntjeneste(SERVICEKODEINNSYNAAREGISTERET,SERVICEEDITIONINNSYNAAREGISTERET);
    const [harTilgangMedValgtOrg, setHarTilgangMedValgtOrg] = useState(false);

    useEffect(() => {
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
        setHarTilgangMedValgtOrg(false);
        if (organisasjonerMedTilgang) {
            if (
                organisasjonerMedTilgang.filter(organisasjonMedTilgang => {
                    return organisasjonMedTilgang.OrganizationNumber === valgtOrganisasjon.OrganizationNumber;
                }).length >= 1
            ) {
                setHarTilgangMedValgtOrg(true);
            }
        }
    }, [valgtOrganisasjon, organisasjonerMedTilgang]);

    return (
        <div className={'app'}>
            <LoginBoundary>
                <Router basename={basename}>
                    <HovedBanner byttOrganisasjon={setValgtOrganisasjon} organisasjonstre={organisasjonstre} />
                    {!harTilgangMedValgtOrg && (
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
                    <Route exact path="/enkeltArbeidsforhold">
                        <EnkeltArbeidsforhold
                            valgtArbeidstaker={valgtArbeidstaker}
                            valgtOrganisasjon={valgtOrganisasjon}
                        />
                    </Route>
                    {harTilgangMedValgtOrg && (
                        <Route exact path="/">
                            <MineAnsatte
                                setValgtArbeidstaker={setValgtArbeidstaker}
                                valgtOrganisasjon={valgtOrganisasjon}
                            />
                        </Route>
                    )}
                </Router>
            </LoginBoundary>
        </div>
    );
};

export default App;

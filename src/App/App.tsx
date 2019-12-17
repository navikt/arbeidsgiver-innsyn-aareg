import React, { FunctionComponent, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { basename } from './paths';
import LoginBoundary from './LoggInnBoundary';
import MineAnsatte from './MineAnsatte/MineAnsatte';
import { EnkeltArbeidsforhold } from './MineAnsatte/EnkeltArbeidsforhold/EnkeltArbeidsforhold';
import HovedBanner from './MineAnsatte/HovedBanner/HovedBanner';
import { JuridiskEnhetMedUnderEnheterArray } from './Objekter/JuridiskEnhetMedUnderenhetArray';
import { Organisasjon, tomaAltinnOrganisasjon } from './Objekter/OrganisasjonFraAltinn';
import { hentOrganisasjonerFraAltinn } from '../api/altinnApi';
import { byggOrganisasjonstre } from './MineAnsatte/HovedBanner/byggOrganisasjonsTre';

const App: FunctionComponent = () => {
    const [organisasjonstre, setorganisasjonstre] = useState(Array<JuridiskEnhetMedUnderEnheterArray>());
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState(tomaAltinnOrganisasjon);
    const [valgtArbeidstaker, setValgtArbeidstaker] = useState();

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
    }, []);

    return (
        <div>
            <LoginBoundary>
                <Router basename={basename}>
                    <HovedBanner byttOrganisasjon={setValgtOrganisasjon} organisasjonstre={organisasjonstre} />
                    <Route exact path="/enkeltArbeidsforhold">
                        <EnkeltArbeidsforhold valgtArbeidsTaker={valgtArbeidstaker} />
                    </Route>
                    <Route exact path="/">
                        <MineAnsatte
                            setValgtArbeidstaker={setValgtArbeidstaker}
                            valgtOrganisasjon={valgtOrganisasjon}
                        />
                    </Route>
                </Router>
            </LoginBoundary>
        </div>
    );
};

export default App;

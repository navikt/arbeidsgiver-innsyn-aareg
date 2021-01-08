import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { basename } from './paths';
import { tomaAltinnOrganisasjon } from './Objekter/OrganisasjonFraAltinn';
import { OrganisasjonsdetaljerContext } from './OrganisasjonsdetaljerProvider';
import HovedBanner from './MineAnsatte/HovedBanner/HovedBanner';
import EnkeltArbeidsforhold from './MineAnsatte/EnkeltArbeidsforhold/EnkeltArbeidsforhold';
import MineAnsatte from './MineAnsatte/MineAnsatte';
import IngenTilgangInfo from './IngenTilgangInfo/IngenTilgangInfo';
import './App.less';

const ArbeidsforholdRoutes = () => {
    const { valgtAktivOrganisasjon, tilgangArbeidsforhold } = useContext(OrganisasjonsdetaljerContext);

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

    return (
        <Router basename={basename}>
            <HovedBanner />
            <Route exact path={enkeltArbeidsforholdPath}>
                <EnkeltArbeidsforhold />
            </Route>
            <Route exact path={arbeidsforholdPath}>
                {tilgangArbeidsforhold ? <MineAnsatte /> : <IngenTilgangInfo />}
            </Route>
        </Router>
    );
};

export default ArbeidsforholdRoutes;

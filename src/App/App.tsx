import React, {FunctionComponent, useState} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { basename } from './paths';
import LoginBoundary from "./LoggInnBoundary";
import MineAnsatte from "./MineAnsatte/MineAnsatte";
import {EnkeltArbeidsforhold} from "./MineAnsatte/EnkeltArbeidsforhold/EnkeltArbeidsforhold";

import {byggOrganisasjonstre} from "./MineAnsatte/HovedBanner/byggOrganisasjonsTre";
import {testRespons} from "../mocking/mockresponsFraAltinn";

const App: FunctionComponent = () => {
    byggOrganisasjonstre(testRespons);

    const [valgtArbeidstaker,setValgtArbeidstaker] = useState();
    return (
     <div>
            <LoginBoundary>
                <Router basename={basename}>
                    <Route exact path="/enkeltArbeidsforhold"><EnkeltArbeidsforhold valgtArbeidsTaker={valgtArbeidstaker} /></Route>
                    <Route exact path="/"><MineAnsatte setValgtArbeidstaker={setValgtArbeidstaker}/></Route>
                    </Router>
            </LoginBoundary>
     </div>
  );
};

export default App;

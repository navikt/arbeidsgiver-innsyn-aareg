import React, {FunctionComponent, useState} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { basename } from './paths';
import LoginBoundary from "./LoggInnBoundary";
import MineAnsatte from "./MineAnsatte/MineAnsatte";
import {EnkeltArbeidsforhold} from "./MineAnsatte/EnkeltArbeidsforhold/EnkeltArbeidsforhold";


const App: FunctionComponent = () => {

    const [valgtArbeidstaker,setValgtArbeidstaker] = useState(27127424204);
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

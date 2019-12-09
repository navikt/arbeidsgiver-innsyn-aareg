import React, {FunctionComponent} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { basename } from './paths';
import LoginBoundary from "./LoggInnBoundary";
import MineAnsatte from "./MineAnsatte/MineAnsatte";
import {EnkeltArbeidsforhold} from "./MineAnsatte/EnkeltArbeidsforhold/EnkeltArbeidsforhold";

const App: FunctionComponent = () => {

    return (
     <div>
            <LoginBoundary>
                <Router basename={basename}>
                    <Route exact path="/enkeltArbeidsforhold"><EnkeltArbeidsforhold /></Route>
                    <Route exact path="/"><MineAnsatte/></Route>
                    </Router>
            </LoginBoundary>
     </div>
  );
};

export default App;

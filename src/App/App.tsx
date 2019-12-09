import React, {FunctionComponent} from 'react';
import {BrowserRouter} from 'react-router-dom';
import { basename } from './paths';
import LoginBoundary from "./LoggInnBoundary";
import MineAnsatte from "./MineAnsatte/MineAnsatte";
import {Normaltekst} from "nav-frontend-typografi";

const App: FunctionComponent = () => {

    return (
        <BrowserRouter basename={basename}>
            <LoginBoundary>
                <MineAnsatte/>
            </LoginBoundary>
        </BrowserRouter>
  );
};

export default App;

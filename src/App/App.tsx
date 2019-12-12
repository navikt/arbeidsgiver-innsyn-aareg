import React, {FunctionComponent} from 'react';
import {BrowserRouter} from 'react-router-dom';
import { basename } from './paths';
import LoginBoundary from "./LoggInnBoundary";
import MineAnsatte from "./MineAnsatte/MineAnsatte";
import {byggOrganisasjonstre} from "./MineAnsatte/HovedBanner/byggOrganisasjonsTre";
import {testRespons} from "../mocking/mockresponsFraAltinn";

const App: FunctionComponent = () => {
    byggOrganisasjonstre(testRespons);

    return (
        <BrowserRouter basename={basename}>
            <LoginBoundary>
                <MineAnsatte/>
            </LoginBoundary>
        </BrowserRouter>
  );
};

export default App;

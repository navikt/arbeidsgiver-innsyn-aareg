import React, {FunctionComponent} from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import { basename } from './paths';
import LoginBoundary from "./LoggInnBoundary";
import MineAnsatte from "./MineAnsatte/MineAnsatte";

const App: FunctionComponent = () => {

    return (
        <BrowserRouter basename={basename}>
            <LoginBoundary>
                <MineAnsatte/>
            </LoginBoundary>
            <MineAnsatte/>
        </BrowserRouter>
  );
};

export default App;

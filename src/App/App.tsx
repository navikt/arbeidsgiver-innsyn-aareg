import React, {FunctionComponent} from 'react';
import {BrowserRouter} from 'react-router-dom';
import { basename } from './paths';
import MineAnsatte from "./MineAnsatte/MineAnsatte";

const App: FunctionComponent = () => {


    return (




        <BrowserRouter basename={basename}>
            <MineAnsatte/>

        </BrowserRouter>

  );
};

export default App;


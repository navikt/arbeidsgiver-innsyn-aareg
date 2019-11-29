import React, {FunctionComponent} from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom';

import { Route} from 'react-router';
import InformasjonOmBedriftOgAnsatte from "./InformasjonOmBedriftOgAnsatte/InformasjonOmBedriftOgAnsatte";
import { basename } from './paths';
import {hentOrganisasjonerFraAltinn} from "../api/altinnApi";

const App: FunctionComponent = () => {
    hentOrganisasjonerFraAltinn();


  return (
      <div className="typo-normal">
          <div
          >helloo</div>
        <BrowserRouter basename={basename}>
          <div>
              <div className="bakgrunnsside">
                          <Route
                              path="/"
                              exact={true}
                              component={InformasjonOmBedriftOgAnsatte}
                          />
              </div>
          </div>
        </BrowserRouter>
      </div>
  );
};

export default App;

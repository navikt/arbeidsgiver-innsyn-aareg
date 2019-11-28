import React, {FunctionComponent} from 'react';
import './App.css';
import {BrowserRouter, Switch} from 'react-router-dom';

import { Route} from 'react-router';
import InformasjonOmBedriftOgAnsatte from "./InformasjonOmBedriftOgAnsatte/InformasjonOmBedriftOgAnsatte";
import { basename } from './paths';
import InformasjonOmBedrift from "./InformasjonOmBedriftOgAnsatte/InformasjonOmBedrift/InformasjonOmBedrift";
import MineAnsatte from "./InformasjonOmBedriftOgAnsatte/MineAnsatte/MineAnsatte";

const App: FunctionComponent = () => {

    return (
      <div className="typo-normal">
          <div
          >helloo</div>
        <BrowserRouter basename={basename}>
          <div>
              <div className="bakgrunnsside">
                  <Switch>
                          <Route
                              path="/"
                              exact={true}
                              component={InformasjonOmBedriftOgAnsatte}
                          />
                      <Route
                          path="/"
                          exact={true}
                          component={InformasjonOmBedrift}
                      />
                      <Route
                          path="/ansatte"
                          exact={true}
                          component={MineAnsatte}
                      />
                  </Switch>
              </div>
          </div>
        </BrowserRouter>
      </div>
  );
};

export default App;


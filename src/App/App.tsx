import React, { FunctionComponent } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {basename} from "./paths";
import InformasjonOmBedriftOgAnsatte from "./InformasjonOmBedriftOgAnsatte/InformasjonOmBedriftOgAnsatte";
import MineAnsatte from "./InformasjonOmBedriftOgAnsatte/MineAnsatte/MineAnsatte";


const App: FunctionComponent = () => {
    return (
        <div className="typo-normal">
            <BrowserRouter basename={basename}>
                <div>
                    <Switch>
                        <div className="bakgrunnsside">
                                            <Switch>
                                                <Route
                                                    path="/bedrift"
                                                    exact={true}
                                                    component={InformasjonOmBedriftOgAnsatte}
                                                />
                                                <Route
                                                    path="/"
                                                    exact={true}
                                                    component={MineAnsatte}
                                                />
                                            </Switch>
                        </div>
                    </Switch>
                </div>
            </BrowserRouter>
        </div>
    );
};

export default App;
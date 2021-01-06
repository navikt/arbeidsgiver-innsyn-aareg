import React from 'react';
import LoginBoundary from './LoggInnBoundary';
import { FeatureToggleProvider } from './FeatureToggleProvider';
import { OrganisasjonerOgTilgangerProvider } from './OrganisasjonerOgTilgangerProvider';
import ArbeidsforholdRoutes from './ArbeidsforholdRoutes';
import './App.less';

const App = () => {
    return (
        <div className="app">
            <LoginBoundary>
                <FeatureToggleProvider>
                    <OrganisasjonerOgTilgangerProvider>
                       <ArbeidsforholdRoutes />
                    </OrganisasjonerOgTilgangerProvider>
                </FeatureToggleProvider>
            </LoginBoundary>
        </div>
    );
};

export default App;

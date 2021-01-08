import React from 'react';
import LoginBoundary from './LoggInnBoundary';
import { FeatureToggleProvider } from './FeatureToggleProvider';
import { OrganisasjonsdetaljerProvider } from './OrganisasjonsdetaljerProvider';
import ArbeidsforholdRoutes from './ArbeidsforholdRoutes';
import './App.less';
import { AltinnorganisasjonerProvider } from './AltinnorganisasjonerProvider';

const App = () => {
    return (
        <div className="app">
            <LoginBoundary>
                <FeatureToggleProvider>
                    <AltinnorganisasjonerProvider>
                        <OrganisasjonsdetaljerProvider>
                            <ArbeidsforholdRoutes />
                        </OrganisasjonsdetaljerProvider>
                    </AltinnorganisasjonerProvider>
                </FeatureToggleProvider>
            </LoginBoundary>
        </div>
    );
};

export default App;

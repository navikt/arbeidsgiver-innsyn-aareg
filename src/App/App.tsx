import React, { FunctionComponent, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { basename } from './paths';
import LoginBoundary from './LoggInnBoundary';
import { FeatureToggleProvider } from './Context/FeatureToggleProvider';
import { ArbeidsforholdProvider } from './Context/ArbeidsforholdProvider';
import { AltinnorganisasjonerProvider } from './Context/AltinnorganisasjonerProvider';
import BedriftsmenyProvider from './Context/BedriftsmenyProvider';
import FiltrerteOgSorterteArbeidsforholdProvider from './Context/FiltrerteOgSorterteArbeidsforholdProvider';
import EnkeltArbeidsforhold from './MineAnsatte/EnkeltArbeidsforhold/EnkeltArbeidsforhold';
import { MineNåværendeArbeidsforhold, MineTidligereArbeidsforhold } from './MineAnsatte/MineAnsatte';
import './App.less';
import { useLocation } from 'react-router';
import { loggSidevisning } from '../utils/amplitudefunksjonerForLogging';

const AmplitudeSidevisningEventLogger: FunctionComponent = props => {
    const location = useLocation();
    useEffect(() => {
            loggSidevisning(location.pathname);
    }, [location.pathname]);
    return <>{props.children}</>;
}


const App = () => {
    return (
        <div className="app">
            <LoginBoundary>
                <FeatureToggleProvider>
                    <AltinnorganisasjonerProvider>
                        <BrowserRouter basename={basename}>
                            <BedriftsmenyProvider>
                                <ArbeidsforholdProvider>
                                    <FiltrerteOgSorterteArbeidsforholdProvider>
                                        <AmplitudeSidevisningEventLogger>
                                        <Switch>
                                            <Route exact path="/" component={MineNåværendeArbeidsforhold} />
                                            <Route
                                                exact
                                                path="/enkeltArbeidsforhold"
                                                component={EnkeltArbeidsforhold}
                                            />
                                            <Route
                                                exact
                                                path="/tidligere-arbeidsforhold"
                                                component={MineTidligereArbeidsforhold}
                                            />
                                            <Route
                                                exact
                                                path="/tidligere-arbeidsforhold/enkeltArbeidsforhold"
                                                component={EnkeltArbeidsforhold}
                                            />
                                        </Switch>
                                        </AmplitudeSidevisningEventLogger>
                                    </FiltrerteOgSorterteArbeidsforholdProvider>
                                </ArbeidsforholdProvider>
                            </BedriftsmenyProvider>
                        </BrowserRouter>
                    </AltinnorganisasjonerProvider>
                </FeatureToggleProvider>
            </LoginBoundary>
        </div>
    );
};

export default App;

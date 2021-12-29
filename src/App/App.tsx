import React, { FunctionComponent, useContext, useEffect } from 'react';
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
import { LoginContext, LoginProvider } from './Context/LoginProvider';

const AmplitudeSidevisningEventLogger: FunctionComponent = props => {
    const location = useLocation();
    const { innlogget } = useContext(LoginContext);
    useEffect(() => {
        loggSidevisning(location.pathname, innlogget);
    }, [location.pathname]);
    return <>{props.children}</>;
};


const App = () => {
    return (
        <div className='app'>
            <LoginProvider>
                <BrowserRouter basename={basename}>
                    <AmplitudeSidevisningEventLogger>
                        <LoginBoundary>
                            <FeatureToggleProvider>
                                <AltinnorganisasjonerProvider>
                                    <BedriftsmenyProvider>
                                        <ArbeidsforholdProvider>
                                            <FiltrerteOgSorterteArbeidsforholdProvider>
                                                <Switch>
                                                    <Route exact path='/' component={MineNåværendeArbeidsforhold} />
                                                    <Route
                                                        exact
                                                        path='/enkeltArbeidsforhold'
                                                        component={EnkeltArbeidsforhold}
                                                    />
                                                    <Route
                                                        exact
                                                        path='/tidligere-arbeidsforhold'
                                                        component={MineTidligereArbeidsforhold}
                                                    />
                                                    <Route
                                                        exact
                                                        path='/tidligere-arbeidsforhold/enkeltArbeidsforhold'
                                                        component={EnkeltArbeidsforhold}
                                                    />
                                                </Switch>
                                            </FiltrerteOgSorterteArbeidsforholdProvider>
                                        </ArbeidsforholdProvider>
                                    </BedriftsmenyProvider>
                                </AltinnorganisasjonerProvider>
                            </FeatureToggleProvider>
                        </LoginBoundary>
                    </AmplitudeSidevisningEventLogger>
                </BrowserRouter>
            </LoginProvider>
        </div>
    );
};

export default App;

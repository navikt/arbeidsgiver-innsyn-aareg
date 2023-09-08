import React, {FunctionComponent, useContext, useEffect} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {basename} from './paths';
import LoginBoundary from './LoginBoundary';
import {ArbeidsforholdProvider} from './Context/ArbeidsforholdProvider';
import {AltinnorganisasjonerProvider} from './Context/AltinnorganisasjonerProvider';
import BedriftsmenyProvider from './Context/BedriftsmenyProvider';
import FiltrerteOgSorterteArbeidsforholdProvider from './Context/FiltrerteOgSorterteArbeidsforholdProvider';
import EnkeltArbeidsforhold from './MineAnsatte/EnkeltArbeidsforhold/EnkeltArbeidsforhold';
import {MineNåværendeArbeidsforhold, MineTidligereArbeidsforhold} from './MineAnsatte/MineAnsatte';
import './App.less';
import {useLocation} from 'react-router';
import {loggSidevisning} from '../utils/amplitudefunksjonerForLogging';
import {LoginContext, LoginProvider} from './Context/LoginProvider';
import {NotifikasjonWidgetProvider} from '@navikt/arbeidsgiver-notifikasjon-widget';
import {gittMiljø} from '../utils/environment';
import "@navikt/ds-css"

const AmplitudeSidevisningEventLogger: FunctionComponent = props => {
    const location = useLocation();
    const {innlogget} = useContext(LoginContext);
    useEffect(() => {
        loggSidevisning(location.pathname, innlogget);
    }, [location.pathname]);
    return <>{props.children}</>;
};
const miljø = gittMiljø<'local' | 'labs' | 'dev' | 'prod'>({
    prod: 'prod',
    dev: 'dev',
    labs: 'labs',
    other: 'local'
});

const App = () => {
    return (
        <div className='app'>
            <LoginProvider>
                <NotifikasjonWidgetProvider miljo={miljø} apiUrl={`${basename}/notifikasjon-bruker-api`}>
                    <BrowserRouter basename={basename}>
                        <AmplitudeSidevisningEventLogger>
                            <LoginBoundary>
                                <AltinnorganisasjonerProvider>
                                    <BedriftsmenyProvider>
                                        <ArbeidsforholdProvider>
                                            <FiltrerteOgSorterteArbeidsforholdProvider>
                                                <Routes>
                                                    <Route
                                                        path='/'
                                                        element={<MineNåværendeArbeidsforhold/>}/>
                                                    <Route
                                                        path='/enkeltArbeidsforhold'
                                                        element={<EnkeltArbeidsforhold/>}
                                                    />
                                                    <Route
                                                        path='/tidligere-arbeidsforhold'
                                                        element={<MineTidligereArbeidsforhold/>}
                                                    />
                                                    <Route
                                                        path='/tidligere-arbeidsforhold/enkeltArbeidsforhold'
                                                        element={<EnkeltArbeidsforhold/>}
                                                    />
                                                </Routes>
                                            </FiltrerteOgSorterteArbeidsforholdProvider>
                                        </ArbeidsforholdProvider>
                                    </BedriftsmenyProvider>
                                </AltinnorganisasjonerProvider>
                            </LoginBoundary>
                        </AmplitudeSidevisningEventLogger>
                    </BrowserRouter>
                </NotifikasjonWidgetProvider>
            </LoginProvider>
        </div>
    );
};

export default App;

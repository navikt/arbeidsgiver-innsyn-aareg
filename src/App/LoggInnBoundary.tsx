import React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import environment from '../utils/environment';
import LoggInn from './LoggInn/LoggInn';
import { sjekkInnlogget } from '../api/altinnApi';
import EnkelBanner from './EnkelBanner/EnkelBanner';
import amplitude from '../utils/amplitude';
import Lasteboks from "./Lasteboks";

export enum Tilgang {
    LASTER,
    IKKE_TILGANG,
    TILGANG
}

const LoginBoundary: FunctionComponent = props => {
    const [innlogget, setInnlogget] = useState(Tilgang.LASTER);

    function localLogin() {
        if (document.cookie.includes('selvbetjening-idtoken')) {
            setInnlogget(Tilgang.TILGANG);
        } else {
            setInnlogget(Tilgang.IKKE_TILGANG);
        }
    }

    useEffect(() => {
        setInnlogget(Tilgang.LASTER);
        const abortController = new AbortController();

        if (
            environment.MILJO === 'prod-sbs' ||
            environment.MILJO === 'dev-sbs' ||
            environment.MILJO === 'labs-gcp'
        ) {
            sjekkInnlogget(abortController.signal).then(innloggingsstatus => {
                if (innloggingsstatus) {
                    setInnlogget(Tilgang.TILGANG);
                    if (environment.MILJO) {
                        amplitude.logEvent('#arbeidsforhold bruker er innlogget');
                    }
                } else {
                    setInnlogget(Tilgang.IKKE_TILGANG);
                }
            });
            return () => abortController.abort();
        } else {
            localLogin();
        }
    }, []);

    return (
        <>
            {innlogget === Tilgang.TILGANG ? (
                props.children
            ) : innlogget === Tilgang.IKKE_TILGANG ? (
                <LoggInn />
            ) : (
                <>
                    <EnkelBanner />
                    <Lasteboks />
                </>
            )}
        </>
    );
};

export default LoginBoundary;

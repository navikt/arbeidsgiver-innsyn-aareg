import React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import environment from '../utils/environment';
import LoggInn from './LoggInn/LoggInn';
import { sjekkInnlogget } from '../api/altinnApi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import LoggInnBanner from './LoggInn/LoggInnBanner/LoggInnBanner';

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
        const getLoginStatus = async () => {
            const abortController = new AbortController();
            const signal = abortController.signal;
            if (
                environment.MILJO === 'prod-sbs' ||
                environment.MILJO === 'dev-sbs' ||
                environment.MILJO === 'labs-gcp'
            ) {
                let innloggingsstatus = await sjekkInnlogget(signal);
                if (innloggingsstatus) {
                    setInnlogget(Tilgang.TILGANG);
                } else {
                    setInnlogget(Tilgang.IKKE_TILGANG);
                }
            } else {
                localLogin();
            }
        };
        getLoginStatus();
    }, []);

    return (
        <>
            {innlogget === Tilgang.TILGANG ? (
                props.children
            ) : innlogget === Tilgang.IKKE_TILGANG ? (
                <LoggInn />
            ) : (
                <>
                    <LoggInnBanner />
                    <div className="spinner">
                        <NavFrontendSpinner type="L" />
                    </div>
                </>
            )}
        </>
    );
};

export default LoginBoundary;

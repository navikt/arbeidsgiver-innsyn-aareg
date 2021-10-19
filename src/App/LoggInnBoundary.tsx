import React, { FunctionComponent, useEffect, useState } from 'react';
import { sjekkInnlogget } from '../api/altinnApi';
import LoggInn from './LoggInn/LoggInn';
import EnkelBanner from './EnkelBanner/EnkelBanner';
import Lasteboks from './GeneriskeKomponenter/Lasteboks';
import { gittMiljø } from '../utils/environment';

export enum Tilgang {
    LASTER,
    IKKE_TILGANG,
    TILGANG,
}

const LoginBoundary: FunctionComponent = (props) => {
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
        const kjørerLokalt = gittMiljø({
            prod: false,
            dev: false,
            labs: false,
            other: true
        });

        if (kjørerLokalt) {
            localLogin();
        } else {
            sjekkInnlogget(abortController.signal).then((innloggingsstatus) => {
                if (innloggingsstatus) {
                    setInnlogget(Tilgang.TILGANG);
                } else {
                    setInnlogget(Tilgang.IKKE_TILGANG);
                }
            });
            return () => abortController.abort();
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

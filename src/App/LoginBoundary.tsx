import React, { FunctionComponent, PropsWithChildren, useContext } from 'react';
import LoggInn from './LoggInn/LoggInn';
import EnkelBanner from './EnkelBanner/EnkelBanner';
import Lasteboks from './GeneriskeKomponenter/Lasteboks';
import { Innlogget, LoginContext } from './Context/LoginProvider';

const LoginBoundary: FunctionComponent<PropsWithChildren> = (props) => {
    const { innlogget } = useContext(LoginContext);
    return (
        <>
            {innlogget === Innlogget.INNLOGGET ? (
                props.children
            ) : innlogget === Innlogget.IKKE_INNLOGGET ? (
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

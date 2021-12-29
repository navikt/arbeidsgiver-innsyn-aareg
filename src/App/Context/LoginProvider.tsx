import { createContext, FunctionComponent, useEffect, useState } from 'react';
import { sjekkInnlogget } from '../../api/altinnApi';

export enum Innlogget {
    LASTER,
    IKKE_INNLOGGET,
    INNLOGGET,
}

interface Context {
    innlogget: Innlogget;
}

export const LoginContext = createContext<Context>({
    innlogget: Innlogget.LASTER
});

export const LoginProvider: FunctionComponent = props => {
    const [innlogget, setInnlogget] = useState(Innlogget.LASTER);

    useEffect(() => {
        sjekkInnlogget()
            .then(innloggetResultat => {
                setInnlogget(innloggetResultat ? Innlogget.INNLOGGET : Innlogget.IKKE_INNLOGGET);
            });
    }, []);

    const state = {
        innlogget: innlogget
    };

    return <LoginContext.Provider value={state}>
        {props.children}
    </LoginContext.Provider>;
};

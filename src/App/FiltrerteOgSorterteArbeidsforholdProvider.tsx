import React, { createContext, FunctionComponent, useContext } from 'react';
import { ArbeidsforholdContext, Context } from "./ArbeidsforholdProvider";
import { useSortertOgFiltrertArbeidsforholdliste } from './MineAnsatte/sorteringOgFiltreringsFunksjoner';

export const FiltrerteOgSorterteArbeidsforholdContext = createContext<Context>(null);

const FiltrerteOgSorterteArbeidsforholdProvider: FunctionComponent = ({ children }) => {
    const aareg = useContext(ArbeidsforholdContext);
    const alleArbeidsforhold = aareg?.lastestatus?.status === 'ferdig' ? aareg?.lastestatus.arbeidsforhold : [];

    const arbeidsforhold = useSortertOgFiltrertArbeidsforholdliste(alleArbeidsforhold);

    const context =
        aareg?.lastestatus?.status === 'ferdig'
            ? { ...aareg, lastestatus: { ...aareg?.lastestatus, arbeidsforhold } }
            : aareg;

    return (
        <FiltrerteOgSorterteArbeidsforholdContext.Provider value={context}>
            {children}
        </FiltrerteOgSorterteArbeidsforholdContext.Provider>
    );
};

export default FiltrerteOgSorterteArbeidsforholdProvider;

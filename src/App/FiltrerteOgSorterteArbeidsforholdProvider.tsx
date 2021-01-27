import React, { createContext, FunctionComponent, useContext, useEffect, useState } from "react";
import { ArbeidsforholdContext, Context } from "./ArbeidsforholdProvider";
import { useSortertOgFiltrertArbeidsforholdliste } from './MineAnsatte/sorteringOgFiltreringsFunksjoner';
import emptyList from "./Objekter/EmptyList";

export const FiltrerteOgSorterteArbeidsforholdContext = createContext<Context>(null);

const FiltrerteOgSorterteArbeidsforholdProvider: FunctionComponent = ({ children }) => {
    const aareg = useContext(ArbeidsforholdContext);
    const [context, settContext] = useState<Context>(null);

    const alleArbeidsforhold = aareg?.lastestatus?.status === 'ferdig' ? aareg.lastestatus.arbeidsforhold : emptyList;

    const arbeidsforhold = useSortertOgFiltrertArbeidsforholdliste(alleArbeidsforhold);

    useEffect(() => {
        settContext(
            aareg?.lastestatus?.status === 'ferdig'
                ? { ...aareg, lastestatus: { ...aareg.lastestatus, arbeidsforhold } }
                : aareg
        )
    }, [settContext, aareg, arbeidsforhold]);

    return (
        <FiltrerteOgSorterteArbeidsforholdContext.Provider value={context}>
            {children}
        </FiltrerteOgSorterteArbeidsforholdContext.Provider>
    );
};

export default FiltrerteOgSorterteArbeidsforholdProvider;

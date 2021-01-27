import React, { createContext, FunctionComponent, useContext, useEffect, useState } from "react";
import { ArbeidsforholdContext, Context } from "./ArbeidsforholdProvider";
import { useSortertOgFiltrertArbeidsforholdliste } from './MineAnsatte/sorteringOgFiltreringsFunksjoner';
import { Arbeidsforhold } from "./Objekter/ArbeidsForhold";

export const FiltrerteOgSorterteArbeidsforholdContext = createContext<Context>(null);

/* Samme referanse hver gang pga. dependencies for objekter (f.eks. arrays) er by reference. */
const theEmptyList: Arbeidsforhold[] = [];

const FiltrerteOgSorterteArbeidsforholdProvider: FunctionComponent = ({ children }) => {
    const aareg = useContext(ArbeidsforholdContext);
    const [context, settContext] = useState<Context>(null);

    const alleArbeidsforhold = aareg?.lastestatus?.status === 'ferdig' ? aareg?.lastestatus.arbeidsforhold : theEmptyList;

    const arbeidsforhold = useSortertOgFiltrertArbeidsforholdliste(alleArbeidsforhold);

    useEffect(() => {
        settContext(
            aareg?.lastestatus?.status === 'ferdig'
                ? { ...aareg, lastestatus: { ...aareg?.lastestatus, arbeidsforhold } }
                : aareg
        )

    }, [aareg, arbeidsforhold]);

    return (
        <FiltrerteOgSorterteArbeidsforholdContext.Provider value={context}>
            {children}
        </FiltrerteOgSorterteArbeidsforholdContext.Provider>
    );
};

export default FiltrerteOgSorterteArbeidsforholdProvider;

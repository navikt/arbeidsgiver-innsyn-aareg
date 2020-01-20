import React, {FunctionComponent, SyntheticEvent, useEffect, useState} from 'react';
import {ToggleGruppe, ToggleKnappPureProps} from "nav-frontend-toggle";
import {Arbeidsforhold} from "../Objekter/ArbeidsForhold";
import {tellAntallAktiveOgInaktiveArbeidsforhold} from "./sorteringOgFiltreringsFunksjoner";

interface Props {
    arbeidsforhold: Arbeidsforhold[];
    filtreringValgt: (event: SyntheticEvent<EventTarget>,toggles: ToggleKnappPureProps[]) => void;
}

const Filtervalg: FunctionComponent<Props> = props => {
    const [arrayMedToggleTekst, setArrayMedToggleTekst] = useState(["Alle","Aktive","Avsluttede"]);

    useEffect(() => {
        const overSiktOverAntallAktiveOgInaktive: number[] = tellAntallAktiveOgInaktiveArbeidsforhold(props.arbeidsforhold);
        console.log("useEffect i toggler", props.arbeidsforhold, overSiktOverAntallAktiveOgInaktive, overSiktOverAntallAktiveOgInaktive[0]);
        setArrayMedToggleTekst(['Alle' + overSiktOverAntallAktiveOgInaktive[0].toString() + "4",'Aktive'+ overSiktOverAntallAktiveOgInaktive[1].toString(), 'Avsluttede'+ overSiktOverAntallAktiveOgInaktive[2].toString() ]);
    }, [props.arbeidsforhold]);

    return (
        <ToggleGruppe
            onChange={props.filtreringValgt} className={"mine-ansatte__filter"}
            defaultToggles={[
                { children: arrayMedToggleTekst[0], pressed: true },
                { children: arrayMedToggleTekst[1] },
                { children: arrayMedToggleTekst[2] }
            ]}
            minstEn
        />
    );
};

export default Filtervalg;
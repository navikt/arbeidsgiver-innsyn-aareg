import React, {FunctionComponent, SyntheticEvent} from 'react';
import {ToggleGruppe, ToggleKnappPureProps} from "nav-frontend-toggle";

interface Props {
    filtreringValgt: (event: SyntheticEvent<EventTarget>,toggles: ToggleKnappPureProps[]) => void;
    overSiktOverAntallAktiveOgInaktive: number[]
}

const Filtervalg: FunctionComponent<Props> = props => {
        const arrayMedToggleTekst = ['Alle(' + props.overSiktOverAntallAktiveOgInaktive[0]+")",'Aktive('+ props.overSiktOverAntallAktiveOgInaktive[1].toString()+")", 'Avsluttede('+ props.overSiktOverAntallAktiveOgInaktive[2].toString()+")" ];

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
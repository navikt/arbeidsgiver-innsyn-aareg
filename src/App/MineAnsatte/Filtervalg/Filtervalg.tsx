import React, {FunctionComponent, SyntheticEvent} from 'react';
import {ToggleGruppe, ToggleKnappPure, ToggleKnappPureProps} from "nav-frontend-toggle";
import './Filtervalg.less';

interface Props {
    filtreringValgt: (event: SyntheticEvent<EventTarget>,toggles: ToggleKnappPureProps[]) => void;
    overSiktOverAntallAktiveOgInaktive: number[]
    setfiltrerPaVarsler: () => void
}

const Filtervalg: FunctionComponent<Props> = props => {
        const arrayMedToggleTekst = ['Alle(' + props.overSiktOverAntallAktiveOgInaktive[0]+")",'Aktive('+ props.overSiktOverAntallAktiveOgInaktive[1].toString()+")", 'Avsluttede('+ props.overSiktOverAntallAktiveOgInaktive[2].toString()+")" ];
        return (
            <>
        <ToggleGruppe
            onChange={props.filtreringValgt}
            defaultToggles={[
                { children: arrayMedToggleTekst[0], pressed: true },
                { children: arrayMedToggleTekst[1] },
                { children: arrayMedToggleTekst[2] }
            ]}
            minstEn
        />
        <div className={ "mine-ansatte__varsel-filter"}>
            <ToggleKnappPure children = {"varslinger"} onClick={props.setfiltrerPaVarsler} />
            </div>
            </>
    );
};

export default Filtervalg;
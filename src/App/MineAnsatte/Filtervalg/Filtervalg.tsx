import React, { FunctionComponent, SyntheticEvent, useState } from 'react';
import { ToggleGruppe, ToggleKnappPure, ToggleKnappPureProps } from 'nav-frontend-toggle';
import './Filtervalg.less';

interface Props {
    filtreringValgt: (event: SyntheticEvent<EventTarget>, toggles: ToggleKnappPureProps[]) => void;
    overSiktOverAntallAktiveOgInaktive: number[];
    setfiltrerPaVarsler: () => void;
    skalFiltrerePaVarsler: boolean;
    anallVarsler: number;
    filtrerPaAktiveAvsluttede: string;
}

const Filtervalg: FunctionComponent<Props> = props => {
    const klikkpaaFilterVarsel = () => {
        props.setfiltrerPaVarsler();
    };

    const arrayMedToggleTekst = [
        'Alle (' + props.overSiktOverAntallAktiveOgInaktive[0] + ')',
        'Aktive (' + props.overSiktOverAntallAktiveOgInaktive[1].toString() + ')',
        'Avsluttede (' + props.overSiktOverAntallAktiveOgInaktive[2].toString() + ')'
    ];

    return (
        <div className={'togglecontainer'}>
            <ToggleGruppe
                onChange={props.filtreringValgt}
                defaultToggles={[
                    { children: arrayMedToggleTekst[0], pressed: props.filtrerPaAktiveAvsluttede==="Alle" },
                    { children: arrayMedToggleTekst[1], pressed: props.filtrerPaAktiveAvsluttede==="Aktive" },
                    { children: arrayMedToggleTekst[2], pressed: props.filtrerPaAktiveAvsluttede==="Avsluttede"  }
                ]}
                minstEn
                kompakt
            />
            <div className={'varselKnapp'}>
                <ToggleKnappPure
                    children={'varslinger (' + props.anallVarsler.toString() + ')'}
                    onClick={klikkpaaFilterVarsel}
                    pressed={props.skalFiltrerePaVarsler}
                />
            </div>
        </div>
    );
};

export default Filtervalg;

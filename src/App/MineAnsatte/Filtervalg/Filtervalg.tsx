import React, { FunctionComponent, SyntheticEvent } from 'react';
import { ToggleGruppe, ToggleKnappPure, ToggleKnappPureProps } from 'nav-frontend-toggle';
import './Filtervalg.less';
import {filtreringValgt, getVariabelFraUrl} from "../sorteringOgFiltreringsFunksjoner";

interface Props {
    overSiktOverAntallAktiveOgInaktive: number[];
    anallVarsler: number;
    setParameterIUrl: (parameter: string, variabel: string) => void;
}

const Filtervalg: FunctionComponent<Props> = props => {
    const filtrerPaAktiveAvsluttedeVariabel = getVariabelFraUrl('filter');
    const filtreringsValg = filtrerPaAktiveAvsluttedeVariabel ? filtrerPaAktiveAvsluttedeVariabel : 'Alle';
    const skalFiltrerePåVarselVariabel = getVariabelFraUrl('varsler');
    const skalFiltrerePåVarsler = !!(skalFiltrerePåVarselVariabel && skalFiltrerePåVarselVariabel === 'true');

    const arrayMedToggleTekst = [
        'Alle (' + props.overSiktOverAntallAktiveOgInaktive[0] + ')',
        'Aktive (' + props.overSiktOverAntallAktiveOgInaktive[1].toString() + ')',
        'Avsluttede (' + props.overSiktOverAntallAktiveOgInaktive[2].toString() + ')'
    ];

    const velgFiltrering = (event: SyntheticEvent<EventTarget>, toggles: ToggleKnappPureProps[]) => {
        const filtrering = filtreringValgt(event, toggles);
        props.setParameterIUrl('filter', filtrering);
        props.setParameterIUrl('side', '1');
    };

    return (
        <div className={'togglecontainer'}>
            <ToggleGruppe
                onChange={velgFiltrering}
                defaultToggles={[
                    { children: arrayMedToggleTekst[0], pressed: filtreringsValg==="Alle" },
                    { children: arrayMedToggleTekst[1], pressed: filtreringsValg==="Aktive" },
                    { children: arrayMedToggleTekst[2], pressed: filtreringsValg==="Avsluttede"  }
                ]}
                minstEn
                kompakt
            />
            <div className={'varselKnapp'}>
                <ToggleKnappPure
                    children={'varslinger (' + props.anallVarsler.toString() + ')'}
                    onClick={ () => {
                        props.setParameterIUrl('side', '1');
                        props.setParameterIUrl('varsler', (!skalFiltrerePåVarsler).toString())
                    }}
                    pressed={skalFiltrerePåVarsler}
                />
            </div>
        </div>
    );
};

export default Filtervalg;
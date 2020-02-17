import React, { FunctionComponent, SyntheticEvent, useState } from 'react';
import { ToggleGruppe, ToggleKnappPure, ToggleKnappPureProps } from 'nav-frontend-toggle';
import './Filtervalg.less';

interface Props {
    filtreringValgt: (event: SyntheticEvent<EventTarget>, toggles: ToggleKnappPureProps[]) => void;
    overSiktOverAntallAktiveOgInaktive: number[];
    setfiltrerPaVarsler: () => void;
    anallVarsler: number;
}

const Filtervalg: FunctionComponent<Props> = props => {
    const klikkpaaFilterVarsel = () => {
        props.setfiltrerPaVarsler();
        setFiltrertpaaVarsel(!filtrertPaaVarsel);
    };

    const [filtrertPaaVarsel, setFiltrertpaaVarsel] = useState<boolean>(false);
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
                    { children: arrayMedToggleTekst[0], pressed: true },
                    { children: arrayMedToggleTekst[1] },
                    { children: arrayMedToggleTekst[2] }
                ]}
                minstEn
                kompakt
            />
            <div className={'varselKnapp'}>
                <ToggleKnappPure
                    children={'varslinger (' + props.anallVarsler.toString() + ')'}
                    onClick={klikkpaaFilterVarsel}
                    pressed={filtrertPaaVarsel}
                />
            </div>
        </div>
    );
};

export default Filtervalg;

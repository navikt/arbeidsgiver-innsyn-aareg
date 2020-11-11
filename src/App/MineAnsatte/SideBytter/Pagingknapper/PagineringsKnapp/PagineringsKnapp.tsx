import React, {useEffect, useRef, useState} from 'react';
import { Element } from 'nav-frontend-typografi';
import './PagineringsKnapp.less';
import {getVariabelFraUrl} from "../../../sorteringOgFiltreringsFunksjoner";
const CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup');

interface Props {
    sidetall: number;
    siderTilsammen: number;
    setParameterIUrl: (parameter: string, variabel: string) => void;
    erØversteSidebytter: boolean
}

const GraSirkelMedNr = (props: Props) => {
    let ariaLabel = 'Gå til side ' + props.sidetall.toString();
    let className = 'valg';
    const erNavarendeSide = parseInt(getVariabelFraUrl('side')||'1')  === props.sidetall;

    if (erNavarendeSide) {
        ariaLabel = 'Nåværende side, ' + props.sidetall;
        className = className + ' er-valgt';
    }

    const onChange = (sidetall: number) => {
        props.setParameterIUrl('side', sidetall.toString())
    }

    return (
        <button
            id={'pagineringsknapp-'+props.sidetall}
            key={props.sidetall}
            role={"navigasjon"}
            className={'valg'}
            onClick={() => onChange(props.sidetall)}
            aria-label={ariaLabel}
            aria-current={erNavarendeSide}

        >
            <CSSTransitionGroup
                transitionName="valg"
                transitionAppear={true}
                transitionAppearTimeout={700}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}
            >
                <Element className="valg__sidetall">{props.sidetall.toString()}</Element>
            </CSSTransitionGroup>
        </button>
    );
};

export default GraSirkelMedNr;
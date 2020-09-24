import React from 'react';
import { Element } from 'nav-frontend-typografi';
import './PagineringsKnapp.less';
const CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup');

interface Props {
    sidetall: number;
    siderTilsammen: number;
    nåVærendeSidetall: number;
    setParameterIUrl: (parameter: string, variabel: string) => void;
}

const GraSirkelMedNr = (props: Props) => {
    let ariaLabel = 'Goto Page ' + props.sidetall.toString();
    let className = 'valg';
    const erNavarendeSide = props.nåVærendeSidetall === props.sidetall;

    if (erNavarendeSide) {
        ariaLabel = 'Current Page, ' + props.nåVærendeSidetall.toString();
        className = className + ' er-valgt';
    }

    const onChange = () => {
        props.setParameterIUrl('side', props.sidetall.toString())
    }

    return (
        <button
            key={props.sidetall}
            className={className}
            onClick={() => onChange()}
            id={props.sidetall.toString()}
            aria-label={ariaLabel}
            aria-current={props.nåVærendeSidetall === props.sidetall}
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

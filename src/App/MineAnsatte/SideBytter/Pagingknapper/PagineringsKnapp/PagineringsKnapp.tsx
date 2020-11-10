import React, {useEffect, useRef} from 'react';
import { Element } from 'nav-frontend-typografi';
import './PagineringsKnapp.less';
const CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup');

interface Props {
    sidetall: number;
    siderTilsammen: number;
    nåVærendeSidetall: number;
    setParameterIUrl: (parameter: string, variabel: string) => void;
    erØversteSidebytter: boolean
}

const GraSirkelMedNr = (props: Props) => {
    let ariaLabel = 'Gå til side ' + props.sidetall.toString();
    let className = 'valg';
    const erNavarendeSide = props.nåVærendeSidetall === props.sidetall;

    if (erNavarendeSide) {
        ariaLabel = 'Nåværende side, ' + props.nåVærendeSidetall.toString();
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
            className={className}
            onClick={() => onChange(props.sidetall)}
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

import React, { FunctionComponent } from 'react';
import './PagineringsKnapp.less';
import { Element } from 'nav-frontend-typografi';
const CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup');

interface Props {
    sidetall: number;
    siderTilsammen: number;
    naVarendeIndeks: number;
    byttSide: (indeks: number) => void;
}

const GraSirkelMedNr: FunctionComponent<Props> = props => {
    let ariaLabel = 'Goto Page ' + props.sidetall.toString();
    const erNavarendeSide = props.naVarendeIndeks === props.sidetall;
    if (erNavarendeSide) {
        ariaLabel = 'Current Page, ' + props.naVarendeIndeks.toString();
        const id = document.getElementById(props.sidetall.toString());
        if (id) {
            id.focus();
        }
    }

    return (
        <button
            key={props.sidetall}
            className={'valg'}
            onClick={() => props.byttSide(props.sidetall)}
            id={props.sidetall.toString()}
            aria-label={ariaLabel}
            aria-current={props.naVarendeIndeks === props.sidetall}
        >
            <CSSTransitionGroup
                transitionName="valg"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnterTimeout={100}
                transitionLeaveTimeout={0}

            >
                <Element className={'valg__sidetall'}>{props.sidetall.toString()}</Element>
            </CSSTransitionGroup>
        </button>
    );
};

export default GraSirkelMedNr;



import React from 'react';
import { Element } from 'nav-frontend-typografi';
import './PagineringsKnapp.less';
import { useParams } from 'react-router-dom';
const CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup');

interface Props {
    sidetall: number;
    siderTilsammen: number;
    naVarendeIndeks: number;
    byttSide: (indeks: number) => void;
}

const GraSirkelMedNr = (props: Props) => {
    let ariaLabel = 'Goto Page ' + props.sidetall.toString();
    let className = 'valg';
    const erNavarendeSide = props.naVarendeIndeks === props.sidetall;
    const { sidetall } = useParams();

    location.search

    if (erNavarendeSide) {
        ariaLabel = 'Current Page, ' + props.naVarendeIndeks.toString();
        className = className + ' er-valgt';
    }

    const onChange = () => {
        props.byttSide(props.sidetall);
        window.location.href = window.location.toString() + "?side="+props.sidetall.toString();


    }

    return (
        <button
            key={props.sidetall}
            className={className}
            onClick={() => onChange()}
            id={props.sidetall.toString()}
            aria-label={ariaLabel}
            aria-current={props.naVarendeIndeks === props.sidetall}
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

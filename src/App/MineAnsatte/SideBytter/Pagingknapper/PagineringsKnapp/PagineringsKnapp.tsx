import React, {useEffect, useRef } from 'react';
import { Element } from 'nav-frontend-typografi';
import './PagineringsKnapp.less';
import {getVariabelFraUrl} from "../../../sorteringOgFiltreringsFunksjoner";
const CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup');

interface Props {
    sidetall: number;
    siderTilsammen: number;
    setParameterIUrl: (parameter: string, variabel: string) => void;
    erØversteSidebytter: boolean
    elementIFokus: number;
}

const GraSirkelMedNr = (props: Props) => {
    let ariaLabel = 'Gå til side ' + props.sidetall.toString();
    const erNavarendeSide = parseInt(getVariabelFraUrl('side')||'1')  === props.sidetall;

    if (erNavarendeSide) {
        ariaLabel = `side ${props.sidetall} valgt,`;
        if (props.sidetall === props.siderTilsammen) {
            ariaLabel += 'dette er siste side'
        }
    }

    const knappElement = useRef<HTMLButtonElement>(null)
    useEffect(() => {
        if (props.elementIFokus === props.sidetall) {
            knappElement.current?.focus();
        }
    },[props.elementIFokus, props.sidetall, knappElement])

    const onChange = (sidetall: number) => {
        props.setParameterIUrl('side', sidetall.toString())
    }

    return (
        <button
            ref={knappElement}
            id={'pagineringsknapp-'+props.sidetall}
            key={props.sidetall}
            role={"navigation"}
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
import React, { useEffect, useRef } from 'react';
import './PagineringsKnapp.css';
import { useSearchParameters } from '../../../../../utils/UrlManipulation';
import { Label } from '@navikt/ds-react';

interface Props {
    sidetall: number;
    siderTilsammen: number;
    onSideendring: (key: string) => void;
    elementIFokus: number;
}

const GraSirkelMedNr = (props: Props) => {
    const { getSearchParameter, setSearchParameter } = useSearchParameters();

    let ariaLabel = 'Gå til side ' + props.sidetall.toString();
    const erNavarendeSide = parseInt(getSearchParameter('side') || '1') === props.sidetall;
    const className = erNavarendeSide ? 'sidebytter__valg er-valgt' : 'sidebytter__valg';

    if (erNavarendeSide) {
        ariaLabel = `side ${props.sidetall} valgt`;
        if (props.sidetall === props.siderTilsammen) {
            ariaLabel += ' ,dette er siste side';
        }
    }

    const knappElement = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        if (props.elementIFokus === props.sidetall) {
            knappElement.current?.focus();
        }
    }, [props.elementIFokus, props.sidetall, knappElement]);

    const onChange = (sidetall: number) => setSearchParameter({ side: sidetall.toString() });

    return (
        <button
            onKeyDown={(e) => props.onSideendring(e.key)}
            ref={knappElement}
            id={'pagineringsknapp-' + props.sidetall}
            key={props.sidetall}
            className={className}
            onClick={() => onChange(props.sidetall)}
            aria-label={ariaLabel}
            aria-current={erNavarendeSide}
        >
            <Label className="valg__sidetall">{props.sidetall.toString()}</Label>
        </button>
    );
};

export default GraSirkelMedNr;

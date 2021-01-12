import React, { FunctionComponent } from 'react';
import PagineringsKnapp from './PagineringsKnapp/PagineringsKnapp';

interface Props {
    className?: string;
    siderTilsammen: number;
    elementIFokus: number;
    onSideendring: (key: string) => void;
}

const SisteDel: FunctionComponent<Props> = props => {
    return (
        <>
            <PagineringsKnapp
                onSideendring={props.onSideendring}
                sidetall={1}
                siderTilsammen={props.siderTilsammen}
                elementIFokus = {props.elementIFokus}
            />
            ...
            <PagineringsKnapp
                onSideendring={props.onSideendring}
                sidetall={props.siderTilsammen - 2}
                siderTilsammen={props.siderTilsammen}
                elementIFokus = {props.elementIFokus}
            />
            <PagineringsKnapp
                onSideendring={props.onSideendring}
                sidetall={props.siderTilsammen - 1}
                siderTilsammen={props.siderTilsammen}
                elementIFokus = {props.elementIFokus}
            />
            <PagineringsKnapp
                onSideendring={props.onSideendring}
                sidetall={props.siderTilsammen}
                siderTilsammen={props.siderTilsammen}
                elementIFokus = {props.elementIFokus}
            />
        </>
    );
};

export default SisteDel;

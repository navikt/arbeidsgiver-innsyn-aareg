import React, { FunctionComponent } from 'react';
import PagineringsKnapp from './PagineringsKnapp/PagineringsKnapp';

interface Props {
    className?: string;
    byttSide: (indeks: number) => void;
    siderTilsammen: number;
    naVarendeIndeks: number;
}

const SisteDel: FunctionComponent<Props> = props => {
    return (
        <>
            <PagineringsKnapp
                sidetall={1}
                siderTilsammen={props.siderTilsammen}
                naVarendeIndeks={props.naVarendeIndeks}
                byttSide={props.byttSide}
            />
            ...
            <PagineringsKnapp
                byttSide={props.byttSide}
                naVarendeIndeks={props.naVarendeIndeks}
                sidetall={props.siderTilsammen - 2}
                siderTilsammen={props.siderTilsammen}
            />
            <PagineringsKnapp
                byttSide={props.byttSide}
                sidetall={props.siderTilsammen - 1}
                siderTilsammen={props.siderTilsammen}
                naVarendeIndeks={props.naVarendeIndeks}
            />
            <PagineringsKnapp
                byttSide={props.byttSide}
                sidetall={props.siderTilsammen}
                siderTilsammen={props.siderTilsammen}
                naVarendeIndeks={props.naVarendeIndeks}
            />
        </>
    );
};

export default SisteDel;

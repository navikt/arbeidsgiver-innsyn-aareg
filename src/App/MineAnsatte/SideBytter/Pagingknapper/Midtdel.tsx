import React, { FunctionComponent } from 'react';
import PagineringsKnapp from './PagineringsKnapp/PagineringsKnapp';

interface Props {
    className?: string;
    byttSide: (indeks: number) => void;
    naVarendeIndeks: number;
    siderTilsammen: number;
}

const Midtdel: FunctionComponent<Props> = props => {
    return (
        <>
            <PagineringsKnapp
                naVarendeIndeks={props.naVarendeIndeks}
                siderTilsammen={props.siderTilsammen}
                sidetall={1}
                byttSide={props.byttSide}
            />
            ...
            <PagineringsKnapp
                naVarendeIndeks={props.naVarendeIndeks}
                siderTilsammen={props.siderTilsammen}
                sidetall={props.naVarendeIndeks - 1}
                byttSide={props.byttSide}
            />
            <PagineringsKnapp
                naVarendeIndeks={props.naVarendeIndeks}
                siderTilsammen={props.siderTilsammen}
                sidetall={props.naVarendeIndeks}
                byttSide={props.byttSide}
            />
            <PagineringsKnapp
                siderTilsammen={props.siderTilsammen}
                sidetall={props.naVarendeIndeks + 1}
                naVarendeIndeks={props.naVarendeIndeks}
                byttSide={props.byttSide}
            />
            {props.naVarendeIndeks < props.siderTilsammen - 1 && (
                <>
                    ...
                    <PagineringsKnapp
                        naVarendeIndeks={props.naVarendeIndeks}
                        siderTilsammen={props.siderTilsammen}
                        sidetall={props.siderTilsammen}
                        byttSide={props.byttSide}
                    />
                </>
            )}
        </>
    );
};

export default Midtdel;

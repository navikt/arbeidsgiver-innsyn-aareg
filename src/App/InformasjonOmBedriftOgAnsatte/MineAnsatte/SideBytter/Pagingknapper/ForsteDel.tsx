import React, { FunctionComponent } from 'react';
import './PagineringsKnapp/PagineringsKnapp.less';
import PagineringsKnapp from './PagineringsKnapp/PagineringsKnapp';

interface Props {
    className?: string;
    byttSide: (indeks: number) => void;
    siderTilsammen: number;
    naVarendeIndeks: number;
}

const ForsteDel: FunctionComponent<Props> = props => {




    return (
        <>
            <PagineringsKnapp
                naVarendeIndeks={props.naVarendeIndeks}
                sidetall={1}
                siderTilsammen={props.siderTilsammen}
                byttSide={props.byttSide}
            />

            <PagineringsKnapp
                sidetall={2}
                siderTilsammen={props.siderTilsammen}
                naVarendeIndeks={props.naVarendeIndeks}
                byttSide={props.byttSide}
            />

            {props.siderTilsammen > 2 && (
                <PagineringsKnapp
                    sidetall={3}
                    siderTilsammen={props.siderTilsammen}
                    naVarendeIndeks={props.naVarendeIndeks}
                    byttSide={props.byttSide}
                />
            )}
            {props.siderTilsammen > 3 && (
                <>
                    ...
                    <PagineringsKnapp
                        sidetall={props.siderTilsammen}
                        siderTilsammen={props.siderTilsammen}
                        naVarendeIndeks={props.naVarendeIndeks}
                        byttSide={props.byttSide}
                    />
                </>
            )}
        </>
    );
};

export default ForsteDel;

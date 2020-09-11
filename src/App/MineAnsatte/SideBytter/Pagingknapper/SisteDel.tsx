import React, { FunctionComponent } from 'react';
import PagineringsKnapp from './PagineringsKnapp/PagineringsKnapp';

interface Props {
    className?: string;
    setParameterIUrl: (parameter: string, variabel: string) => void;
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
                setParameterIUrl={props.setParameterIUrl}
            />
            ...
            <PagineringsKnapp
                setParameterIUrl={props.setParameterIUrl}
                naVarendeIndeks={props.naVarendeIndeks}
                sidetall={props.siderTilsammen - 2}
                siderTilsammen={props.siderTilsammen}
            />
            <PagineringsKnapp
                setParameterIUrl={props.setParameterIUrl}
                sidetall={props.siderTilsammen - 1}
                siderTilsammen={props.siderTilsammen}
                naVarendeIndeks={props.naVarendeIndeks}
            />
            <PagineringsKnapp
                setParameterIUrl={props.setParameterIUrl}
                sidetall={props.siderTilsammen}
                siderTilsammen={props.siderTilsammen}
                naVarendeIndeks={props.naVarendeIndeks}
            />
        </>
    );
};

export default SisteDel;

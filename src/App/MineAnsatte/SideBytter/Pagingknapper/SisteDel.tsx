import React, { FunctionComponent } from 'react';
import PagineringsKnapp from './PagineringsKnapp/PagineringsKnapp';

interface Props {
    className?: string;
    setParameterIUrl: (parameter: string, variabel: string) => void;
    siderTilsammen: number;
    nåVærendeSidetall: number;
}

const SisteDel: FunctionComponent<Props> = props => {
    return (
        <>
            <PagineringsKnapp
                sidetall={1}
                siderTilsammen={props.siderTilsammen}
                nåVærendeSidetall={props.nåVærendeSidetall}
                setParameterIUrl={props.setParameterIUrl}
            />
            ...
            <PagineringsKnapp
                setParameterIUrl={props.setParameterIUrl}
                nåVærendeSidetall={props.nåVærendeSidetall}
                sidetall={props.siderTilsammen - 2}
                siderTilsammen={props.siderTilsammen}
            />
            <PagineringsKnapp
                setParameterIUrl={props.setParameterIUrl}
                sidetall={props.siderTilsammen - 1}
                siderTilsammen={props.siderTilsammen}
                nåVærendeSidetall={props.nåVærendeSidetall}
            />
            <PagineringsKnapp
                setParameterIUrl={props.setParameterIUrl}
                sidetall={props.siderTilsammen}
                siderTilsammen={props.siderTilsammen}
                nåVærendeSidetall={props.nåVærendeSidetall}
            />
        </>
    );
};

export default SisteDel;

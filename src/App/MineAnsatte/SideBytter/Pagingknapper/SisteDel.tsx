import React, { FunctionComponent } from 'react';
import PagineringsKnapp from './PagineringsKnapp/PagineringsKnapp';

interface Props {
    className?: string;
    setParameterIUrl: (parameter: string, variabel: string) => void;
    siderTilsammen: number;
    nåVærendeSidetall: number;
    erØversteSidebytter: boolean
}

const SisteDel: FunctionComponent<Props> = props => {
    return (
        <>
            <PagineringsKnapp
                sidetall={1}
                siderTilsammen={props.siderTilsammen}
                nåVærendeSidetall={props.nåVærendeSidetall}
                setParameterIUrl={props.setParameterIUrl}
                erØversteSidebytter={props.erØversteSidebytter}
            />
            ...
            <PagineringsKnapp
                setParameterIUrl={props.setParameterIUrl}
                nåVærendeSidetall={props.nåVærendeSidetall}
                sidetall={props.siderTilsammen - 2}
                siderTilsammen={props.siderTilsammen}
                erØversteSidebytter={props.erØversteSidebytter}
            />
            <PagineringsKnapp
                setParameterIUrl={props.setParameterIUrl}
                sidetall={props.siderTilsammen - 1}
                siderTilsammen={props.siderTilsammen}
                nåVærendeSidetall={props.nåVærendeSidetall}
                erØversteSidebytter={props.erØversteSidebytter}
            />
            <PagineringsKnapp
                setParameterIUrl={props.setParameterIUrl}
                sidetall={props.siderTilsammen}
                siderTilsammen={props.siderTilsammen}
                nåVærendeSidetall={props.nåVærendeSidetall}
                erØversteSidebytter={props.erØversteSidebytter}
            />
        </>
    );
};

export default SisteDel;

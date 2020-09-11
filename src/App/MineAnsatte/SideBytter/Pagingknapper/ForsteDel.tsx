import React, { FunctionComponent } from 'react';
import PagineringsKnapp from './PagineringsKnapp/PagineringsKnapp';
import './PagineringsKnapp/PagineringsKnapp.less';

interface Props {
    className?: string;
    setParameterIUrl: (parameter: string, variabel: string) => void;
    siderTilsammen: number;
    nåVærendeSidetall: number;
}

const ForsteDel: FunctionComponent<Props> = props => {
    return (
        <>
            <PagineringsKnapp
                sidetall={1}
                siderTilsammen={props.siderTilsammen}
                nåVærendeSidetall={props.nåVærendeSidetall}
                setParameterIUrl={props.setParameterIUrl}
            />

            <PagineringsKnapp
                sidetall={2}
                siderTilsammen={props.siderTilsammen}
                nåVærendeSidetall={props.nåVærendeSidetall}
                setParameterIUrl={props.setParameterIUrl}
            />

            {props.siderTilsammen > 2 && (
                <PagineringsKnapp
                    sidetall={3}
                    siderTilsammen={props.siderTilsammen}
                    nåVærendeSidetall={props.nåVærendeSidetall}
                    setParameterIUrl={props.setParameterIUrl}
                />
            )}

            {props.siderTilsammen > 3 && (
                <>
                    ...
                    <PagineringsKnapp
                        sidetall={props.siderTilsammen}
                        siderTilsammen={props.siderTilsammen}
                        nåVærendeSidetall={props.nåVærendeSidetall}
                        setParameterIUrl={props.setParameterIUrl}
                    />
                </>
            )}
        </>
    );
};

export default ForsteDel;

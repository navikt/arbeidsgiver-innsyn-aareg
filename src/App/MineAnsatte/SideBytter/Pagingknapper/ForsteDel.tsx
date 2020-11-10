import React, { FunctionComponent } from 'react';
import PagineringsKnapp from './PagineringsKnapp/PagineringsKnapp';
import './PagineringsKnapp/PagineringsKnapp.less';

interface Props {
    className?: string;
    setParameterIUrl: (parameter: string, variabel: string) => void;
    siderTilsammen: number;
    nåVærendeSidetall: number;
    erØversteSidebytter: boolean
}

const ForsteDel: FunctionComponent<Props> = props => {
    return (
        <>
            <PagineringsKnapp
                erØversteSidebytter={props.erØversteSidebytter}
                sidetall={1}
                siderTilsammen={props.siderTilsammen}
                nåVærendeSidetall={props.nåVærendeSidetall}
                setParameterIUrl={props.setParameterIUrl}
            />

            <PagineringsKnapp
                erØversteSidebytter={props.erØversteSidebytter}
                sidetall={2}
                siderTilsammen={props.siderTilsammen}
                nåVærendeSidetall={props.nåVærendeSidetall}
                setParameterIUrl={props.setParameterIUrl}
            />

            {props.siderTilsammen > 2 && (
                <PagineringsKnapp
                    erØversteSidebytter={props.erØversteSidebytter}
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
                        erØversteSidebytter={props.erØversteSidebytter}
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

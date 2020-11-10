import React, { FunctionComponent } from 'react';
import PagineringsKnapp from './PagineringsKnapp/PagineringsKnapp';

interface Props {
    className?: string;
    setParameterIUrl: (parameter: string, variabel: string) => void;
    nåVærendeSidetall: number;
    siderTilsammen: number;
    erØversteSidebytter: boolean
}

const Midtdel: FunctionComponent<Props> = props => {
    return (
        <>
            <PagineringsKnapp
                nåVærendeSidetall={props.nåVærendeSidetall}
                siderTilsammen={props.siderTilsammen}
                sidetall={1}
                setParameterIUrl={props.setParameterIUrl}
                erØversteSidebytter={props.erØversteSidebytter}
            />
            ...
            <PagineringsKnapp
                nåVærendeSidetall={props.nåVærendeSidetall}
                siderTilsammen={props.siderTilsammen}
                sidetall={props.nåVærendeSidetall - 1}
                setParameterIUrl={props.setParameterIUrl}
                erØversteSidebytter={props.erØversteSidebytter}
            />
            <PagineringsKnapp
                nåVærendeSidetall={props.nåVærendeSidetall}
                siderTilsammen={props.siderTilsammen}
                sidetall={props.nåVærendeSidetall}
                setParameterIUrl={props.setParameterIUrl}
                erØversteSidebytter={props.erØversteSidebytter}
            />
            <PagineringsKnapp
                siderTilsammen={props.siderTilsammen}
                sidetall={props.nåVærendeSidetall + 1}
                nåVærendeSidetall={props.nåVærendeSidetall}
                setParameterIUrl={props.setParameterIUrl}
                erØversteSidebytter={props.erØversteSidebytter}
            />
            {props.nåVærendeSidetall < props.siderTilsammen - 1 && (
                <>
                    ...
                    <PagineringsKnapp
                        nåVærendeSidetall={props.nåVærendeSidetall}
                        siderTilsammen={props.siderTilsammen}
                        sidetall={props.siderTilsammen}
                        setParameterIUrl={props.setParameterIUrl}
                        erØversteSidebytter={props.erØversteSidebytter}
                    />
                </>
            )}
        </>
    );
};

export default Midtdel;

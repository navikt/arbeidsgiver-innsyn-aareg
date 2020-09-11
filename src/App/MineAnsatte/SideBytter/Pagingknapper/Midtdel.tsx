import React, { FunctionComponent } from 'react';
import PagineringsKnapp from './PagineringsKnapp/PagineringsKnapp';

interface Props {
    className?: string;
    setParameterIUrl: (parameter: string, variabel: string) => void;
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
                setParameterIUrl={props.setParameterIUrl}
            />
            ...
            <PagineringsKnapp
                naVarendeIndeks={props.naVarendeIndeks}
                siderTilsammen={props.siderTilsammen}
                sidetall={props.naVarendeIndeks - 1}
                setParameterIUrl={props.setParameterIUrl}
            />
            <PagineringsKnapp
                naVarendeIndeks={props.naVarendeIndeks}
                siderTilsammen={props.siderTilsammen}
                sidetall={props.naVarendeIndeks}
                setParameterIUrl={props.setParameterIUrl}
            />
            <PagineringsKnapp
                siderTilsammen={props.siderTilsammen}
                sidetall={props.naVarendeIndeks + 1}
                naVarendeIndeks={props.naVarendeIndeks}
                setParameterIUrl={props.setParameterIUrl}
            />
            {props.naVarendeIndeks < props.siderTilsammen - 1 && (
                <>
                    ...
                    <PagineringsKnapp
                        naVarendeIndeks={props.naVarendeIndeks}
                        siderTilsammen={props.siderTilsammen}
                        sidetall={props.siderTilsammen}
                        setParameterIUrl={props.setParameterIUrl}
                    />
                </>
            )}
        </>
    );
};

export default Midtdel;

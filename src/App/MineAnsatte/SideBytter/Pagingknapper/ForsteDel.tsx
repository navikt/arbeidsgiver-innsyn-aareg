import React, { FunctionComponent } from 'react';
import PagineringsKnapp from './PagineringsKnapp/PagineringsKnapp';
import './PagineringsKnapp/PagineringsKnapp.less';

interface Props {
    className?: string;
    setParameterIUrl: (parameter: string, variabel: string) => void;
    siderTilsammen: number;
    erØversteSidebytter: boolean
    elementIFokus: number;
}

const ForsteDel: FunctionComponent<Props> = props => {
    return (
        <>
            <PagineringsKnapp
                erØversteSidebytter={props.erØversteSidebytter}
                sidetall={1}
                siderTilsammen={props.siderTilsammen}
                setParameterIUrl={props.setParameterIUrl}
                elementIFokus = {props.elementIFokus}
            />

            <PagineringsKnapp
                erØversteSidebytter={props.erØversteSidebytter}
                sidetall={2}
                siderTilsammen={props.siderTilsammen}
                setParameterIUrl={props.setParameterIUrl}
                elementIFokus = {props.elementIFokus}
            />

            {props.siderTilsammen > 2 && (
                <PagineringsKnapp
                    erØversteSidebytter={props.erØversteSidebytter}
                    sidetall={3}
                    siderTilsammen={props.siderTilsammen}
                    setParameterIUrl={props.setParameterIUrl}
                    elementIFokus = {props.elementIFokus}
                />
            )}

            {props.siderTilsammen > 3 && (
                <>
                    ...
                    <PagineringsKnapp
                        erØversteSidebytter={props.erØversteSidebytter}
                        sidetall={props.siderTilsammen}
                        siderTilsammen={props.siderTilsammen}
                        setParameterIUrl={props.setParameterIUrl}
                        elementIFokus = {props.elementIFokus}
                    />
                </>
            )}
        </>
    );
};

export default ForsteDel;

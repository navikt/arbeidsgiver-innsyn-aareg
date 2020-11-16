import React, { FunctionComponent } from 'react';
import PagineringsKnapp from './PagineringsKnapp/PagineringsKnapp';

interface Props {
    className?: string;
    setParameterIUrl: (parameter: string, variabel: string) => void;
    siderTilsammen: number;
    erØversteSidebytter: boolean
    elementIFokus: number;
    onSideendring: (key: string) => void;
}

const SisteDel: FunctionComponent<Props> = props => {
    return (
        <>
            <PagineringsKnapp
                onSideendring={props.onSideendring}
                sidetall={1}
                siderTilsammen={props.siderTilsammen}
                setParameterIUrl={props.setParameterIUrl}
                erØversteSidebytter={props.erØversteSidebytter}
                elementIFokus = {props.elementIFokus}
            />
            ...
            <PagineringsKnapp
                onSideendring={props.onSideendring}
                setParameterIUrl={props.setParameterIUrl}
                sidetall={props.siderTilsammen - 2}
                siderTilsammen={props.siderTilsammen}
                erØversteSidebytter={props.erØversteSidebytter}
                elementIFokus = {props.elementIFokus}
            />
            <PagineringsKnapp
                onSideendring={props.onSideendring}
                setParameterIUrl={props.setParameterIUrl}
                sidetall={props.siderTilsammen - 1}
                siderTilsammen={props.siderTilsammen}
                erØversteSidebytter={props.erØversteSidebytter}
                elementIFokus = {props.elementIFokus}
            />
            <PagineringsKnapp
                onSideendring={props.onSideendring}
                setParameterIUrl={props.setParameterIUrl}
                sidetall={props.siderTilsammen}
                siderTilsammen={props.siderTilsammen}
                erØversteSidebytter={props.erØversteSidebytter}
                elementIFokus = {props.elementIFokus}
            />
        </>
    );
};

export default SisteDel;

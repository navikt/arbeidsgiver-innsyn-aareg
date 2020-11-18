import React, { FunctionComponent } from 'react';
import PagineringsKnapp from './PagineringsKnapp/PagineringsKnapp';
import {getVariabelFraUrl} from "../../sorteringOgFiltreringsFunksjoner";

interface Props {
    className?: string;
    setParameterIUrl: (parameter: string, variabel: string) => void;
    siderTilsammen: number;
    elementIFokus: number;
    onSideendring: (key: string) => void
}

const Midtdel: FunctionComponent<Props> = props => {
    const nåVærendeSidetall = parseInt(getVariabelFraUrl('side') || '1')

    return (
        <>
            <PagineringsKnapp
                onSideendring={props.onSideendring}
                siderTilsammen={props.siderTilsammen}
                sidetall={1}
                setParameterIUrl={props.setParameterIUrl}
                elementIFokus = {props.elementIFokus}
            />
            ...
            <PagineringsKnapp
                onSideendring={props.onSideendring}
                siderTilsammen={props.siderTilsammen}
                sidetall={nåVærendeSidetall - 1}
                setParameterIUrl={props.setParameterIUrl}
                elementIFokus = {props.elementIFokus}
            />
            <PagineringsKnapp
                onSideendring={props.onSideendring}
                siderTilsammen={props.siderTilsammen}
                sidetall={nåVærendeSidetall}
                setParameterIUrl={props.setParameterIUrl}
                elementIFokus = {props.elementIFokus}
            />
            <PagineringsKnapp
                onSideendring={props.onSideendring}
                siderTilsammen={props.siderTilsammen}
                sidetall={nåVærendeSidetall + 1}
                setParameterIUrl={props.setParameterIUrl}
                elementIFokus = {props.elementIFokus}
            />
            {nåVærendeSidetall < props.siderTilsammen - 1 && (
                <>
                    ...
                    <PagineringsKnapp
                        onSideendring={props.onSideendring}
                        siderTilsammen={props.siderTilsammen}
                        sidetall={props.siderTilsammen}
                        setParameterIUrl={props.setParameterIUrl}
                        elementIFokus = {props.elementIFokus}
                    />
                </>
            )}
        </>
    );
};

export default Midtdel;

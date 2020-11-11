import React, { FunctionComponent } from 'react';
import PagineringsKnapp from './PagineringsKnapp/PagineringsKnapp';
import {getVariabelFraUrl} from "../../sorteringOgFiltreringsFunksjoner";

interface Props {
    className?: string;
    setParameterIUrl: (parameter: string, variabel: string) => void;
    siderTilsammen: number;
    erØversteSidebytter: boolean
    elementIFokus: number;
}

const Midtdel: FunctionComponent<Props> = props => {
    const nåVærendeSidetall = parseInt(getVariabelFraUrl('side') || '1')

    return (
        <>
            <PagineringsKnapp
                siderTilsammen={props.siderTilsammen}
                sidetall={1}
                setParameterIUrl={props.setParameterIUrl}
                erØversteSidebytter={props.erØversteSidebytter}
                elementIFokus = {props.elementIFokus}
            />
            ...
            <PagineringsKnapp
                siderTilsammen={props.siderTilsammen}
                sidetall={nåVærendeSidetall - 1}
                setParameterIUrl={props.setParameterIUrl}
                erØversteSidebytter={props.erØversteSidebytter}
                elementIFokus = {props.elementIFokus}
            />
            <PagineringsKnapp
                siderTilsammen={props.siderTilsammen}
                sidetall={nåVærendeSidetall}
                setParameterIUrl={props.setParameterIUrl}
                erØversteSidebytter={props.erØversteSidebytter}
                elementIFokus = {props.elementIFokus}
            />
            <PagineringsKnapp
                siderTilsammen={props.siderTilsammen}
                sidetall={nåVærendeSidetall + 1}
                setParameterIUrl={props.setParameterIUrl}
                erØversteSidebytter={props.erØversteSidebytter}
                elementIFokus = {props.elementIFokus}
            />
            {nåVærendeSidetall < props.siderTilsammen - 1 && (
                <>
                    ...
                    <PagineringsKnapp
                        siderTilsammen={props.siderTilsammen}
                        sidetall={props.siderTilsammen}
                        setParameterIUrl={props.setParameterIUrl}
                        erØversteSidebytter={props.erØversteSidebytter}
                        elementIFokus = {props.elementIFokus}
                    />
                </>
            )}
        </>
    );
};

export default Midtdel;

import React, { FunctionComponent } from 'react';
import PagineringsKnapp from './PagineringsKnapp/PagineringsKnapp';
import { useSearchParameters } from "../../../../utils/UrlManipulation";

interface Props {
    className?: string;
    siderTilsammen: number;
    elementIFokus: number;
    onSideendring: (key: string) => void
}

const Midtdel: FunctionComponent<Props> = props => {
    const {getSearchParameter} = useSearchParameters();
    const nåVærendeSidetall = parseInt(getSearchParameter('side') || '1')

    return (
        <>
            <PagineringsKnapp
                onSideendring={props.onSideendring}
                siderTilsammen={props.siderTilsammen}
                sidetall={1}
                elementIFokus = {props.elementIFokus}
            />
            ...
            <PagineringsKnapp
                onSideendring={props.onSideendring}
                siderTilsammen={props.siderTilsammen}
                sidetall={nåVærendeSidetall - 1}
                elementIFokus = {props.elementIFokus}
            />
            <PagineringsKnapp
                onSideendring={props.onSideendring}
                siderTilsammen={props.siderTilsammen}
                sidetall={nåVærendeSidetall}
                elementIFokus = {props.elementIFokus}
            />
            <PagineringsKnapp
                onSideendring={props.onSideendring}
                siderTilsammen={props.siderTilsammen}
                sidetall={nåVærendeSidetall + 1}
                elementIFokus = {props.elementIFokus}
            />
            {nåVærendeSidetall < props.siderTilsammen - 1 && (
                <>
                    ...
                    <PagineringsKnapp
                        onSideendring={props.onSideendring}
                        siderTilsammen={props.siderTilsammen}
                        sidetall={props.siderTilsammen}
                        elementIFokus = {props.elementIFokus}
                    />
                </>
            )}
        </>
    );
};

export default Midtdel;

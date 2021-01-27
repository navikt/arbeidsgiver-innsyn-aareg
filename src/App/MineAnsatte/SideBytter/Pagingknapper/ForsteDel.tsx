import React, { FunctionComponent } from 'react';
import PagineringsKnapp from './PagineringsKnapp/PagineringsKnapp';
import './PagineringsKnapp/PagineringsKnapp.less';

interface Props {
    className?: string;
    siderTilsammen: number;
    elementIFokus: number;
    onSideendring: (key: string) => void
}

const ForsteDel: FunctionComponent<Props> = props => {
    return (
        <>
            <PagineringsKnapp
                sidetall={1}
                siderTilsammen={props.siderTilsammen}
                elementIFokus = {props.elementIFokus}
                onSideendring={props.onSideendring}
            />

            <PagineringsKnapp
                sidetall={2}
                siderTilsammen={props.siderTilsammen}
                elementIFokus = {props.elementIFokus}
                onSideendring={props.onSideendring}
            />

            {props.siderTilsammen > 2 && (
                <PagineringsKnapp
                    sidetall={3}
                    siderTilsammen={props.siderTilsammen}
                    elementIFokus = {props.elementIFokus}
                    onSideendring={props.onSideendring}
                />
            )}

            {props.siderTilsammen > 3 && (
                <>
                    ...
                    <PagineringsKnapp
                        sidetall={props.siderTilsammen}
                        siderTilsammen={props.siderTilsammen}
                        elementIFokus = {props.elementIFokus}
                        onSideendring={props.onSideendring}
                    />
                </>
            )}
        </>
    );
};

export default ForsteDel;

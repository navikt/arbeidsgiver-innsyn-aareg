import React, { FunctionComponent } from 'react';
import './AttributtVisning.less';
import YrkesbeskrivelsePopover from "../../../TabellMineAnsatte/KolonnerMedTooltip/YrkesbeskrivelsePopover";

interface Props {
    className?: string;
    attributt: string;
    attributtVerdi: any;
}

const AttributtVisning: FunctionComponent<Props> = props => {
    return (
        <li className="attributt" tabIndex={0}>
            <div className={'attributt__navn'}> {props.attributt}</div>
            <div className={'attributt__verdi'}><YrkesbeskrivelsePopover   tekst={props.attributtVerdi}/></div>
        </li>
    );
};

export default AttributtVisning;

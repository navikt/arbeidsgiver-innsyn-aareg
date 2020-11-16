import React, { FunctionComponent } from 'react';
import './AttributtVisning.less';

interface Props {
    className?: string;
    attributt: string;
    attributtVerdi: any;
}

const AttributtVisning: FunctionComponent<Props> = props => {
    return (
        /* eslint-disable-next-line */
        <li className="attributt">
            <div className="attributt__navn"> {props.attributt}</div>
            <div className="attributt__verdi"> {props.attributtVerdi}</div>
        </li>
    );
};

export default AttributtVisning;

import Popover, {PopoverOrientering} from 'nav-frontend-popover';
import React, {FunctionComponent, useState} from 'react';
import {Normaltekst} from "nav-frontend-typografi";

type PopoverProps = {
    tekst: string
    className?: string;

}

const YrkesbeskrivelsePopover: FunctionComponent<PopoverProps> = (props:PopoverProps) => {
    const [anker, setAnker] = useState<HTMLElement | undefined>(undefined);
    const ref = React.createRef<HTMLDivElement>();
    if (ref.current) {
        console.log(ref.current.offsetHeight, "Har hoyden" );
    }

    return (

        <div ref = {ref}>
            <Normaltekst  className={props.className} onMouseEnter={(e: any) => setAnker(e.currentTarget)}
                 onMouseLeave={(e: any) => setAnker(undefined)}>{props.tekst}</Normaltekst>
            <Popover ankerEl={anker} orientering={PopoverOrientering.Over}>
                <p  style={{padding: '1rem'}} >{props.tekst} </p>
            </Popover>
        </div>

    );
};

export default YrkesbeskrivelsePopover

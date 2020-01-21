import Popover from 'nav-frontend-popover';
import React, {FunctionComponent, useState} from 'react';
import {Normaltekst} from "nav-frontend-typografi";

type PopoverProps = {
    tekst: string
    className?: string;

}

const YrkesbeskrivelsePopover: FunctionComponent<PopoverProps> = (props:PopoverProps) => {
    const [anker, setAnker] = useState<HTMLElement | undefined>(undefined);
    return (
        <div>
            <Normaltekst className={props.className} onMouseEnter={(e: any) => setAnker(e.currentTarget)}
                 onMouseLeave={(e: any) => setAnker(undefined)}>{props.tekst}</Normaltekst>
            <Popover ankerEl={anker}>
                <p style={{padding: '1rem'}}>{props.tekst}</p>
            </Popover>
        </div>
    );
};

export default YrkesbeskrivelsePopover

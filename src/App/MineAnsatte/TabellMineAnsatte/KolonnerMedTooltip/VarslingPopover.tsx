import Popover from 'nav-frontend-popover';
import React, {FunctionComponent, useState} from 'react';
import varselikon from "../varselikon.svg";

type PopoverProps = {
    tekst: string

}

const VarslingPopover: FunctionComponent<PopoverProps> = (props:PopoverProps) => {
    const [anker, setAnker] = useState<HTMLElement | undefined>(undefined);
    return (
        <div>
            <img src={varselikon} alt="Varsel om maskinell sluttdato" onMouseEnter={(e: any) => setAnker(e.currentTarget)}
                 onMouseLeave={(e: any) => setAnker(undefined)}/>
            <Popover ankerEl={anker}>
                <p style={{padding: '1rem'}}>{props.tekst}</p>
            </Popover>
        </div>
    );
};

export default VarslingPopover

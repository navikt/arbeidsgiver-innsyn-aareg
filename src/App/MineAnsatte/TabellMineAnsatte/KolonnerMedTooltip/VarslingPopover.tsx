import React, { FunctionComponent, useState } from 'react';
import Popover from 'nav-frontend-popover';
import varselikon from '../varselikon.svg';
import { Varsel } from '../../../Objekter/Varsel';

type PopoverProps = {
    varsler: Varsel[];
};

const VarslingPopover: FunctionComponent<PopoverProps> = (props: PopoverProps) => {
    const [anker, setAnker] = useState<HTMLElement | undefined>(undefined);
    return (
        <>
            <img
                src={varselikon}
                alt="Varsel om maskinell sluttdato"
                onMouseEnter={(e: any) => setAnker(e.currentTarget)}
                onMouseLeave={(e: any) => setAnker(undefined)}
            />
            <Popover ankerEl={anker}>
                <div style={{ padding: '1rem 1rem 0 1rem ' }}>
                    {props.varsler.map(varsel => (
                        <div key={varsel.varslingskode} style={{ padding: '0 0 1rem 0' }}>{varsel.varslingskodeForklaring}</div>
                    ))}
                </div>
            </Popover>
        </>
    );
};

export default VarslingPopover;

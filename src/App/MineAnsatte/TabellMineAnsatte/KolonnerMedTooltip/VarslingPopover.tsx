import React, { useState } from 'react';
import Popover from 'nav-frontend-popover';
import varselikon from '../varselikon.svg';
import { Varsel } from '../../../Objekter/Varsel';

type PopoverProps = {
    varsler: Varsel[];
};

const VarslingPopover = (props: PopoverProps) => {
    const [anker, setAnker] = useState<HTMLElement | undefined>(undefined);

    let varselTekst = 'Varsler, ';
    props.varsler.forEach( varsel => varselTekst += (` ${varsel.varslingskodeForklaring},`));

    return (
        <div aria-label={varselTekst}>
            <img
                src={varselikon}
                alt=""
                onMouseEnter={(e: any) => setAnker(e.currentTarget)}
                onMouseLeave={(e: any) => setAnker(undefined)}
            />
            <Popover ankerEl={anker}>
                <div style={{ padding: '1rem 1rem 0 1rem ' }} className={'varsel-popover'}>
                    {props.varsler.map(varsel => (
                        <div key={varsel.varslingskode} style={{ padding: '0 0 1rem 0' }}>
                            {varsel.varslingskodeForklaring}
                        </div>
                    ))}
                </div>
            </Popover>
        </div>
    );
};

export default VarslingPopover;

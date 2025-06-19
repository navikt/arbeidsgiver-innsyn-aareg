import React, { useState } from 'react';
import varselikon from '../varselikon.svg';
import { Varsel } from '../../../Objekter/Varsel';
import { Popover } from '@navikt/ds-react';

type PopoverProps = {
    varsler: Varsel[];
};

const VarslingPopover = (props: PopoverProps) => {
    const [anker, setAnker] = useState<HTMLElement | null>(null);

    let varselTekst = 'Varsler, ';
    props.varsler.forEach((varsel) => (varselTekst += ` ${varsel.varslingskodeForklaring},`));

    return (
        <div aria-label={varselTekst}>
            <img
                src={varselikon}
                alt=""
                onMouseEnter={(e) => setAnker(e.currentTarget)}
                onMouseLeave={(e) => setAnker(null)}
            />
            <Popover open={anker !== null} anchorEl={anker} onClose={() => null}>
                <div style={{ padding: '1rem 1rem 0 1rem ' }} className={'varsel-popover'}>
                    {props.varsler.map((varsel, i) => (
                        <div key={i} style={{ padding: '0 0 1rem 0' }}>
                            {varsel.varslingskodeForklaring}
                        </div>
                    ))}
                </div>
            </Popover>
        </div>
    );
};

export default VarslingPopover;

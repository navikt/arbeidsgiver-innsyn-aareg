import React, { useEffect, useState } from 'react';
import './PopOverStyling.css';
import { BodyShort, Popover } from '@navikt/ds-react';

type PopoverProps = {
    tekst: string;
};

const YrkesbeskrivelsePopover = (props: PopoverProps) => {
    const [anker, setAnker] = useState<HTMLElement | null>(null);
    const [skalVisePopover, setSkalVisePopover] = useState(true);
    const maxBreddeAvKolonne = 90;

    useEffect(() => {
        if (anker) {
            if (anker.offsetWidth < maxBreddeAvKolonne) {
                setSkalVisePopover(false);
            }
        }
    }, [anker]);

    const yrkesnavnLowerCase =
        props.tekst[0] + props.tekst.substr(1, props.tekst.length).toLocaleLowerCase();

    return (
        <div className="pop-over-container">
            <BodyShort
                className="pop-over__yrke"
                onMouseEnter={(e: any) => {
                    setAnker(e.currentTarget);
                }}
                onMouseLeave={(e) => setAnker(null)}
            >
                {yrkesnavnLowerCase}
            </BodyShort>
            <Popover open={skalVisePopover} anchorEl={anker} placement="top" onClose={() => null}>
                <p style={{ padding: '1rem' }}>{props.tekst} </p>
            </Popover>
        </div>
    );
};

export default YrkesbeskrivelsePopover;

import React, { useEffect, useState } from 'react';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import { Normaltekst } from 'nav-frontend-typografi';
import './PopOverStyling.less';

type PopoverProps = {
    tekst: string;
};

const YrkesbeskrivelsePopover = (props: PopoverProps) => {
    const [anker, setAnker] = useState<HTMLElement | undefined>(undefined);
    const [skalVisePopover, setSkalVisePopover] = useState(true);
    const maxBreddeAvKolonne = 160;

    useEffect(() => {
        if (anker) {
            if (anker.offsetWidth < maxBreddeAvKolonne) {
                setSkalVisePopover(false);
            }
        }
    }, [anker]);

    return (
        <div className="pop-over-container">
            <Normaltekst
                className="pop-over"
                onMouseEnter={(e: any) => {
                    setAnker(e.currentTarget);
                }}
                onMouseLeave={(e: any) => setAnker(undefined)}
            >
                {props.tekst}
            </Normaltekst>
            {skalVisePopover && (
                <Popover ankerEl={anker} orientering={PopoverOrientering.Over}>
                    <p style={{ padding: '1rem' }}>{props.tekst} </p>
                </Popover>
            )}
        </div>
    );
};

export default YrkesbeskrivelsePopover;

import Popover, {PopoverOrientering} from 'nav-frontend-popover';
import React, {FunctionComponent, useEffect, useState} from 'react';
import {Normaltekst} from "nav-frontend-typografi";

type PopoverProps = {
    tekst: string
    className?: string;

}

const YrkesbeskrivelsePopover: FunctionComponent<PopoverProps> = (props:PopoverProps) => {
    const [anker, setAnker] = useState<HTMLElement | undefined>(undefined);
    const [skalVisePopover, setSkalVisePopover] = useState(false);
    const maxBreddeAvKolonne = 160;

    useEffect(() => {
        if (anker){
            console.log(anker.offsetWidth, "Har hoyden", "sjekket høyde" );
            if (anker.offsetWidth>=maxBreddeAvKolonne) {
                setSkalVisePopover(true);}
        }
        }, [anker]);

    return (

        <div>
            <Normaltekst  className={props.className} onMouseEnter={(e: any) => {setAnker(e.currentTarget);
            console.log(e.currentTarget, "anker")}}
                 onMouseLeave={(e: any) => setAnker(undefined)}>{props.tekst}</Normaltekst>
            {skalVisePopover&&<Popover ankerEl={anker} orientering={PopoverOrientering.Over}>
                <p  style={{padding: '1rem'}} >{props.tekst} </p>
            </Popover>}
        </div>

    );
};

export default YrkesbeskrivelsePopover

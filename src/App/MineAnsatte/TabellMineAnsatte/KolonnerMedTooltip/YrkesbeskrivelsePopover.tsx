import Popover, {PopoverOrientering} from 'nav-frontend-popover';
import React, {FunctionComponent, useEffect, useState} from 'react';
import {Normaltekst} from "nav-frontend-typografi";

type PopoverProps = {
    tekst: string
    className?: string;

}

const YrkesbeskrivelsePopover: FunctionComponent<PopoverProps> = (props:PopoverProps) => {
    const [anker, setAnker] = useState<HTMLElement | undefined>(undefined);
    const [skalVisePopover, setSkalVisePopover] = useState(true);
    const maxBreddeAvKolonne = 160;

    useEffect(() => {
        console.log("useEffect kallt");
        if (anker){
            console.log(anker.offsetWidth, "Har hoyden", "sjekket høyde", "referanse definert" );
            if (anker.offsetWidth<maxBreddeAvKolonne) {
                setSkalVisePopover(false);}
        }
        }, [anker]);

    return (

        <div className={"yrkesbeskrivelse-container"}>
            <Normaltekst  className={props.className} onMouseEnter={(e: any) => {setAnker(e.currentTarget);
            }}
                 onMouseLeave={(e: any) => setAnker(undefined)}>{props.tekst}</Normaltekst>
            {skalVisePopover&&<Popover ankerEl={anker} orientering={PopoverOrientering.Over}>
                <p  style={{padding: '1rem'}} >{props.tekst} </p>
            </Popover>}
        </div>

    );
};

export default YrkesbeskrivelsePopover

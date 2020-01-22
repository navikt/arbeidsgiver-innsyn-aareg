import Popover, {PopoverOrientering} from 'nav-frontend-popover';
import React, {FunctionComponent, useState} from 'react';
import {Normaltekst} from "nav-frontend-typografi";

type PopoverProps = {
    tekst: string
    className?: string;

}

const YrkesbeskrivelsePopover: FunctionComponent<PopoverProps> = (props:PopoverProps) => {
    const [anker, setAnker] = useState<HTMLElement | undefined>(undefined);
    console.log(anker);


        const ref = React.createRef<HTMLDivElement>();
        if (anker){
            console.log(anker.offsetWidth, "Har hoyden", "sjekket høyde" );
        }
        console.log(ref, ref.current);


    return (

        <div>
            <Normaltekst  className={props.className} onMouseEnter={(e: any) => {setAnker(e.currentTarget);
            console.log(e.currentTarget, "anker")}}
                 onMouseLeave={(e: any) => setAnker(undefined)}>{props.tekst}</Normaltekst>
            <Popover ankerEl={anker} orientering={PopoverOrientering.Over}>
                <p  style={{padding: '1rem'}} >{props.tekst} </p>
            </Popover>
        </div>

    );
};

export default YrkesbeskrivelsePopover

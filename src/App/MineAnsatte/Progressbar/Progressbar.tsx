import React, {useEffect, useState} from 'react';
import './Progressbar.less';


interface Props {
    beregnetTid: number;
    onProgress: (nyTid: number) => void;
}

const Progressbar = ({ beregnetTid}: Props) => {
    const [bredde, setBredde] = useState(0);


    useEffect(() => {
        const element = document.getElementById("progressbar__fyll");
        if (bredde !== 100) {
            if(element) {
                element.style.width =  bredde.toString() + "%";
                setTimeout(  () =>{setBredde(bredde+2)}, 300);
            }
        }


    }, [ bredde]);

    return (
        <div className="progressbar">
            <div className={"progressbar__fyll"} id={"progressbar__fyll"}/>
        </div>
    );
}


export default Progressbar;

import React, {useEffect, useState} from 'react';
import './Progressbar.less';
import {Ingress} from "nav-frontend-typografi";

interface Props {
    beregnetTid: number;
    onProgress: (nyTid: number) => void;
    startTid: number;
    erFerdigLastet: boolean;
}

const Progressbar = ({ beregnetTid, startTid, erFerdigLastet }: Props) => {
    const [tid, setTid] = useState(0);
    const [visProgress, setVisProgress] = useState(true);
    const [bredde, setBredde] = useState(0);

    const element = document.getElementById("progressbar__fyll");

    useEffect(() => {
        console.log("useEffect 1 kalles");
        if (bredde > 98) {
            setTimeout(() => {setVisProgress(false); console.log("timeout ")},500);
        }
    }, [ bredde]);

    useEffect(() => {
        console.log("useEffect 3");
        if (!erFerdigLastet && tid/beregnetTid < 0.999) {
            setTimeout( () => {
                const element = document.getElementById("progressbar__fyll");
                if (element) {
                    const naVarendeTid = new Date().getTime();
                    const beregnetBredde = (tid/beregnetTid)*100
                    element.style.width =  beregnetBredde.toString() + "%"
                    setBredde(beregnetBredde);
                    const tidGatt = naVarendeTid - startTid;
                    setTid(tidGatt);
                    };
                }, beregnetTid/500);
            }
        if (erFerdigLastet && element && bredde <100) {
            setTimeout( () => {
                element.style.width =  (bredde+1).toString() + "%";
                setBredde(bredde+1);
            }, 100);
        }


        }, [ beregnetTid, tid, startTid, erFerdigLastet, element, visProgress, bredde]);

    let tekst = "";
    if (erFerdigLastet) {
        tekst = "98%"
    }
    else {
       tekst = (Math.floor((tid/beregnetTid)* 100)).toString() + "%"
    }


    return (
       <> { visProgress && <div className={'progressbar__container'}>
            <Ingress className={'progressbar__henter-antall'}>Henter 5000 arbeidsforhold</Ingress>
            <div className={"progressbar__prosent"}>{tekst}</div>
        <div className="progressbar">
            <div className={"progressbar__fyll"} id={"progressbar__fyll"} />
        </div>
            </div>}
           </>
    );
};

export default Progressbar;

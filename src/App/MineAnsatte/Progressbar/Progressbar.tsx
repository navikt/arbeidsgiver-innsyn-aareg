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

        if (bredde >= 98 && visProgress) {
            setVisProgress(false);
        }
        else {
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
            if (erFerdigLastet && element && bredde+3<100) {
                setTimeout( () => {
                    element.style.width =  (bredde+3).toString() + "%";
                    setBredde(bredde+3);
                }, 10);
            }
        }

        const tekst = Math.floor(bredde).toString() + "%"

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
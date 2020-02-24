import React, {useEffect, useState} from 'react';
import './Progressbar.less';

interface Props {
    beregnetTid: number;
    onProgress: (nyTid: number) => void;
    startTid: number;
}

const Progressbar = ({ beregnetTid, startTid }: Props) => {
    const [tid, setTid] = useState(0);

    useEffect(() => {
        if (tid < beregnetTid) {
            setTimeout( () => {
                const element = document.getElementById("progressbar__fyll");
                if (element) {
                    const naVarendeTid = new Date().getTime();
                    element.style.width =  ((tid/beregnetTid)*100).toString() + "%";
                    const tidGatt = naVarendeTid - startTid;
                    setTid(tidGatt);
                };
            }, beregnetTid/500);
        }
        }, [ beregnetTid, tid,startTid]);

    const tekst = (Math.floor((tid/beregnetTid)* 100)).toString() + "%";

    return (
        <> {tekst}
        <div className="progressbar">
            <div className={"progressbar__fyll"} id={"progressbar__fyll"} />
        </div>
            </>
    );
};

export default Progressbar;

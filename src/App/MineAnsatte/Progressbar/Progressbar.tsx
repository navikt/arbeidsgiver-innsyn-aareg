import React, {useEffect, useState} from 'react';
import './Progressbar.less';


interface Props {
    beregnetTid: number;
    onProgress: (nyTid: number) => void;
}

const Progressbar = ({ beregnetTid }: Props) => {
    const [tidGatt, setTidGatt] = useState(0);
    const [initialTid, setInitial] = useState(new Date().getTime());

    useEffect(() => {
        console.log(tidGatt);
        const element = document.getElementById("progressbar__fyll");
        if (tidGatt < beregnetTid) {
            if(element) {
                element.style.width =  ((tidGatt/beregnetTid)*100).toString() + "%";
                setInitial(new Date().getTime());
                console.log(tidGatt + ( new Date().getTime() - initialTid));
                    setTidGatt(tidGatt + (new Date().getTime() - initialTid));
                console.log(tidGatt);
            }
        }
        }, [ beregnetTid,tidGatt, initialTid]);

    return (
        <div className="progressbar">
            <div className={"progressbar__fyll"} id={"progressbar__fyll"} />
        </div>
    );
};

export default Progressbar;

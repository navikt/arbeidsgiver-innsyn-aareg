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
        const element = document.getElementById("progressbar__fyll");
        if (tidGatt < beregnetTid) {
            if (element) {
                setInitial(new Date().getTime());
                setTimeout( () => {
                    setTidGatt(tidGatt + (new Date().getTime() - initialTid));}, beregnetTid/100);
                console.log(tidGatt);
                element.style.width =  ((tidGatt/beregnetTid)*100).toString() + "%";
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

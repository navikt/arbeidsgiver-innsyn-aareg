import React, {useEffect, useState} from 'react';
import './Progressbar.less';


interface Props {
    beregnetTid: number;
    onProgress: (nyTid: number) => void;
}

const Progressbar = ({ beregnetTid }: Props) => {

    const [tidGjenstar, setTidGjenstar] = useState(beregnetTid);

    console.log(beregnetTid);
    console.log(tidGjenstar);

    useEffect(() => {
        const element = document.getElementById("progressbar__fyll");
        if (tidGjenstar>0) {
            if(element) {
                setTimeout(  () =>{element.style.width =  (((beregnetTid - tidGjenstar)/beregnetTid)*100).toString() + "%";
                    }, 300);
                setTidGjenstar(tidGjenstar - (beregnetTid/100));
            }

        }
        }, [ beregnetTid,tidGjenstar]);

    return (
        <div className="progressbar">
            <div className={"progressbar__fyll"} id={"progressbar__fyll"} />
        </div>
    );
}


export default Progressbar;

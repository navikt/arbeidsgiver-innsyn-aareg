import React, { useEffect, useState } from 'react';
import { Ingress } from 'nav-frontend-typografi';
import './Progressbar.less';

interface Props {
    estimertAntall?: number;
}

const beregnTid = (estimertAntall: number | undefined) => {
    if (estimertAntall === undefined) {
        return 10000;
    } else if (0 < estimertAntall && estimertAntall < 700) {
        return 2000 + estimertAntall * 4;
    } else if (700 <= estimertAntall) {
        return 5000 + estimertAntall * 4;
    } else {
        return 0;
    }
};

/* Returns percentage. */
const useProgressAsPercentage = (estimatedDuration: number): number => {
    const [initialTime, setInitialTime] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);

    useEffect(() => {
        const time = new Date().getTime();
        setInitialTime(time);
        setCurrentTime(time);

        const interval = setInterval(() => {
            setCurrentTime(new Date().getTime());
        }, 200);

        return () => clearInterval(interval);
    }, []);

    const elapsedDuration = currentTime - initialTime;
    const ratio = elapsedDuration / estimatedDuration;

    return (1 - Math.exp(-2 * ratio)) * 100;
};

const Progressbar = ({ estimertAntall }: Props) => {
    const percent = useProgressAsPercentage(beregnTid(estimertAntall));
    const tekst = Math.floor(percent).toString() + '%';
    const overtekst = estimertAntall ?? '';

    return (
        <div className={'progressbar__container'}>
            <Ingress aria-live="assertive" className={'progressbar__henter-antall'}>
                {'Henter ' + overtekst + ' arbeidsforhold'}
            </Ingress>
            <div className={'progressbar__prosent'}>{tekst}</div>
            <div className="progressbar">
                <div style={{ width: `${percent}%` }} className={'progressbar__fyll'} id={'progressbar__fyll'} />
            </div>
        </div>
    );
};

export default Progressbar;

import React, {useState} from 'react';
import { HoyreChevron, VenstreChevron } from 'nav-frontend-chevron';
import TreForste from './Pagingknapper/ForsteDel';
import TreSiste from './Pagingknapper/SisteDel';
import Midtdel from './Pagingknapper/Midtdel';
import './SideBytter.less';
import {getVariabelFraUrl} from "../sorteringOgFiltreringsFunksjoner";

interface Props {
    className: string;
    antallSider: number;
    setParameterIUrl: (parameter: string, variabel: string) => void;
    plassering: string;
}

const SideBytter = ({ className, antallSider, setParameterIUrl, plassering }: Props) => {
    const chevronOverst = document.getElementById('sidebytter-chevron-hoyre-overst');
    const chevronNederst = document.getElementById('sidebytter-chevron-hoyre-nederst');

    const [elementIFokus, setElementIFokus] = useState(0);

    const onSideendring = (key: string) => {
        const nåværendeSidetall = getVariabelFraUrl('side') || '1'
        if (key === 'ArrowRight' || key === 'Right') {
            if (nåværendeSidetall === (antallSider).toString()) {
            }
            else {
                setParameterIUrl('side', (parseInt(nåværendeSidetall) +1).toString())
                setElementIFokus(parseInt(nåværendeSidetall) +1);
            }
        }
        if (key === 'ArrowLeft' || key === 'Left') {
            if (nåværendeSidetall === '1') {
                setParameterIUrl('side','1')
                setElementIFokus(1);
            }
            else {
                setParameterIUrl('side', (parseInt(nåværendeSidetall) -1).toString())
                setElementIFokus(parseInt(nåværendeSidetall) -1);
            }
        }
    }

    const nåVærendeSidetallParameter = getVariabelFraUrl('side') || '1'
    const nåVærendeSidetall = parseInt(nåVærendeSidetallParameter);



    if (chevronOverst && chevronNederst) {
        if (nåVærendeSidetall !== antallSider) {
            chevronOverst.style.visibility = 'initial';
            chevronNederst.style.visibility = 'initial';
        }
        else {
            chevronOverst.style.visibility = 'hidden';
            chevronNederst.style.visibility = 'hidden';
        }
    }

    return (
        <nav role={"toolbar"} aria-label={`Sidebytter, Nåværende side er ${nåVærendeSidetall}, bruk piltastene til å navigere`}
             className={className}

            >
            <div className="sidebytter">
                {nåVærendeSidetall !==1 && <button
                    onKeyDown={(e) => onSideendring(e.key)}
                    className="sidebytter__chevron"
                    id={'sidebytter-chevron-venstre-' + plassering}
                    onClick={() => {
                        setParameterIUrl('side',(nåVærendeSidetall - 1).toString());
                    }}
                    aria-label={'Gå til forrige side'}
                >
                    <VenstreChevron type={'venstre'} />
                </button>}

                {(nåVærendeSidetall < 3 || antallSider < 4) && (
                    <TreForste onSideendring={onSideendring} elementIFokus = {elementIFokus} setParameterIUrl={setParameterIUrl} siderTilsammen={antallSider}  />
                )}
                {antallSider > 3 && nåVærendeSidetall > 2 && nåVærendeSidetall < antallSider - 1 && (
                    <Midtdel onSideendring={onSideendring} elementIFokus = {elementIFokus} setParameterIUrl={setParameterIUrl} siderTilsammen={antallSider} />
                )}
                {antallSider > 3 && nåVærendeSidetall >= antallSider - 1 && (
                    <TreSiste onSideendring={onSideendring}elementIFokus = {elementIFokus} setParameterIUrl={setParameterIUrl} siderTilsammen={antallSider} />
                )}
                <button
                    onKeyDown={(e) => onSideendring(e.key)}
                    className={"sidebytter__chevron"}
                    onClick={() => setParameterIUrl('side',(nåVærendeSidetall+1).toString())}
                    aria-label={'Gå til neste side'}
                    id={'sidebytter-chevron-hoyre-' + plassering}
                >
                    <HoyreChevron />
                </button>
            </div>
        </nav>
    );
};

export default SideBytter;
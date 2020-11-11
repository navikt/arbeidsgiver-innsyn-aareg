import React, {useEffect, useRef, useState} from 'react';
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
    const erØversteSidebytter = className === 'ovre-sidebytter'

    const node = useRef<HTMLElement>(null)

    const handleOutsidePress: { (event: KeyboardEvent): void } = (e: KeyboardEvent) => {
        const sidebytternode = node.current;
        if (sidebytternode?.contains(document.activeElement)){
            onKeyPress(e.key)
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleOutsidePress, false);
    }, []);

    const onKeyPress = (key: string) => {
        const chevronknappHoyre = document.getElementById('sidebytter-chevron-hoyre-overst')
        const chevronknappVenstre = document.getElementById('sidebytter-chevron-venstre-overst')
        const nåværendeSidetall = getVariabelFraUrl('side') || 1
        if (key === 'ArrowRight' || key === 'Right') {
            if (nåværendeSidetall === (antallSider).toString()) {
                chevronknappVenstre?.focus()
                chevronknappVenstre?.click()
                setParameterIUrl('side',nåværendeSidetall.toString())
            }
            else {
                chevronknappHoyre?.click();
                chevronknappHoyre?.focus();
            }
        }
        if (key === 'ArrowLeft' || key === 'Left') {
            if (nåværendeSidetall === '1') {
                setParameterIUrl('side','1')
                chevronknappHoyre?.focus();
                chevronknappVenstre?.click()
            }
            else {
                chevronknappVenstre?.click();
                chevronknappVenstre?.focus()
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
        <nav role="navigation" aria-label="Sidebytter"
             className={className} ref={node} onFocus={()=> {
             const side = getVariabelFraUrl('side');
             const nåværendeKnapp = document.getElementById('pagineringsknapp-'+side);
             nåværendeKnapp?.focus();
        }}
            >
            <div className="sidebytter">
                {nåVærendeSidetall !==1 && <button
                    className="sidebytter__chevron"
                    id={'sidebytter-chevron-venstre-' + plassering}
                    onClick={() => {
                        setParameterIUrl('side',(nåVærendeSidetall - 1).toString());
                    }}
                    aria-label={'Gå til side ' + (nåVærendeSidetall - 1).toString()}
                >
                    <VenstreChevron type={'venstre'} />
                </button>}

                {(nåVærendeSidetall < 3 || antallSider < 4) && (
                    <TreForste erØversteSidebytter={erØversteSidebytter} setParameterIUrl={setParameterIUrl} siderTilsammen={antallSider}  />
                )}
                {antallSider > 3 && nåVærendeSidetall > 2 && nåVærendeSidetall < antallSider - 1 && (
                    <Midtdel erØversteSidebytter={erØversteSidebytter} setParameterIUrl={setParameterIUrl} siderTilsammen={antallSider} />
                )}
                {antallSider > 3 && nåVærendeSidetall >= antallSider - 1 && (
                    <TreSiste erØversteSidebytter={erØversteSidebytter}  setParameterIUrl={setParameterIUrl} siderTilsammen={antallSider} />
                )}
                <button
                    className={"sidebytter__chevron"}
                    onClick={() => setParameterIUrl('side',(nåVærendeSidetall+1).toString())}
                    aria-label={'Gå til side ' + (nåVærendeSidetall + 1).toString()}
                    id={'sidebytter-chevron-hoyre-' + plassering}
                >
                    <HoyreChevron />
                </button>
            </div>
        </nav>
    );
};

export default SideBytter;
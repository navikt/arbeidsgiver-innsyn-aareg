import React, {useEffect, useRef, useState} from 'react';
import { HoyreChevron, VenstreChevron } from 'nav-frontend-chevron';
import TreForste from './Pagingknapper/ForsteDel';
import TreSiste from './Pagingknapper/SisteDel';
import Midtdel from './Pagingknapper/Midtdel';
import './SideBytter.less';
import {loggTrykketPåTidligereArbeidsforholdSide} from "../../amplitudefunksjonerForLogging";

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

    const nåVærendeUrl = new URL (window.location.href)
    const nåVærendeSidetallString = nåVærendeUrl.searchParams.get('side')  ? nåVærendeUrl.searchParams.get('side') : '1';
    const nåVærendeSidetall = parseInt(nåVærendeSidetallString!!);
    const [sidetall, setSidetall] = useState(nåVærendeSidetall);

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
        console.log('onkeypress kallt');
        const chevronknappHoyre = document.getElementById('sidebytter-chevron-hoyre-overst')
        const chevronknappVenstre = document.getElementById('sidebytter-chevron-venstre-overst')
        if (key === 'ArrowRight' || key === 'Right') {
            if (sidetall === antallSider) {
                chevronknappVenstre?.focus()
            }
            else {
                chevronknappHoyre?.click();
                setSidetall(sidetall+1)
            }
        }
        if (key === 'ArrowLeft' || key === 'Left') {
            if (sidetall === 1) {
                chevronknappHoyre?.focus();
            }
            else {
                chevronknappVenstre?.click();
                setSidetall(sidetall-1)
            }
        }
    }

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
        <nav role="navigation" aria-label="Sidebytter" className={className} ref={node}>
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
                    <TreForste erØversteSidebytter={erØversteSidebytter} setParameterIUrl={setParameterIUrl} siderTilsammen={antallSider} nåVærendeSidetall={nåVærendeSidetall} />
                )}
                {antallSider > 3 && nåVærendeSidetall > 2 && nåVærendeSidetall < antallSider - 1 && (
                    <Midtdel erØversteSidebytter={erØversteSidebytter} nåVærendeSidetall={nåVærendeSidetall} setParameterIUrl={setParameterIUrl} siderTilsammen={antallSider} />
                )}
                {antallSider > 3 && nåVærendeSidetall >= antallSider - 1 && (
                    <TreSiste erØversteSidebytter={erØversteSidebytter} nåVærendeSidetall={nåVærendeSidetall} setParameterIUrl={setParameterIUrl} siderTilsammen={antallSider} />
                )}
                <button
                    className={"sidebytter__chevron"}
                    onClick={() => setParameterIUrl('side',(nåVærendeSidetall + 1).toString())}
                    aria-label={'Gå til side ' + (nåVærendeSidetall - 1).toString()}
                    id={'sidebytter-chevron-hoyre-' + plassering}
                >
                    <HoyreChevron />
                </button>
            </div>
        </nav>
    );
};

export default SideBytter;

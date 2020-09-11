import React from 'react';
import { HoyreChevron, VenstreChevron } from 'nav-frontend-chevron';
import TreForste from './Pagingknapper/ForsteDel';
import TreSiste from './Pagingknapper/SisteDel';
import Midtdel from './Pagingknapper/Midtdel';
import './SideBytter.less';

interface Props {
    className: string;
    antallSider: number;
    setParameterIUrl: (parameter: string, variabel: string) => void;
    plassering: string;
}

const SideBytter = ({ className, antallSider, setParameterIUrl, plassering }: Props) => {
    const chevronOverst = document.getElementById('sidebytter-chevron-hoyre-overst');
    const chevronNederst = document.getElementById('sidebytter-chevron-hoyre-nederst');

    const nåVærendeUrl = new URL (window.location.href)
    const nåVærendeSidetallString = nåVærendeUrl.searchParams.get('side')  ? nåVærendeUrl.searchParams.get('side') : '1';
    const nåVærendeSidetall = parseInt(nåVærendeSidetallString!!);
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
        <nav role="navigation" aria-label="Pagination Navigation" className={className}>
            <div className="sidebytter">
                {nåVærendeSidetall !==1 && <button
                    className="sidebytter__chevron"
                    id={'sidebytter-chevron-venstre-' + plassering}
                    onClick={() => {
                        setParameterIUrl('side',(nåVærendeSidetall - 1).toString());
                    }}
                    aria-label={'Goto Page ' + (nåVærendeSidetall - 1).toString()}
                >
                    <VenstreChevron type={'venstre'} />
                </button>}

                {(nåVærendeSidetall < 3 || antallSider < 4) && (
                    <TreForste setParameterIUrl={setParameterIUrl} siderTilsammen={antallSider} nåVærendeSidetall={nåVærendeSidetall} />
                )}
                {antallSider > 3 && nåVærendeSidetall > 2 && nåVærendeSidetall < antallSider - 1 && (
                    <Midtdel nåVærendeSidetall={nåVærendeSidetall} setParameterIUrl={setParameterIUrl} siderTilsammen={antallSider} />
                )}
                {antallSider > 3 && nåVærendeSidetall >= antallSider - 1 && (
                    <TreSiste nåVærendeSidetall={nåVærendeSidetall} setParameterIUrl={setParameterIUrl} siderTilsammen={antallSider} />
                )}
                <button
                    className={"sidebytter__chevron"}
                    onClick={() => setParameterIUrl('side',(nåVærendeSidetall + 1).toString())}
                    aria-label={'Goto Page ' + (nåVærendeSidetall - 1).toString()}
                    id={'sidebytter-chevron-hoyre-' + plassering}
                >
                    <HoyreChevron />
                </button>
            </div>
        </nav>
    );
};

export default SideBytter;

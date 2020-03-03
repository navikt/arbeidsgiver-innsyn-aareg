import React from 'react';
import { HoyreChevron, VenstreChevron } from 'nav-frontend-chevron';
import TreForste from './Pagingknapper/ForsteDel';
import TreSiste from './Pagingknapper/SisteDel';
import Midtdel from './Pagingknapper/Midtdel';
import './SideBytter.less';

interface Props {
    className: string;
    antallSider: number;
    byttSide: (indeks: number) => void;
    naVarendeSidetall: number;
    plassering: string;
}

const SideBytter = ({ className, antallSider, byttSide, naVarendeSidetall, plassering }: Props) => {
    const chevronOverst = document.getElementById('sidebytter-chevron-hoyre-overst');
    const chevronNederst = document.getElementById('sidebytter-chevron-hoyre-nederst');
    if (chevronOverst && chevronNederst) {
        if (naVarendeSidetall !== antallSider) {
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
                {naVarendeSidetall !==1 && <button
                    className="sidebytter__chevron"
                    id={'sidebytter-chevron-venstre-' + plassering}
                    onClick={() => {
                        byttSide(naVarendeSidetall - 1);
                    }}
                    aria-label={'Goto Page ' + (naVarendeSidetall - 1).toString()}
                >
                    <VenstreChevron type={'venstre'} />
                </button>}

                {(naVarendeSidetall < 3 || antallSider < 4) && (
                    <TreForste byttSide={byttSide} siderTilsammen={antallSider} naVarendeIndeks={naVarendeSidetall} />
                )}
                {antallSider > 3 && naVarendeSidetall > 2 && naVarendeSidetall < antallSider - 1 && (
                    <Midtdel naVarendeIndeks={naVarendeSidetall} byttSide={byttSide} siderTilsammen={antallSider} />
                )}
                {antallSider > 3 && naVarendeSidetall >= antallSider - 1 && (
                    <TreSiste naVarendeIndeks={naVarendeSidetall} byttSide={byttSide} siderTilsammen={antallSider} />
                )}
                <button
                    className={"sidebytter__chevron"}
                    onClick={() => byttSide(naVarendeSidetall + 1)}
                    aria-label={'Goto Page ' + (naVarendeSidetall - 1).toString()}
                    id={'sidebytter-chevron-hoyre-' + plassering}
                >
                    <HoyreChevron />
                </button>
            </div>
        </nav>
    );
};

export default SideBytter;

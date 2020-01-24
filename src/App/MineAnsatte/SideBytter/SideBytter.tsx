import React, { FunctionComponent } from 'react';
import { HoyreChevron, VenstreChevron } from 'nav-frontend-chevron';
import './SideBytter.less';

import TreForste from './Pagingknapper/ForsteDel';
import TreSiste from './Pagingknapper/SisteDel';
import Midtdel from './Pagingknapper/Midtdel';

interface Props {
    className?: string;
    antallSider: number;
    byttSide: (indeks: number) => void;
    naVarendeSidetall: number;
    plassering: string;
}

const SideBytter: FunctionComponent<Props> = props => {
    const { byttSide } = props;

    return (
        <nav role="navigation" aria-label="Pagination Navigation" className={props.className}>
            <div className="sidebytter">
                <button
                    className="sidebytter__chevron"
                    id={"sidebytter-chevron-venstre-"+props.plassering}
                    onClick={() => {
                        props.byttSide(props.naVarendeSidetall - 1);
                    }}
                    aria-label={'Goto Page ' + (props.naVarendeSidetall - 1).toString()}
                >
                    <VenstreChevron type={'venstre'} />
                </button>

                {(props.naVarendeSidetall < 3 || props.antallSider < 4) && (
                    <TreForste
                        byttSide={byttSide}
                        siderTilsammen={props.antallSider}
                        naVarendeIndeks={props.naVarendeSidetall}
                    />
                )}
                {props.antallSider > 3 &&
                    props.naVarendeSidetall > 2 &&
                    props.naVarendeSidetall < props.antallSider - 1 && (
                        <Midtdel
                            naVarendeIndeks={props.naVarendeSidetall}
                            byttSide={byttSide}
                            siderTilsammen={props.antallSider}
                        />
                    )}
                {props.antallSider > 3 && props.naVarendeSidetall >= props.antallSider - 1 && (
                    <TreSiste
                        naVarendeIndeks={props.naVarendeSidetall}
                        byttSide={byttSide}
                        siderTilsammen={props.antallSider}
                    />
                )}

                <button
                    className={'sidebytter__chevron'}
                    onClick={() => props.byttSide(props.naVarendeSidetall + 1)}
                    aria-label={'Goto Page ' + (props.naVarendeSidetall - 1).toString()}
                    id={"sidebytter-chevron-hoyre-"+props.plassering}
                >
                    <HoyreChevron />
                </button>
            </div>
        </nav>
    );
};

export default SideBytter;

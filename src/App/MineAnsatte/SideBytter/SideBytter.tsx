import React, { useContext } from 'react';
import { useSearchParameters } from '../../../utils/UrlManipulation';
import { FiltrerteOgSorterteArbeidsforholdContext } from '../../Context/FiltrerteOgSorterteArbeidsforholdProvider';
import { Pagination } from '@navikt/ds-react';

const SideBytter = () => {
    const { antallSider } = useContext(FiltrerteOgSorterteArbeidsforholdContext);

    if (antallSider <= 1) return null;
    const { getSearchParameter, setSearchParameter } = useSearchParameters();

    const nåVærendeSidetallParameter = getSearchParameter('side') ?? '1';
    const nåVærendeSidetall = parseInt(nåVærendeSidetallParameter);

    return (
        <nav role="navigation" style={{ marginLeft: "auto" }}>
            <Pagination
                page={nåVærendeSidetall}
                onPageChange={(page) => setSearchParameter({ side: page.toString() })}
                count={antallSider}
                size="small"
            />
        </nav>
    );
};

export default SideBytter;

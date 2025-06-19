import React, { FunctionComponent } from 'react';
import Forstorrelsesglass from './Forstørrelsesglass';
import './Sokefelt.css';
import { useSearchParameters } from '../../../utils/UrlManipulation';
import { Search } from '@navikt/ds-react';

const Sokefelt: FunctionComponent = () => {
    const { getSearchParameter, setSearchParameter } = useSearchParameters();

    const søketekstvariabel = getSearchParameter('sok');
    const søkeTekst = søketekstvariabel ? søketekstvariabel : '';

    const onSoketekstChange = (soketekst: string) =>
        setSearchParameter({ sok: soketekst, side: '1' });

    return (
        <div className="sokefelt">
            <Search
                className="sokefelt__felt"
                aira-live="polite"
                label=""
                value={søkeTekst}
                onChange={(e: any) => onSoketekstChange(e.target.value)}
                placeholder="Søk på navn eller fødselsnummer"
            />
            <div className="sokefelt__ikon">{søkeTekst.length === 0 && <Forstorrelsesglass />}</div>
        </div>
    );
};

export default Sokefelt;

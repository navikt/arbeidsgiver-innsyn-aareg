import React, { FunctionComponent } from 'react';
import { Input } from 'nav-frontend-skjema';
import Forstorrelsesglass from './Forstørrelsesglass';
import './Sokefelt.less';
import { useSearchParameters } from '../../../utils/UrlManipulation';

const Sokefelt: FunctionComponent = () => {
    const { getSearchParameter, setSearchParameter } = useSearchParameters();

    const søketekstvariabel = getSearchParameter('sok');
    const søkeTekst = søketekstvariabel ? søketekstvariabel : '';

    const onSoketekstChange = (soketekst: string) => setSearchParameter({ sok: soketekst, side: '1' });

    return (
        <div className="sokefelt">
            <Input
                className="sokefelt__felt"
                type="search"
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

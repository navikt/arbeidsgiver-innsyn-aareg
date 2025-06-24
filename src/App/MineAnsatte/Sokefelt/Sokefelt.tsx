import React from 'react';
import './Sokefelt.css';
import { useSearchParameters } from '../../../utils/UrlManipulation';
import { Search } from '@navikt/ds-react';

const Sokefelt: React.FC = () => {
    const { getSearchParameter, setSearchParameter } = useSearchParameters();
    const searchText = getSearchParameter('sok') ?? '';

    const handleSearchChange = (value: string) => {
        setSearchParameter({ sok: value, side: '1' });
    };

    return (
        <div className="sokefelt">
            <Search
                className="sokefelt__felt"
                aria-live="polite"
                label=""
                value={searchText}
                onChange={handleSearchChange}
                placeholder="Søk på navn eller fødselsnummer"
            />
        </div>
    );
};

export default Sokefelt;
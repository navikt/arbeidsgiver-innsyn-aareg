import { useHistory } from 'react-router-dom';
import { useCallback } from 'react';

export type Params = {
    [key: string]: string;
};

type UseSearchParameters = {
    getSearchParameter: (key: string) => string | null;
    setSearchParameter: (params: Params) => void;
};

export const useSearchParameters = (): UseSearchParameters => {
    const hist = useHistory();
    const search = new URLSearchParams(hist.location.search);

    const setSearchParameter = useCallback(
        (params: Params) => {
            Object.entries(params).forEach(entry => {
                const [key, value] = entry;
                search.set(key, value);
            });
            hist.replace({ search: search.toString() });
        },
        [hist, search]
    );

    const getSearchParameter = useCallback((key: string) => search.get(key) ?? null, [search]);

    return { getSearchParameter, setSearchParameter };
};

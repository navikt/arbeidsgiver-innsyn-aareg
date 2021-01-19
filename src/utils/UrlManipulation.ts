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

    const setSearchParameter = useCallback(
        (params: Params) => {
            const search = new URLSearchParams(hist.location.search);
            Object.entries(params).forEach(entry => {
                const [key, value] = entry;
                search.set(key, value);
            });
            hist.replace({ search: search.toString() });
        },
        [hist]
    );

    const getSearchParameter = useCallback(
        (key: string) => {
            const search = new URLSearchParams(hist.location.search);
            return search.get(key) ?? null;
        },
        [hist]
    );

    return { getSearchParameter, setSearchParameter };
};

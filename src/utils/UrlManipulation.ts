import { useHistory } from 'react-router-dom';
import { useLocation } from "react-router";

export type Params = {
    [key: string]: string;
};

type UseSearchParameters = {
    getSearchParameter: (key: string) => string | null;
    setSearchParameter: (params: Params) => void;
};

export const useSearchParameters = (): UseSearchParameters => {
    const hist = useHistory();
    const loc = useLocation();

    const setSearchParameter = (params: Params) => {
        const search = new URLSearchParams(hist.location.search);
        Object.entries(params).forEach(entry => {
            const [key, value] = entry;
            search.set(key, value);
        });
        hist.replace({ search: search.toString() });
    };

    const getSearchParameter = (key: string) => {
        const search = new URLSearchParams(loc.search);
        return search.get(key) ?? null;
    };

    return { getSearchParameter, setSearchParameter };
};

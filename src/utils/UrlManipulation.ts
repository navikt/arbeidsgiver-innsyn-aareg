import { useNavigate, useLocation } from 'react-router-dom';

export type Params = {
    [key: string]: string;
};

type UseSearchParameters = {
    getSearchParameter: (key: string) => string | null;
    setSearchParameter: (params: Params) => void;
};

export const useSearchParameters = (): UseSearchParameters => {
    const navigate = useNavigate();
    const loc = useLocation();

    const setSearchParameter = (params: Params) => {
        const search = new URLSearchParams(loc.search);
        Object.entries(params).forEach((entry) => {
            const [key, value] = entry;
            search.set(key, value);
        });
        navigate({ search: search.toString() }, {replace: true});
    };

    const getSearchParameter = (key: string) => {
        const search = new URLSearchParams(loc.search);
        return search.get(key) ?? null;
    };

    return { getSearchParameter, setSearchParameter };
};

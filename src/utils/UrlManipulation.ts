import { useNavigate, useLocation, To, NavigateOptions } from 'react-router-dom';

export type Params = {
    [key: string]: string;
};

type UseSearchParameters = {
    getSearchParameter: (key: string) => string | null;
    setSearchParameter: (params: Params) => void;
};

export const useReplace = () => {
    const navigate = useNavigate()
    return (to: To, options?: NavigateOptions) =>
        navigate(to, {...options, replace: true})
}

export const useSearchParameters = (): UseSearchParameters => {
    const replace = useReplace();
    const loc = useLocation();

    const setSearchParameter = (params: Params) => {
        const search = new URLSearchParams(loc.search);
        Object.entries(params).forEach((entry) => {
            const [key, value] = entry;
            search.set(key, value);
        });
        replace({ search: search.toString() });
    };

    const getSearchParameter = (key: string) => {
        const search = new URLSearchParams(loc.search);
        return search.get(key) ?? null;
    };

    return { getSearchParameter, setSearchParameter };
};

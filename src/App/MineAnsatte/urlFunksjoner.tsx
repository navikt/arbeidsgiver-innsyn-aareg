import { Params } from "../../utils/UrlManipulation";

export const defaultFilterParams = (): Params => ({
    side: '1',
    filter: 'Alle',
    varsler: 'false',
    sok: '',
    sorter: '0',
    revers: 'false'
});

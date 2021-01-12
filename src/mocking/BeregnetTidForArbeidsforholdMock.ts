import fetchMock from 'fetch-mock';
import { hentAntallArbeidsforholdLink} from '../App/lenker';
import { delayed, getOrgnr, randomInt } from "./util";

fetchMock
    .get(
        hentAntallArbeidsforholdLink(),
        (url, request) => {
            const antall = Number.parseInt(getOrgnr(request) ?? '100') % 1000;
            const missing = randomInt(10) === 0;
            return delayed(1000, () => ({first: '910825518', second: missing ? -1 : antall}));
        }
    )
    .spy();
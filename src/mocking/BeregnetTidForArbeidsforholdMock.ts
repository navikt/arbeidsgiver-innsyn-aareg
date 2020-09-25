import fetchMock from 'fetch-mock';
import { hentAntallArbeidsforholdLinkNyBackend} from '../App/lenker';
const delay = new Promise(res => setTimeout(res, 500));
fetchMock
    .get(
        hentAntallArbeidsforholdLinkNyBackend(),
        delay.then(() => {
            return {first: '910825518', second: 300};
        })
    )
    .spy();
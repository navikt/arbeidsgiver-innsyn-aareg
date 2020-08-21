import fetchMock from 'fetch-mock';
import { hentArbeidsforholdLinkNyBackend} from '../App/lenker';
import { AaregMockObjekt } from './funksjonerForAlageAAregMock';
const delay = new Promise(res => setTimeout(res, 4000));
fetchMock
    .get(
        hentArbeidsforholdLinkNyBackend(),
        delay.then(() => {
          return AaregMockObjekt;
        })
    )
    .spy();
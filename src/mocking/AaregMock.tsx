import fetchMock from 'fetch-mock';
import {hentArbeidsforholdLinkNyBackend, hentTidligereVirksomheterLink} from '../App/lenker';
import { AaregMockObjekt } from './funksjonerForAlageAAregMock';
import {tidligerVirksomheter} from "./mockresponsFraAltinn";
const delay = new Promise(res => setTimeout(res, 4000));
fetchMock
    .get(
        hentArbeidsforholdLinkNyBackend(),
        delay.then(() => {
          return AaregMockObjekt;
        })
    )
    .spy();

fetchMock
    .get(
        hentTidligereVirksomheterLink,
        delay.then(() => {
            return tidligerVirksomheter;
        })
    )
    .spy();
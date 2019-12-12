import fetchMock from 'fetch-mock';
import {hentArbeidsforholdLink} from "../App/lenker";
import {AaregMockObjekt} from "./funksjonerForAlageAAregMock";
const delay = new Promise(res => setTimeout(res, 500));

fetchMock
    .get(
        hentArbeidsforholdLink(),
        delay.then(() => {
            return AaregMockObjekt;
        })
    )
    .spy();
import fetchMock from 'fetch-mock';
import {
    hentArbeidsforholdLinkNyBackend,
    hentTidligereArbeidsforholdLinkNyBackend,
    hentTidligereVirksomheterLink
} from '../App/lenker';
import {AaregMockObjekt, AaregMockObjektForNedlagtVirksomhet} from './funksjonerForAlageAAregMock';
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
        hentTidligereArbeidsforholdLinkNyBackend(),
        delay.then(() => {
            return AaregMockObjektForNedlagtVirksomhet;
        })
    )
    .spy();



//let headere = {"orgnr": "954168395", "jurenhet": "810825472"};

/*fetchMock
    .get(
        hentArbeidsforholdLinkNyBackend(),AaregMockObjekt,{
            delay: 1000, // fake a slow network
            headers: {
                orgnr: '910825526', jurenhet: "810825472"
            }})
    .spy();

 */

/*fetchMock
    .get(
        hentArbeidsforholdLinkNyBackend(),AaregMockObjektForNedlagtVirksomhet,{
            delay: 1000, // fake a slow network
            headers: {
                orgnr: "954168395", jurenhet: "810825472"
            }})
    .spy();

 */

fetchMock
    .get(
        hentTidligereVirksomheterLink,
        delay.then(() => {
            return tidligerVirksomheter;
        })
    )
    .spy();
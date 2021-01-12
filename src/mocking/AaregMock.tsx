import fetchMock from 'fetch-mock';
import { hentArbeidsforholdLink, hentTidligereArbeidsforholdLink, hentTidligereVirksomheterLink } from '../App/lenker';
import { AaregMockObjekt, AaregMockObjektForNedlagtVirksomhet } from './funksjonerForAlageAAregMock';
import { tidligerVirksomheter } from './mockresponsFraAltinn';
import { delayed, getOrgnr } from './util';

fetchMock
    .get(hentArbeidsforholdLink(), (_, request) =>
        delayed(4000, () => AaregMockObjekt(Number.parseInt(getOrgnr(request) ?? '100') % 1000))
    )
    .spy();

fetchMock
    .get(
        hentTidligereArbeidsforholdLink(),
        delayed(2000, () => AaregMockObjektForNedlagtVirksomhet)
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
        delayed(1000, () => tidligerVirksomheter)
    )
    .spy();

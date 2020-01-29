import fetchMock from 'fetch-mock';
import { testRespons, tilgangTilAtinntjenesteRespons } from './mockresponsFraAltinn';
import { hentOrganisasjonerLink } from '../App/lenker';
const delay = new Promise(res => setTimeout(res, 500));

fetchMock
    .get(
        hentOrganisasjonerLink(),
        delay.then(() => {
            return testRespons;
        })
    )
    .spy();
fetchMock
    .get(
        '/arbeidsforhold/api/rettigheter-til-skjema/?serviceKode=5441&serviceEdition=1',
        delay.then(() => {
            return tilgangTilAtinntjenesteRespons;
        })
    )
    .spy();

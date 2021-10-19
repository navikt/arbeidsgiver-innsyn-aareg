import fetchMock from 'fetch-mock';
import { testRespons, tilgangTilAtinntjenesteRespons } from './mockresponsFraAltinn';
import { hentOrganisasjonerLink} from '../App/lenker';

const delay = new Promise(res => setTimeout(res, 1000));

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
        'arbeidsforhold/arbeidsgiver-arbeidsforhold/api/rettigheter-til-tjeneste/?serviceKode=5441&serviceEdition=1',
        delay.then(() => {
          return tilgangTilAtinntjenesteRespons;
        })
    )
    .spy();

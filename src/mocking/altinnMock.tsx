import fetchMock from 'fetch-mock';
import { testRespons} from "./mockresponsFraAltinn";
import {hentOrganisasjonerLink} from "../App/lenker";
const delay = new Promise(res => setTimeout(res, 500));

fetchMock
    .get(
        hentOrganisasjonerLink(),
        delay.then(() => {
            return testRespons
        })
    )
    .spy();
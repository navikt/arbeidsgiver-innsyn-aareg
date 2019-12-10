import fetchMock from 'fetch-mock';
import {MockresponsOrganisasjoner} from "./mockresponsFraAltinn";
import {hentOrganisasjonerLink} from "../App/lenker";
const delay = new Promise(res => setTimeout(res, 500));

fetchMock
    .get(
        hentOrganisasjonerLink(),
        delay.then(() => {
            return MockresponsOrganisasjoner
        })
    )
    .spy();
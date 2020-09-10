import fetchMock from "fetch-mock";
import { hentFeatureTogglesLenke} from '../App/lenker';
const delay = new Promise(res => setTimeout(res, 500));
fetchMock
    .get(
        'begin:'+hentFeatureTogglesLenke(),
        delay.then(() => {
            return {
                "innsynaareg.vishistorikk": true,
                "innsynaareg.tillatPrint": true
            }
        })
    )
    .spy();
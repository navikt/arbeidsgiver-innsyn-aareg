import { hentArbeidsforholdLink } from '../App/lenker';
import { ObjektFraAAregisteret, tomResponsFraAareg } from '../App/Objekter/ObjektFraAAreg';
import amplitude from "../utils/amplitude";
import environment from "../utils/environment";
import {
    loggAntallAnsatte,
    loggSnittTidPerArbeidsforhold,
    loggTidForAlleArbeidsforhold
} from "../App/amplitudefunksjonerForLogging";


export async function hentArbeidsforholdFraAAreg(underenhet: string, enhet: string): Promise<ObjektFraAAregisteret> {
    const headere = new Headers();
    headere.set('orgnr', underenhet);
    headere.set('jurenhet', enhet);
    const startTtid = new Date();
    let respons = await fetch(hentArbeidsforholdLink(), { headers: headere });
    if (respons.ok) {
        const jsonRespons: ObjektFraAAregisteret  = await respons.json();
        loggAntallAnsatte(jsonRespons.arbeidsforholdoversikter.length);
        const tid = (new Date().getTime() - startTtid.getTime()) / 1000;
        loggSnittTidPerArbeidsforhold(jsonRespons.arbeidsforholdoversikter.length,tid);
        loggTidForAlleArbeidsforhold(tid);
        return jsonRespons;
    } else {
        amplitude.logEvent(" #arbeidsforhold klarte ikke hente ut arbeidsforhold");
        amplitude.logEvent(" #arbeidsforhold tok: " + (new Date().getTime() - startTtid.getTime()) / 1000 + " før kallet feilet i miljøet " + environment.MILJO);
        return tomResponsFraAareg;
    }
}
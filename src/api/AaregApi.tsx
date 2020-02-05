import { hentArbeidsforholdLink } from '../App/lenker';
import { ObjektFraAAregisteret, tomResponsFraAareg } from '../App/Objekter/ObjektFraAAreg';
import amplitude from "../utils/amplitude";
import environment from "../utils/environment";

export async function hentArbeidsforholdFraAAreg(underenhet: string, enhet: string): Promise<ObjektFraAAregisteret> {
    const headere = new Headers();
    headere.set('orgnr', underenhet);
    headere.set('jurenhet', enhet);
    const startTtid = new Date();
    let respons = await fetch(hentArbeidsforholdLink(), { headers: headere });
    if (respons.ok) {
        amplitude.logEvent(" #arbeidsforhold tok: " + (new Date().getTime() - startTtid.getTime()) / 1000 + " sekunder å hente arbeidsforhold i miljoet: " + environment.MILJO);
        return await respons.json();
    } else {
        amplitude.logEvent(" #arbeidsforhold klarte ikke hente ut arbeidsforhold");
        amplitude.logEvent(" #arbeidsforhold tok: " + (new Date().getTime() - startTtid.getTime()) / 1000 + " før kallet feilet i miljøet " + environment.MILJO);
        return tomResponsFraAareg;
    }
}
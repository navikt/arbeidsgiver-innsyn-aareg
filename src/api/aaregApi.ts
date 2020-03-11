import {hentAntallArbeidsforholdLink, hentArbeidsforholdLink, sjekkSonekryssingLink} from '../App/lenker';
import { ObjektFraAAregisteret } from '../App/Objekter/ObjektFraAAreg';
import amplitude from '../utils/amplitude';
import {
    loggAntallAnsatte,
    loggSnittTidPerArbeidsforhold,
    loggTidForAlleArbeidsforhold
} from '../App/amplitudefunksjonerForLogging';
import { FetchError } from './api-utils';
import { OversiktOverAntallForholdPerUnderenhet } from '../App/Objekter/OversiktOverAntallForholdPerUnderenhet';

export async function hentArbeidsforholdFraAAreg(underenhet: string, enhet: string): Promise<ObjektFraAAregisteret> {
    const headere = new Headers();
    headere.set('orgnr', underenhet);
    headere.set('jurenhet', enhet);
    const startTtid = new Date();
    let response: Response = await fetch(hentArbeidsforholdLink(), { headers: headere });

    if (response.ok) {
        const jsonRespons: ObjektFraAAregisteret = await response.json();
        loggAntallAnsatte(jsonRespons.arbeidsforholdoversikter.length);
        const tid = new Date().getDate() - startTtid.getDate();
        loggSnittTidPerArbeidsforhold(jsonRespons.arbeidsforholdoversikter.length, tid);
        loggTidForAlleArbeidsforhold(tid);
        return jsonRespons;
    } else {
        amplitude.logEvent('#arbeidsforhold klarte ikke hente ut arbeidsforhold');
        throw new FetchError(response.statusText || response.type, response);
    }
}

export async function hentAntallArbeidsforholdFraAareg(underenhet: string, enhet: string): Promise<Number> {
    const headere = new Headers();
    headere.set('opplysningspliktig', enhet);
    headere.set('orgnr', underenhet);
    let respons = await fetch(hentAntallArbeidsforholdLink(), { headers: headere });

    if (respons.ok) {
        const jsonRespons: OversiktOverAntallForholdPerUnderenhet = await respons.json();
        const valgtunderEnhet = jsonRespons.filter(
            oversikt => oversikt.arbeidsgiver.organisasjonsnummer === underenhet
        );
        if (valgtunderEnhet[0]) {
            return valgtunderEnhet[0].aktiveArbeidsforhold + valgtunderEnhet[0].inaktiveArbeidsforhold;
        }
        return 0;
    } else {
        throw new FetchError(respons.statusText || respons.type, respons);
    }
}

export async function sjekkSonekryssing(): Promise<string> {
    console.log("prover a kalle");
    console.log("sjekk sonekrysningslink: ", sjekkSonekryssingLink());
    let respons = await fetch(sjekkSonekryssingLink());
    if (respons.ok) {
        return respons.json();
    }
    else {
        return '';
    }
}

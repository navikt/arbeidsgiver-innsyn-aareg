import {
    hentAntallArbeidsforholdLinkNyBackend,
    hentArbeidsforholdLinkNyBackend,
    hentTidligereVirksomheterLink
} from '../App/lenker';
import {ObjektFraAAregisteret} from '../App/Objekter/ObjektFraAAreg';
import {FetchError} from './api-utils';
import {overSiktPerUnderenhetPar} from '../App/Objekter/OversiktOverAntallForholdPerUnderenhet';
import {
    loggAntallAnsatte,
    loggSnittTidPerArbeidsforhold,
    loggTidForAlleArbeidsforhold
} from '../App/amplitudefunksjonerForLogging';
import {Organisasjon} from "../App/Objekter/OrganisasjonFraAltinn";
import {mapOrganisasjonerFraLowerCaseTilupper} from "./altinnApi";

export async function hentArbeidsforholdFraAAregNyBackend(
    underenhet: string,
    enhet: string,
    signal: any
): Promise<ObjektFraAAregisteret> {
    let headere = new Headers();
    headere.set('orgnr', underenhet);
    headere.set('jurenhet', enhet);
    const startTtid = new Date();

    let response: Response = await fetch(hentArbeidsforholdLinkNyBackend(), { headers: headere, signal: signal });

    if (response.ok) {
        const jsonRespons: ObjektFraAAregisteret = await response.json();
        loggAntallAnsatte(jsonRespons.arbeidsforholdoversikter.length);
        const tid = new Date().getDate() - startTtid.getDate();
        loggSnittTidPerArbeidsforhold(jsonRespons.arbeidsforholdoversikter.length, tid);
        loggTidForAlleArbeidsforhold(tid);
        return jsonRespons;
    } else {
        throw new FetchError(response.statusText || response.type, response);
    }
}

export async function hentAntallArbeidsforholdFraAaregNyBackend(
    underenhet: string,
    enhet: string,
    signal: any
): Promise<number> {
    const headere = new Headers();
    headere.set('jurenhet', enhet);
    headere.set('orgnr', underenhet);
    let respons = await fetch(hentAntallArbeidsforholdLinkNyBackend(), { headers: headere, signal: signal });
    if (respons.ok) {
        const jsonRespons: overSiktPerUnderenhetPar = await respons.json();
        if (jsonRespons.second === 0){
            return -1
        }
        return jsonRespons.second;
    } else {
        return -1;
    }
}

export async function hentTidligereVirksomheter(
    enhet: string,
    signal: any
): Promise<Organisasjon[]> {
    let headere = new Headers();
    headere.set('jurenhet', enhet);
    let response: Response = await fetch(hentTidligereVirksomheterLink, { headers: headere, signal: signal });
    if (response.ok) {
        const organisasjoner = await response.json();
        return mapOrganisasjonerFraLowerCaseTilupper(organisasjoner);
    } else {
        throw new FetchError(response.statusText || response.type, response);
    }
}

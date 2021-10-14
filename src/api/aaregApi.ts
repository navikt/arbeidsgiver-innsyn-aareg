import {
    hentAntallArbeidsforholdLink,
    hentArbeidsforholdLink, hentTidligereArbeidsforholdLink,
    hentTidligereVirksomheterLink
} from '../App/lenker';
import { ObjektFraAAregisteret } from '../App/Objekter/ObjektFraAAreg';
import { FetchError } from './api-utils';
import { overSiktPerUnderenhetPar } from '../App/Objekter/OversiktOverAntallForholdPerUnderenhet';
import {
    loggAntallAnsatte
} from '../utils/amplitudefunksjonerForLogging';
import { Organisasjon } from '../App/Objekter/OrganisasjonFraAltinn';
import { mapOrganisasjonerFraLowerCaseTilupper } from './altinnApi';

export async function hentArbeidsforholdFraAAreg(
    underenhet: string,
    enhet: string,
    signal: any,
    erTidligereArbeidsforhold: boolean
): Promise<ObjektFraAAregisteret> {
    const headere = lagHeadere(enhet, underenhet);
    const linkTilEndepunkt = erTidligereArbeidsforhold ?
        hentTidligereArbeidsforholdLink() : hentArbeidsforholdLink();
    let response: Response = await fetch(linkTilEndepunkt, { headers: headere, signal: signal });
    if (response.ok) {
        const jsonRespons: ObjektFraAAregisteret = await response.json();
        loggAntallAnsatte(jsonRespons.arbeidsforholdoversikter.length);
        return jsonRespons;
    } else {
        throw new FetchError(response.statusText || response.type, response);
    }
}

export async function hentAntallArbeidsforholdFraAareg(
    underenhet: string,
    enhet: string,
    signal: any
): Promise<number> {
    const headere = lagHeadere(enhet, underenhet);
    let respons = await fetch(hentAntallArbeidsforholdLink(), { headers: headere, signal: signal });
    if (respons.ok) {
        const jsonRespons: overSiktPerUnderenhetPar = await respons.json();
        if (jsonRespons.second === 0) {
            return -1;
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
    const headere = lagHeadere(enhet);
    let response: Response = await fetch(hentTidligereVirksomheterLink, { headers: headere, signal: signal });
    if (response.ok) {
        const organisasjoner = await response.json();
        return mapOrganisasjonerFraLowerCaseTilupper(organisasjoner);
    } else {
        throw new FetchError(response.statusText || response.type, response);
    }
}

const lagHeadere = (jurenhet: string, orgnr?: string) => {
    const headere = new Headers();
    headere.set('jurenhet', jurenhet);
    orgnr && headere.set('orgnr', orgnr);
    return headere;
};

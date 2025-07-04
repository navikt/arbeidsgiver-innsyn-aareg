import { ObjektFraAAregisteret } from '../App/Objekter/ObjektFraAAreg';
import { FetchError } from './api-utils';
import { overSiktPerUnderenhetPar } from '../App/Objekter/OversiktOverAntallForholdPerUnderenhet';
import { loggArbeidsforholdLastet } from '../utils/amplitudefunksjonerForLogging';
import { Organisasjon } from '../App/Objekter/OrganisasjonFraAltinn';
import { mapOrganisasjonerFraLowerCaseTilupper } from './altinnApi';

export async function hentArbeidsforholdFraAAreg(
    underenhet: string,
    enhet: string,
    erTidligereArbeidsforhold: boolean
): Promise<ObjektFraAAregisteret> {
    const response: Response = await fetch(
        erTidligereArbeidsforhold
            ? '/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/tidligere-arbeidsforhold'
            : '/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/arbeidsforhold',
        {
            headers: {
                jurenhet: enhet,
                orgnr: underenhet,
            },
        }
    );
    if (response.ok) {
        const jsonRespons: ObjektFraAAregisteret = await response.json();
        loggArbeidsforholdLastet(jsonRespons.arbeidsforholdoversikter);
        return jsonRespons;
    } else {
        throw new FetchError(response.statusText ?? response.type, response);
    }
}

export async function hentAntallArbeidsforholdFraAareg(
    underenhet: string,
    enhet: string
): Promise<number | undefined> {
    const respons = await fetch(
        '/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/antall-arbeidsforhold',
        {
            headers: {
                jurenhet: enhet,
                orgnr: underenhet,
            },
        }
    );
    if (respons.ok) {
        const jsonRespons: overSiktPerUnderenhetPar = await respons.json();
        return jsonRespons.second;
    } else {
        return undefined;
    }
}

export async function hentTidligereVirksomheter(enhet: string): Promise<Organisasjon[]> {
    const response: Response = await fetch(
        '/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/tidligere-virksomheter',
        {
            headers: {
                jurenhet: enhet,
            },
        }
    );
    if (response.ok) {
        const organisasjoner = await response.json();
        return mapOrganisasjonerFraLowerCaseTilupper(organisasjoner);
    } else {
        throw new FetchError(response.statusText ?? response.type, response);
    }
}

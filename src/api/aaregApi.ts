import { ObjektFraAAregisteret } from '../App/Objekter/ObjektFraAAreg';
import { FetchError, fetchJson } from './api-utils';
import { overSiktPerUnderenhetPar } from '../App/Objekter/OversiktOverAntallForholdPerUnderenhet';
import { loggArbeidsforholdLastet } from '../utils/amplitudefunksjonerForLogging';
import { Organisasjon, OrganisasjonlowerCase } from '../App/Objekter/OrganisasjonFraAltinn';
import { mapOrganisasjonerFraLowerCaseTilupper } from './altinnApi';

export async function hentArbeidsforholdFraAAreg(
    underenhet: string,
    enhet: string,
    erTidligereArbeidsforhold: boolean
): Promise<ObjektFraAAregisteret> {
    const url = erTidligereArbeidsforhold
        ? '/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/tidligere-arbeidsforhold'
        : '/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/arbeidsforhold';

    const data = await fetchJson<ObjektFraAAregisteret>(url, {
        jurenhet: enhet,
        orgnr: underenhet,
    });

    loggArbeidsforholdLastet(data.arbeidsforholdoversikter);
    return data;
}

export async function hentAntallArbeidsforholdFraAareg(
    underenhet: string,
    enhet: string
): Promise<number | undefined> {
    try {
        const data = await fetchJson<overSiktPerUnderenhetPar>(
            '/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/antall-arbeidsforhold',
            {
                jurenhet: enhet,
                orgnr: underenhet,
            }
        );
        return data.second;
    } catch {
        return undefined;
    }
}

export async function hentTidligereVirksomheter(
    enhet: string
): Promise<Organisasjon[]> {
    const data = await fetchJson<OrganisasjonlowerCase[]>(
        '/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/tidligere-virksomheter',
        {
            jurenhet: enhet,
        }
    );

    return mapOrganisasjonerFraLowerCaseTilupper(data);
}
import { hentArbeidsforholdLink } from '../App/lenker';
import { ObjektFraAAregisteret, tomResponsFraAareg } from '../App/Objekter/ObjektFraAAreg';
import amplitude from '../utils/amplitude';
import {
    loggAntallAnsatte,
    loggSnittTidPerArbeidsforhold,
    loggTidForAlleArbeidsforhold
} from '../App/amplitudefunksjonerForLogging';

export async function hentArbeidsforholdFraAAreg(underenhet: string, enhet: string): Promise<ObjektFraAAregisteret> {
    const headere = new Headers();
    headere.set('orgnr', underenhet);
    headere.set('jurenhet', enhet);
    const startTtid = new Date();
    let respons = await fetch(hentArbeidsforholdLink(), { headers: headere });

    if (respons.ok) {
        const jsonRespons: ObjektFraAAregisteret = await respons.json();
        loggAntallAnsatte(jsonRespons.arbeidsforholdoversikter.length);
        const tid = (new Date().getDate() - startTtid.getDate());
        loggSnittTidPerArbeidsforhold(jsonRespons.arbeidsforholdoversikter.length, tid);
        loggTidForAlleArbeidsforhold(tid);
        return jsonRespons;
    } else {
        amplitude.logEvent('#arbeidsforhold klarte ikke hente ut arbeidsforhold');
        return tomResponsFraAareg;
    }
}

import fuzzysort from 'fuzzysort';
import { Arbeidsforhold } from '../../Objekter/ObjektFraAAreg';

const fuzzysortConfig = {
    keys: ['arbeidstaker.offentligIdent', 'arbeidstaker.navn'],
    allowTypo: false,
    threshold: -1000
};

export function byggArbeidsforholdSokeresultat(
    ListeMedArbeidsforhold: Arbeidsforhold[] = [],
    inputTekst: string
): Arbeidsforhold[] {
    const sokeresultat = finnArbeidsforholdMedSok(ListeMedArbeidsforhold, inputTekst);
    return sokeresultat;
}

const finnArbeidsforholdMedSok = (ListeMedArbeidsforhold: Arbeidsforhold[], inputTekst: string) =>
    fuzzysort.go(inputTekst, ListeMedArbeidsforhold, fuzzysortConfig).map((arbeidsforhold: any) => arbeidsforhold.obj);

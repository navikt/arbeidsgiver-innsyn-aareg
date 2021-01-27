import fuzzysort from 'fuzzysort';
import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';

const fuzzysortConfig = {
    keys: ['arbeidstaker.offentligIdent', 'arbeidstaker.navn'],
    allowTypo: false,
    threshold: -1000
};

export const byggArbeidsforholdSokeresultat = (
    ListeMedArbeidsforhold: Arbeidsforhold[] = [],
    inputTekst: string
): Arbeidsforhold[] =>
    fuzzysort.go(inputTekst, ListeMedArbeidsforhold, fuzzysortConfig).map(arbeidsforhold => arbeidsforhold.obj);

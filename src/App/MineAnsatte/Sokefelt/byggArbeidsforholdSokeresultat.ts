import fuzzysort from 'fuzzysort';
import {arbeidsforhold} from "../../Objekter/ObjektFraAAreg";

const fuzzysortConfig = {
    key: 'navn',
    allowTypo: false,
    threshold: -1000
};

export function byggArbeidsforholdSokeresultat(
    ListeMedArbeidsforhold: arbeidsforhold[] = [],
    inputTekst: string
): arbeidsforhold[] {
    const sokeresultat = finnArbeidsforholdMedSok(ListeMedArbeidsforhold, inputTekst);
    console.log(sokeresultat);
    return sokeresultat;
};

const finnArbeidsforholdMedSok = (
    ListeMedArbeidsforhold: arbeidsforhold[],
    inputTekst: string
) =>
    fuzzysort
        .go(inputTekst, ListeMedArbeidsforhold, fuzzysortConfig)
        .map((arbeidsforhold: any) => arbeidsforhold.obj);

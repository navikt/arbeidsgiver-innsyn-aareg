import { Arbeidsforhold } from '../Objekter/ArbeidsForhold';

export const regnUtantallSider = (arbeidsForholdPerSide: number, antallArbeidsForhold: number) => {
    return Math.ceil(antallArbeidsForhold / arbeidsForholdPerSide);
};

export const regnUtArbeidsForholdSomSkalVisesPaEnSide = (
    naVarendeSideTall: number,
    arbeidsForholdPerSide: number,
    listeMedArbeidsForhold: Arbeidsforhold[]
): Arbeidsforhold[] => {
    const forsteElementPaSiden = arbeidsForholdPerSide * naVarendeSideTall - (arbeidsForholdPerSide - 1);
    return listeMedArbeidsForhold.slice(forsteElementPaSiden - 1, forsteElementPaSiden + (arbeidsForholdPerSide - 1));
};

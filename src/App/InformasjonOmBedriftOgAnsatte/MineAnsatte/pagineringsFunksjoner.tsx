import {Arbeidsforhold} from "../../Objekter/ArbeidsForhold";


export const regnUtantallSider = (arbeidsForholdPerSide: number, antallArbeidsForhold: number) => {
    return Math.ceil(antallArbeidsForhold / arbeidsForholdPerSide);
};

export const regnUtArbeidsForholdSomSkalVisesPaEnSide = (
    naVarendeSideTall: number,
    arbeidsForholdPerSide: number,
    antallSider: number,
    listeMedArbeidsForhold: Arbeidsforhold[]
): Arbeidsforhold[] => {
    const forsteElementPaSiden =
        arbeidsForholdPerSide * naVarendeSideTall - (arbeidsForholdPerSide - 1);
    const arbeidsForholdPaSiden = listeMedArbeidsForhold.slice(
        forsteElementPaSiden - 1,
        forsteElementPaSiden + (arbeidsForholdPerSide - 1)
    );
    return arbeidsForholdPaSiden;
};

export const visEllerSkjulChevroner = (
    naVarendeSidetall: number,
    antallSiderTilsammen: number,
    stringIDVenstreChevron: string,
    stringIDChevronHoyre: string
) => {
    const idChevronHoyre = document.getElementById(stringIDChevronHoyre);
    const idChevronVenstre = document.getElementById(stringIDVenstreChevron);
    if (idChevronHoyre && idChevronVenstre) {
        if (naVarendeSidetall === antallSiderTilsammen) {
            idChevronHoyre.style.visibility = 'hidden';
            idChevronVenstre.style.display = 'initial';
        } else if (naVarendeSidetall === 1) {
            idChevronHoyre.style.visibility = 'initial';
            idChevronVenstre.style.display = 'none';
        } else {
            idChevronHoyre.style.visibility = 'initial';
            idChevronVenstre.style.display = 'initial';
        }
    }
};

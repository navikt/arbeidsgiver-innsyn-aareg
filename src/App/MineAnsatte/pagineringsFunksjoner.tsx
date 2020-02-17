import { Arbeidsforhold } from '../Objekter/ArbeidsForhold';

export const regnUtantallSider = (arbeidsForholdPerSide: number, antallArbeidsForhold: number) => {
    return Math.ceil(antallArbeidsForhold / arbeidsForholdPerSide);
};

export const regnUtArbeidsForholdSomSkalVisesPaEnSide = (
    naVarendeSideTall: number,
    arbeidsForholdPerSide: number,
    antallSider: number,
    listeMedArbeidsForhold: Arbeidsforhold[]
): Arbeidsforhold[] => {
    const forsteElementPaSiden = arbeidsForholdPerSide * naVarendeSideTall - (arbeidsForholdPerSide - 1);
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
    const idChevronHoyreOvre = document.getElementById(stringIDChevronHoyre + '-overst');
    const idChevronVenstreOvre = document.getElementById(stringIDVenstreChevron + '-overst');
    const idChevronHoyreNedre = document.getElementById(stringIDChevronHoyre + '-nederst');
    const idChevronVenstreNedre = document.getElementById(stringIDVenstreChevron + '-nederst');

    if (idChevronHoyreNedre && idChevronHoyreOvre && idChevronVenstreNedre && idChevronVenstreOvre) {
        if (naVarendeSidetall === antallSiderTilsammen) {
            idChevronHoyreOvre.style.visibility = 'hidden';
            idChevronVenstreOvre.style.display = 'initial';
            idChevronHoyreNedre.style.visibility = 'hidden';
            idChevronVenstreNedre.style.display = 'initial';
        } else if (naVarendeSidetall === 1) {
            idChevronHoyreOvre.style.visibility = 'initial';
            idChevronVenstreOvre.style.display = 'none';
            idChevronHoyreNedre.style.visibility = 'initial';
            idChevronVenstreNedre.style.display = 'none';
        } else {
            idChevronHoyreOvre.style.visibility = 'initial';
            idChevronVenstreOvre.style.display = 'initial';
            idChevronHoyreNedre.style.visibility = 'initial';
            idChevronVenstreNedre.style.display = 'initial';
        }
    }
};

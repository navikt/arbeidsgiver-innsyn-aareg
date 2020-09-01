import { Arbeidsforhold } from '../Objekter/ArbeidsForhold';

export const regnUtantallSider = (arbeidsForholdPerSide: number, antallArbeidsForhold: number) => {
    return Math.ceil(antallArbeidsForhold / arbeidsForholdPerSide);
};

export const endreUrlParameter = (url: string, parameter: string, verdi: string) => {
    const gammelParameter = lesUrlParameter(url, parameter);
    return url.replace(gammelParameter, verdi);
};

export const lesUrlParameter = (url: string, parameter: string) => {
    const posisjonIUrl = url.indexOf(parameter);
    const startPosisjonParameter = posisjonIUrl + parameter.length + 1;
    let sluttPosisjonParameter = startPosisjonParameter;
    for (var i = startPosisjonParameter; i < url.length; i++) {
        if (url[i] === '&' || i === url.length - 1) {
            sluttPosisjonParameter = i;
            break;
        }
    }
    return url.substr(startPosisjonParameter, sluttPosisjonParameter + 1);
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

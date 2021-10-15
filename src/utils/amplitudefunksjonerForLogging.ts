import amplitude from './amplitude';
import {basename} from "../App/paths";
import { Arbeidsforhold } from '../App/Objekter/ArbeidsForhold';

interface EventProps {
    url: string;
    destinasjon?: string;
    lenketekst?: string;
    tittel?: string;
    arbeidsforholdMedVarsel?: boolean;
    antallArbeidsforhold?:number;
    antallArbeidsforholdMedVarsler?:number;
}

const baseUrl = `https://arbeidsgiver.nav.no${basename}`;

export const loggSidevisning = (pathname: string) => {
    const sidevisningsInfo: EventProps = {
        url: `${baseUrl}${pathname}`,
    };
    amplitude.logEvent('sidevisning', sidevisningsInfo);
};

export const loggNavigasjon = (
    destinasjon: string | undefined,
    lenketekst: string,
    currentPagePath?: string,
) => {

    if (destinasjon !== undefined && destinasjon !== '') {
        const { origin, pathname } = new URL(destinasjon, baseUrl);
        destinasjon = `${origin}${pathname}`;
    }

    const navigasjonsInfo: EventProps = {
        destinasjon: destinasjon,
        lenketekst,
        url: `${baseUrl}${currentPagePath ?? ''}`,
    };
    amplitude.logEvent('navigere', navigasjonsInfo);
};

export const loggBrukerklikk = (
    tittel: string,
    currentPagePath?: string,
    arbeidsforholdMedVarsel?: boolean
) => {
    const brukerKlikkInfo: EventProps = {
        tittel,
        url: `${baseUrl}${currentPagePath ?? ''}`,
        arbeidsforholdMedVarsel: arbeidsforholdMedVarsel === arbeidsforholdMedVarsel
    };
    amplitude.logEvent('klikk på knapp', brukerKlikkInfo);
};

export const loggArbeidsforholdLastet = (arbeidsforhold:Arbeidsforhold[]) => {
    if(arbeidsforhold.length === 0){return}

    const arbeidsforholdInfo: EventProps = {
        url: baseUrl,
        antallArbeidsforhold: arbeidsforhold.length,
        antallArbeidsforholdMedVarsler: arbeidsforhold.filter(arbeidsforhold => arbeidsforhold.varsler).length
    };

    amplitude.logEvent('arbeidsforhold lastet', arbeidsforholdInfo);
};



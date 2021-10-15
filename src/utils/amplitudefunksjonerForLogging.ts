import amplitude from './amplitude';
import { environment } from './environment';
import {Tilgang} from "../App/LoggInnBoundary";
import {basename} from "../App/paths";

interface EventProps {
    url: string;
    innlogget?: boolean;
    destinasjon?: string;
    lenketekst?: string;
    tittel?: string;
}

const baseUrl = `https://arbeidsgiver.nav.no${basename}`;

export const loggSidevisning = (pathname: string, innlogget: Tilgang) => {
    const sidevisningsInfo: EventProps = {
        url: `${baseUrl}${pathname}`,
        innlogget: innlogget === Tilgang.TILGANG,
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
) => {
    const brukerKlikkInfo: EventProps = {
        tittel,
        url: `${baseUrl}${currentPagePath ?? ''}`,
    };
    amplitude.logEvent('klikk på knapp', brukerKlikkInfo);
};

export const loggAntallAnsatte = (antall: number) => {
    let logg = '#arbeidsforhold antall arbeidsforhold: ';
    switch (true) {
        case antall === 0:
            logg += 'ingen arbeidsforhold';
            break;
        case antall < 30:
            logg += 'under 30';
            break;
        case antall < 100:
            logg += 'mellom 30 og 100';
            break;
        case antall < 500:
            logg += 'mellom 100 og 500';
            break;
        case antall < 1000:
            logg += '500 og 1000';
            break;
        case antall >= 1000:
            logg += 'over 1000';
            break;
        default:
            logg += 'kunne ikke finne antall';
    }
    //amplitude.logEvent(logg + ' i ' + environment.MILJO);
};

export const loggBrukerTrykketPaVarsel = () => {
    amplitude.logEvent('#arbeidsforhold trykket pa ansatt med varsel' + environment.MILJO);
};

export const loggBrukerTrykketPaExcel = () => {
    //amplitude.logEvent('#arbeidsforhold bruker trykket på exceleksport');
};

export const loggBrukerTrykketPaVeiledning = () => {
    //amplitude.logEvent('#arbeidsforhold bruker trykket på Skatteetatens veiledning');
};

export const loggSidevisningAvArbeidsforhold = (antallArbeidsforhold: number, tidligereVirksomhet: boolean) => {
    const url = `http://arbeidsgiver.nav.no/arbeidsforhold/${tidligereVirksomhet ? 'tidligere-virsomhet' : ''}`
    // amplitude.logEvent('sidevisning', {
    //     url,
    //     tjeneste: 'arbeidsgiver-arbeidsforhold',
    //     antallArbeidsforhold
    // });
};


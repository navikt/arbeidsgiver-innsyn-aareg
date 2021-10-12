import amplitude from '../utils/amplitude';
import { environment } from '../utils/environment';

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

export const loggSnittTidPerArbeidsforhold = (antall: number, tid: number) => {
    let logg = '#arbeidsforhold gjennomsnittstid per arbeidsforhold: ';
    if (antall > 0) {
        const tidPerForhold = antall / tid;
        switch (true) {
            case tidPerForhold < 0.001:
                logg += 'mindre enn 0.001 sekund';
                break;
            case tidPerForhold < 0.03:
                logg += 'mindre enn 0.03 sekund';
                break;
            case antall < 1:
                logg += 'mindre enn ett sekund';
                break;
            case antall < 3:
                logg += 'mindre enn tre sekunder';
                break;
            case antall < 5:
                logg += 'mindre enn fem sekunder';
                break;
            case antall > 5:
                logg += '500 og 1000';
                break;
            case antall >= 1000:
                logg += 'over 1000';
                break;

            default:
                logg += 'kunne ikke beregne snittid';
        }
        //amplitude.logEvent(logg + ' i ' + environment.MILJO);
    }
};

export const loggTidForAlleArbeidsforhold = (tid: number) => {
    let logg = '#arbeidsforhold tid å hente alle arbeidsforhold ';
    if (tid > 0) {
        switch (true) {
            case tid < 1:
                logg += 'mindre enn 1 sekund';
                break;
            case tid < 5:
                logg += 'mindre enn 5 sekund';
                break;
            case tid < 10:
                logg += 'mindre enn 10 sekunder';
                break;
            case tid < 15:
                logg += 'mindre enn 15 sekunder';
                break;
            case tid > 20:
                logg += 'mellom 20 og 60 sekunder';
                break;
            case tid >= 60:
                logg += 'over 60';
                break;

            default:
                logg += 'kunne ikke beregne tid';
        }
        //amplitude.logEvent(logg + ' i ' + environment.MILJO);
    }
};

export const loggBrukerTrykketPaVarsel = () => {
    //amplitude.logEvent('#arbeidsforhold trykket pa ansatt med varsel' + environment.MILJO);
};

export const loggBrukerTrykketPaExcel = () => {
    //amplitude.logEvent('#arbeidsforhold bruker trykket på exceleksport');
};

export const loggBrukerTrykketPaVeiledning = () => {
    //amplitude.logEvent('#arbeidsforhold bruker trykket på Skatteetatens veiledning');
};

export const loggForbiddenFraAltinn = () => {
    //amplitude.logEvent('#arbeidsforhold 403 fra altinn');
};

export const loggTrykketPåTidligereArbeidsforhold = () => {
    //amplitude.logEvent('naviger', {
    //    url: 'http://arbeidsgiver.nav.no/arbeidsforhold/tidligere-arbeidsforhold',
    //    tjeneste: 'arbeidsgiver-arbeidsforhold'
    //});
};

export const loggTrykketPåNåværendeArbeidsforhold = () => {
    // amplitude.logEvent('naviger', {
    //     url: 'http://arbeidsgiver.nav.no/arbeidsforhold/tidligere-arbeidsforhold',
    //     tjeneste: 'arbeidsgiver-arbeidsforhold'
    // });
};

export const loggSidevisningAvArbeidsforhold = (antallArbeidsforhold: number, tidligereVirksomhet: boolean) => {
    const url = `http://arbeidsgiver.nav.no/arbeidsforhold/${tidligereVirksomhet ? 'tidligere-virsomhet' : ''}`
    // amplitude.logEvent('sidevisning', {
    //     url,
    //     tjeneste: 'arbeidsgiver-arbeidsforhold',
    //     antallArbeidsforhold
    // });
};

export const loggInfoOmFeil = (typeFeil: string, erTidligereArbeidsfohold: boolean) => {
    // amplitude.logEvent('#arbeidsforhold FEILER ', { typeFeil, erTidligereArbeidsforhold: erTidligereArbeidsfohold });
};

export const loggInfoOmFeilTidligereOrganisasjoner = (typeFeil: string) => {
    // amplitude.logEvent('#arbeidsforhold TIDLIGERE ORGANISASJONER FEILER ', { typeFeil });
};

export const loggInfoOmFeilFraAltinn = (typeFeil: string) => {
    // amplitude.logEvent('#arbeidsforhold FEILER MOT ALTINN', { typeFeil });
};


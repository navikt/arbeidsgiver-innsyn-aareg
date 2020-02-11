import amplitude from "../utils/amplitude";
import environment from "../utils/environment";

export const loggAntallAnsatte = (antall: number) => {
    let logg = "#arbeidsforhold antall arbeidsforhold: ";
    switch(true) {
        case (antall === 0):
            logg += "ingen arbeidsforhold";
            break;
        case (antall < 30):
            logg += "under 30";
            break;
        case (antall < 100):
            logg += "mellom 30 og 100";
            break;
        case (antall < 500):
            logg += "mellom 100 og 500";
            break;
        case (antall < 1000):
            logg += "500 og 1000";
            break;
        case (antall >= 1000):
            logg += "over 1000";
            break;

        default:
            logg += "kunne ikke finne antall";
    }
    amplitude.logEvent(logg + " i " + environment.MILJO);
};

export const loggSnittTidPerArbeidsforhold = (antall: number, tid: number) => {
    let logg = "#arbeidsforhold gjennomsnittstid per arbeidsforhiold hentet: ";
    if (antall>0){
        const tidPerForhold = antall/tid;
        switch(true) {
            case (tidPerForhold < 0.03):
                logg += "mindre enn 0.03 sekund";
                break;
            case (antall < 1):
                logg += "mindre enn ett sekund";
                break;
            case (antall < 3):
                logg += "mindre enn tre sekunder";
                break;
            case (antall < 5):
                logg += "mindre enn fem sekunder";
                break;
            case (antall > 5):
                logg += "500 og 1000";
                break;
            case (antall >= 1000):
                logg += "over 1000";
                break;

            default:
                logg += "kunne ikke beregne snittid";
        }
        amplitude.logEvent(logg + " i " + environment.MILJO);

    };
};

export const loggTidForAlleArbeidsforhold = (tid: number) => {
    let logg = "#arbeidsforhold gjennomsnittstid per arbeidsforhiold hentet: ";
    if (tid>0){
        switch(true) {
            case (tid < 1):
                logg += "mindre enn 0.03 sekund";
                break;
            case (tid < 5):
                logg += "mindre enn ett sekund";
                break;
            case (tid < 10):
                logg += "mindre enn tre sekunder";
                break;
            case (tid < 15):
                logg += "mindre enn fem sekunder";
                break;
            case (tid > 20):
                logg += "500 og 1000";
                break;
            case (tid >= 60):
                logg += "over 60";
                break;

            default:
                logg += "kunne ikke beregne tid";
        }
        amplitude.logEvent(logg + " i " + environment.MILJO);

    };
};

export const loggBrukerTrykketPaVarsel = () => {
    amplitude.logEvent("trykket pa ansatt med varsel" + environment.MILJO);
};

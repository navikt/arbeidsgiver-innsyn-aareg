import amplitude from "../utils/amplitude";
import environment from "../utils/environment";
import {hentUnderenhet} from "../api/enhetsregisteretApi";
import {OrganisasjonFraEnhetsregisteret, tomEnhetsregOrg} from "./Objekter/OrganisasjonFraEnhetsregisteret";

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
    let logg = "#arbeidsforhold gjennomsnittstid per arbeidsforhold: ";
    if (antall>0){
        const tidPerForhold = antall/tid;
        switch(true) {
            case (tidPerForhold < 0.001):
                logg += "mindre enn 0.001 sekund";
                break;
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
    let logg = "#arbeidsforhold tid å hente alle arbeidsforhold ";
    if (tid>0){
        switch(true) {
            case (tid < 1):
                logg += "mindre enn 1 sekund";
                break;
            case (tid < 5):
                logg += "mindre enn 5 sekund";
                break;
            case (tid < 10):
                logg += "mindre enn 10 sekunder";
                break;
            case (tid < 15):
                logg += "mindre enn 15 sekunder";
                break;
            case (tid > 20):
                logg += "mellom 20 og 60 sekunder";
                break;
            case (tid >= 60):
                logg += "over 60";
                break;

            default:
                logg += "kunne ikke beregne tid";
        }
        amplitude.logEvent(logg + " i " + environment.MILJO);

    }
};

export const loggBrukerTrykketPaVarsel = () => {
    amplitude.logEvent("#arbeidsforhold trykket pa ansatt med varsel" + environment.MILJO);
};



export const loggBrukerTrykketPaExcel = () => {
    amplitude.logEvent("#arbeidsforhold bruker trykket på exceleksport");
};

export const loggBedriftsInfo = async (organisasjonNr: string) => {
    let infoFraEereg: OrganisasjonFraEnhetsregisteret = tomEnhetsregOrg;
    await hentUnderenhet(organisasjonNr).then(underenhet => {
        infoFraEereg = underenhet;
    });

    const antallAnsatte = infoFraEereg.antallAnsatte;

    if (infoFraEereg !== tomEnhetsregOrg) {
        amplitude.logEvent('#arbeidsforhold bedriftsinfo kallet feilet med bedrift: ' + infoFraEereg.navn);

        if (infoFraEereg.naeringskode1 && infoFraEereg.naeringskode1.kode.startsWith('84')) {
            amplitude.logEvent('#arbeidsforhold bedriftsinfo OFFENTLIG');
            if (
                infoFraEereg.institusjonellSektorkode.kode &&
                infoFraEereg.institusjonellSektorkode.kode === '6500'
            ) {
                amplitude.logEvent('#arbeidsforhold bedriftsinfo  Kommuneforvaltningen');
            }
            if (
                infoFraEereg.institusjonellSektorkode.kode &&
                infoFraEereg.institusjonellSektorkode.kode === '6100'
            ) {
                amplitude.logEvent('#arbeidsforhold bedriftsinfo Statsforvaltningen');
            }
        } else {
            amplitude.logEvent('#arbeidsforhold bedriftsinfo  PRIVAT');
        }
        const antallAnsatte = Number(infoFraEereg.antallAnsatte);
        switch (true) {
            case antallAnsatte < 20:
                amplitude.logEvent('#arbeidsforhold bedriftsinfo under 20 ansatte');
                break;
            case antallAnsatte > 3000:
                amplitude.logEvent('#arbeidsforhold bedriftsinfo over 3000 ansatte');
                break;
            case antallAnsatte > 1000:
                amplitude.logEvent('#arbeidsforhold bedriftsinfo over 1000 ansatte');
                break;
            case antallAnsatte > 500:
                amplitude.logEvent('#arbeidsforhold bedriftsinfo over 500 ansatte');
                break;
            case antallAnsatte > 100:
                amplitude.logEvent('#arbeidsforhold bedriftsinfo over 100 ansatte');
                break;
            case antallAnsatte >= 20:
                amplitude.logEvent('#arbeidsforhold bedriftsinfoover 20 ansatte');
                break;
            default:
                break;
        }

    }
    return antallAnsatte;
};
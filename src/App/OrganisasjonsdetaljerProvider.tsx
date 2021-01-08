import React, { createContext, FunctionComponent, useContext, useEffect, useState } from 'react';
import { Organisasjon, tomaAltinnOrganisasjon } from './Objekter/OrganisasjonFraAltinn';
import {
    hentAntallArbeidsforholdFraAareg,
    hentArbeidsforholdFraAAreg,
    hentTidligereVirksomheter
} from '../api/aaregApi';
import { loggInfoOmFeil, loggInfoOmFeilTidligereOrganisasjoner } from './amplitudefunksjonerForLogging';
import { AltinnorganisasjonerContext } from './AltinnorganisasjonerProvider';
import { APISTATUS } from '../api/api-utils';
import { Arbeidsforhold } from './Objekter/ArbeidsForhold';
import environment from '../utils/environment';
import amplitude from '../utils/amplitude';
import { redirectTilLogin } from './LoggInn/LoggInn';

type Context = {
    valgtAktivOrganisasjon: Organisasjon;
    tidligereVirksomheter: Organisasjon[] | undefined;
    valgtTidligereVirksomhet: Organisasjon;

    valgtArbeidsforhold: Arbeidsforhold | null;
    listeMedArbeidsforholdFraAareg: Arbeidsforhold[];

    tilgangArbeidsforhold: boolean;
    tilgangTilTidligereArbeidsforhold: boolean;
    antallArbeidsforhold: number;
    visProgressbar: boolean;
    antallArbeidsforholdUkjent: boolean;
    aaregLasteState: APISTATUS;
    feilkodeFraAareg: string;
    nåværendeUrlString: string;

    setNåværendeUrlString: (url: string) => void;
    setVisProgressbar: (vis: boolean) => void;
    setValgtTidligereVirksomhet: (tidligereVirksomhet: Organisasjon) => void;
    bedriftsvelgerBytterOrganisasjon: (org: Organisasjon) => void;
    hentOgSetAntallOgArbeidsforhold: (organisasjon: Organisasjon, erTidligereArbeidsforhold: boolean) => void;
    setValgtArbeidsforhold: (arbeidsforhold: Arbeidsforhold) => void;
};

export const OrganisasjonsdetaljerContext = createContext<Context>({} as Context);

export const MAKS_ANTALL_ARBEIDSFORHOLD = 25000;

export const OrganisasjonsdetaljerProvider: FunctionComponent = props => {
    const altinnorganisasjoner = useContext(AltinnorganisasjonerContext);

    const [valgtAktivOrganisasjon, setValgtAktivOrganisasjon] = useState(tomaAltinnOrganisasjon);
    const [tilgangArbeidsforhold, setTilgangArbeidsforhold] = useState(false);
    const [tilgangTilTidligereArbeidsforhold, setTilgangTilTidligereArbeidsforhold] = useState<boolean>(false);
    const [tidligereVirksomheter, setTidligereVirksomheter] = useState<Array<Organisasjon> | undefined>(undefined);
    const [valgtTidligereVirksomhet, setValgtTidligereVirksomhet] = useState(tomaAltinnOrganisasjon);
    const [visProgressbar, setVisProgressbar] = useState(false);
    const [aaregLasteState, setAaregLasteState] = useState<APISTATUS>(APISTATUS.LASTER);
    const [feilkodeFraAareg, setFeilkodeFraAareg] = useState<string>('');
    const [listeMedArbeidsforholdFraAareg, setListeMedArbeidsforholdFraAareg] = useState(Array<Arbeidsforhold>());
    const [antallArbeidsforhold, setAntallArbeidsforhold] = useState(0);
    const [antallArbeidsforholdUkjent, setAntallArbeidsforholdUkjent] = useState(false);
    const [valgtArbeidsforhold, setValgtArbeidsforhold] = useState<Arbeidsforhold | null>(null);
    const [
        abortControllerAntallArbeidsforhold,
        setAbortControllerAntallArbeidsforhold
    ] = useState<AbortController | null>(null);
    const [abortControllerArbeidsforhold, setAbortControllerArbeidsforhold] = useState<AbortController | null>(null);
    const [nåværendeUrlString, setNåværendeUrlString] = useState<string>(window.location.href);

    useEffect(() => {
        if (environment.MILJO) {
            amplitude.logEvent('#arbeidsforhold bruker er innlogget');
        }
    }, []);

    useEffect(() => {
        setTilgangArbeidsforhold(
            altinnorganisasjoner.find(org => org.OrganizationNumber === valgtAktivOrganisasjon.OrganizationNumber)
                ?.tilgang === true
        );
    }, [altinnorganisasjoner, valgtAktivOrganisasjon]);

    useEffect(() => {
        if (valgtAktivOrganisasjon.ParentOrganizationNumber && tilgangTilTidligereArbeidsforhold) {
            const abortController = new AbortController();
            const signal = abortController.signal;
            hentTidligereVirksomheter(valgtAktivOrganisasjon.ParentOrganizationNumber, signal)
                .then(setTidligereVirksomheter)
                .catch(loggInfoOmFeilTidligereOrganisasjoner);
        }
    }, [valgtAktivOrganisasjon.ParentOrganizationNumber, tilgangTilTidligereArbeidsforhold]);

    const hentOgSetAntallOgArbeidsforhold = (organisasjon: Organisasjon, erTidligereVirksomhet: boolean) => {
        const abortControllerAntallKall = new AbortController();
        const signal = abortControllerAntallKall.signal;
        setAbortControllerAntallArbeidsforhold(abortControllerAntallKall);

        setAaregLasteState(APISTATUS.LASTER);
        setAntallArbeidsforholdUkjent(true);
        setAntallArbeidsforhold(0);

        hentAntallArbeidsforholdFraAareg(
            organisasjon.OrganizationNumber,
            organisasjon.ParentOrganizationNumber,
            signal
        ).then(antall => {
            if (antall === -1) {
                setVisProgressbar(true);
            } else if (antall > MAKS_ANTALL_ARBEIDSFORHOLD) {
                setVisProgressbar(false);
                setAntallArbeidsforhold(antall);
                setAaregLasteState(APISTATUS.OK);
            } else {
                setAntallArbeidsforholdUkjent(false);
                setAntallArbeidsforhold(antall);
                setVisProgressbar(true);
            }
            if (antall <= MAKS_ANTALL_ARBEIDSFORHOLD) {
                const abortControllerArbeidsforhold = new AbortController();
                setAbortControllerArbeidsforhold(abortControllerArbeidsforhold);
                const signal = abortControllerArbeidsforhold.signal;

                hentArbeidsforholdFraAAreg(
                    organisasjon.OrganizationNumber,
                    organisasjon.ParentOrganizationNumber,
                    signal,
                    erTidligereVirksomhet
                )
                    .then(respons => {
                        setListeMedArbeidsforholdFraAareg(respons.arbeidsforholdoversikter);
                        setAaregLasteState(APISTATUS.OK);
                        if (antallArbeidsforholdUkjent) {
                            setAntallArbeidsforhold(respons.arbeidsforholdoversikter.length);
                        }
                        if (respons.arbeidsforholdoversikter.length === 0) {
                            setVisProgressbar(false);
                        }
                    })
                    .catch(error => {
                        const feilmelding =
                            'Hent arbeidsforhold fra AAreg feilet: ' + error.response.status
                                ? error.response.status
                                : 'Ukjent feil';
                        loggInfoOmFeil(feilmelding, erTidligereVirksomhet);
                        if (error.response.status === 401) {
                            redirectTilLogin();
                        }
                        setAaregLasteState(APISTATUS.FEILET);
                        setFeilkodeFraAareg(error.response.status.toString());
                    });
            }
        });
    };

    const bedriftsvelgerBytterOrganisasjon = (organisasjon: Organisasjon) => {
        const harTilgang = (orgnr: string): boolean =>
            altinnorganisasjoner.find(org => org.OrganizationNumber === orgnr)?.tilgang === true;

        setValgtAktivOrganisasjon(organisasjon);
        setTilgangTilTidligereArbeidsforhold(harTilgang(organisasjon.ParentOrganizationNumber));
        abortControllerAntallArbeidsforhold?.abort();
        abortControllerArbeidsforhold?.abort();

        if (organisasjon.OrganizationNumber && harTilgang(organisasjon.OrganizationNumber)) {
            hentOgSetAntallOgArbeidsforhold(organisasjon, false);
        }
    };

    const context: Context = {
        valgtAktivOrganisasjon,
        tilgangArbeidsforhold,
        tilgangTilTidligereArbeidsforhold,
        tidligereVirksomheter,
        setNåværendeUrlString,
        setValgtArbeidsforhold,
        setValgtTidligereVirksomhet,
        setVisProgressbar,
        hentOgSetAntallOgArbeidsforhold,
        aaregLasteState,
        antallArbeidsforhold,
        antallArbeidsforholdUkjent,
        feilkodeFraAareg,
        listeMedArbeidsforholdFraAareg,
        valgtArbeidsforhold,
        valgtTidligereVirksomhet,
        visProgressbar,
        nåværendeUrlString,
        bedriftsvelgerBytterOrganisasjon
    };

    return (
        <OrganisasjonsdetaljerContext.Provider value={context}>{props.children}</OrganisasjonsdetaljerContext.Provider>
    );
};

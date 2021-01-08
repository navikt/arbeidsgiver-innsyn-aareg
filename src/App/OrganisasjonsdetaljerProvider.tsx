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
    setValgtAktivOrganisasjon: (org: Organisasjon) => void;
    tilgangArbeidsforhold: boolean;
    tilgangTilTidligereArbeidsforhold: boolean;
    setTilgangTilTidligereArbeidsforhold: (bool: boolean) => void;
    tidligereVirksomheter: Organisasjon[] | undefined;

    hentOgSetAntallOgArbeidsforhold: (organisasjon: Organisasjon, erTidligereArbeidsforhold: boolean) => void;
    abortTidligereRequests: () => void;
    setNåværendeUrlString: (url: string) => void;
    setVisProgressbar: (vis: boolean) => void;
    valgtArbeidsforhold: Arbeidsforhold | null;
    setValgtArbeidsforhold: (arbeidsforhold: Arbeidsforhold) => void;
    listeMedArbeidsforholdFraAareg: Arbeidsforhold[];

    valgtTidligereVirksomhet: Organisasjon;
    antallArbeidsforhold: number;
    visProgressbar: boolean;
    aaregLasteState: APISTATUS;
    feilkodeFraAareg: string;
    antallArbeidsforholdUkjent: boolean;
    nåværendeUrlString: string;
    setValgtTidligereVirksomhet: (tidligereVirksomhet: Organisasjon) => void;
};

export const OrganisasjonsdetaljerContext = createContext<Context>({} as Context);

export const MAKS_ANTALL_ARBEIDSFORHOLD = 25000;

export const OrganisasjonsdetaljerProvider: FunctionComponent = props => {
    const altinnorganisasjoner = useContext(AltinnorganisasjonerContext);

    const [valgtAktivOrganisasjon, setValgtAktivOrganisasjon] = useState(tomaAltinnOrganisasjon);
    const [tilgangArbeidsforhold, setTilgangArbeidsforhold] = useState(false);
    const [tilgangTilTidligereArbeidsforhold, setTilgangTilTidligereArbeidsforhold] = useState<boolean>(false);
    const [tidligereVirksomheter, setTidligereVirksomheter] = useState<Array<Organisasjon> | undefined>(undefined);

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

    const abortTidligereRequests = () => {
        if (abortControllerAntallArbeidsforhold && abortControllerArbeidsforhold) {
            abortControllerAntallArbeidsforhold.abort();
            abortControllerArbeidsforhold.abort();
        }
    };

    const context: Context = {
        valgtAktivOrganisasjon,
        setValgtAktivOrganisasjon,
        tilgangArbeidsforhold,
        tilgangTilTidligereArbeidsforhold,
        setTilgangTilTidligereArbeidsforhold,
        tidligereVirksomheter,
        setNåværendeUrlString,
        setValgtArbeidsforhold,
        setValgtTidligereVirksomhet,
        setVisProgressbar,
        hentOgSetAntallOgArbeidsforhold,
        aaregLasteState,
        abortTidligereRequests,
        antallArbeidsforhold,
        antallArbeidsforholdUkjent,
        feilkodeFraAareg,
        listeMedArbeidsforholdFraAareg,
        valgtArbeidsforhold,
        valgtTidligereVirksomhet,
        visProgressbar,
        nåværendeUrlString
    };

    return (
        <OrganisasjonsdetaljerContext.Provider value={context}>{props.children}</OrganisasjonsdetaljerContext.Provider>
    );
};

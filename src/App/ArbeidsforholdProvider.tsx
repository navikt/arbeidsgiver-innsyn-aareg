import React, { createContext, FunctionComponent, useContext, useEffect, useState } from 'react';
import { Organisasjon } from './Objekter/OrganisasjonFraAltinn';
import { hentAntallArbeidsforholdFraAareg, hentArbeidsforholdFraAAreg } from '../api/aaregApi';
import { loggInfoOmFeil } from './amplitudefunksjonerForLogging';
import { Arbeidsforhold } from './Objekter/ArbeidsForhold';
import { redirectTilLogin } from './LoggInn/LoggInn';
import { BedriftsmenyContext } from './BedriftsmenyProvider';
import { useLocation } from 'react-router';

export type Context = { arbeidsforholdFor: Organisasjon; lastestatus: Lastestatus } | null;

export const ArbeidsforholdContext = createContext<Context>(null);

const feilmeldingtekst = (kode: string | null) => {
    switch (kode) {
        case '408':
            return 'Det oppstod en feil da vi prøvde å hente dine arbeidsforhold. Prøv å laste siden på nytt eller kontakte brukerstøtte hvis problemet vedvarer.';
        case '403':
            return 'ikke tilgang til forespurt entitet i Aa-reg, Vi opplever problemer med å hente opplysninger, kontakt brukerstøtte dersom du mener du har tilgang';
        default:
            return 'Vi opplever ustabilitet med Aa-registret. Prøv å laste siden på nytt eller kontakte brukerstøtte hvis problemet vedvarer.';
    }
};

type Lastestatus =
    | { status: 'laster'; estimertAntall?: number }
    | { status: 'ferdig'; arbeidsforhold: Arbeidsforhold[] }
    | { status: 'feil'; beskjed: string };

export const ArbeidsforholdProvider: FunctionComponent = props => {
    const { hovedenhet, underenhet, tidligereUnderenheter } = useContext(BedriftsmenyContext);

    const [lastestatus, settLastestatus] = useState<Lastestatus | null>(null);

    const loc = useLocation();

    const erPåTidligereUnderenhet = loc.pathname.startsWith('/tidligere-arbeidsforhold');

    let arbeidsforholdFor: Organisasjon | null;
    if (erPåTidligereUnderenhet) {
        const orgnr = new URLSearchParams(loc.search).get('tidligereVirksomhet');
        const underenheter = tidligereUnderenheter === 'laster' ? [] : tidligereUnderenheter;
        arbeidsforholdFor = underenheter.find(org => org.OrganizationNumber === orgnr) ?? null;
    } else {
        arbeidsforholdFor = underenhet;
    }

    useEffect(() => {
        const orgnr = arbeidsforholdFor?.OrganizationNumber ?? null;
        if (orgnr == null) {
            settLastestatus({ status: 'feil', beskjed: 'Feil med org.nr.' });
            return;
        }

        const abortAntall = new AbortController();
        const abortForhold = new AbortController();
        settLastestatus({ status: 'laster' });

        hentAntallArbeidsforholdFraAareg(orgnr, hovedenhet.OrganizationNumber, abortAntall.signal)
            .then(antall => {
                settLastestatus({ status: 'laster', estimertAntall: antall === -1 ? undefined : antall });
                hentArbeidsforholdFraAAreg(
                    orgnr,
                    hovedenhet.OrganizationNumber,
                    abortForhold.signal,
                    erPåTidligereUnderenhet
                )
                    .then(respons => {
                        settLastestatus({ status: 'ferdig', arbeidsforhold: respons.arbeidsforholdoversikter });
                    })
                    .catch(error => {
                        if (error.name !== 'AbortError') {
                            console.error(error);
                            const status = error?.response?.status;
                            const feilmelding = `Hent arbeidsforhold fra AAreg feilet: ${status ?? 'ukjent feil'}`;

                            loggInfoOmFeil(feilmelding, erPåTidligereUnderenhet);
                            if (status === 401) {
                                redirectTilLogin();
                            }
                            settLastestatus({ status: 'feil', beskjed: feilmeldingtekst(status) });
                        }
                    });
            })
            .catch(error => {
                if (error.name !== 'AbortError')  {
                    console.error(error);
                    settLastestatus({ status: 'feil', beskjed: feilmeldingtekst(null) });
                }
            });
        return () => {
            abortAntall.abort();
            abortForhold.abort();
        };
    }, [arbeidsforholdFor, erPåTidligereUnderenhet, hovedenhet.OrganizationNumber]);

    const context = arbeidsforholdFor === null || lastestatus === null ? null : { arbeidsforholdFor, lastestatus };

    return <ArbeidsforholdContext.Provider value={context}>{props.children}</ArbeidsforholdContext.Provider>;
};

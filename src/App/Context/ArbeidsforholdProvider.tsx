import React, {
    createContext,
    FunctionComponent,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { Organisasjon } from '../Objekter/OrganisasjonFraAltinn';
import { hentAntallArbeidsforholdFraAareg, hentArbeidsforholdFraAAreg } from '../../api/aaregApi';
import { Arbeidsforhold } from '../Objekter/ArbeidsForhold';
import { redirectTilLogin } from '../LoggInn/LoggInn';
import { BedriftsmenyContext } from './BedriftsmenyProvider';

export type ArbeidsforholdContext = {
    arbeidsforholdFor: Organisasjon;
    tidligereVirksomhet: boolean;
    lastestatus: Lastestatus;
} | null;

export const ArbeidsforholdContext = createContext<ArbeidsforholdContext>(null);

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
    | { status: 'ikke-tilgang' }
    | { status: 'laster'; estimertAntall?: number }
    | { status: 'ferdig'; arbeidsforhold: Arbeidsforhold[] }
    | { status: 'feil'; beskjed: string };

export const ArbeidsforholdProvider: FunctionComponent<PropsWithChildren> = (props) => {
    const { hovedenhet, underenhet, tidligereUnderenheter } = useContext(BedriftsmenyContext);

    const [lastestatus, settLastestatus] = useState<Lastestatus | null>(null);
    const [context, settContext] = useState<ArbeidsforholdContext>(null);

    const loc = useLocation();

    const erPåTidligereUnderenhet = loc.pathname.startsWith('/tidligere-arbeidsforhold');

    let arbeidsforholdFor: Organisasjon | null;
    let tilgang: boolean;
    if (erPåTidligereUnderenhet) {
        const orgnr = new URLSearchParams(loc.search).get('tidligereVirksomhet');
        const underenheter = tidligereUnderenheter === 'laster' ? [] : tidligereUnderenheter;
        arbeidsforholdFor = underenheter.find((org) => org.OrganizationNumber === orgnr) ?? null;
        tilgang = hovedenhet?.tilgang ?? false;
    } else {
        arbeidsforholdFor = underenhet;
        tilgang = underenhet.tilgang;
    }

    useEffect(() => {
        const orgnr = arbeidsforholdFor?.OrganizationNumber ?? null;
        if (orgnr == null) {
            settLastestatus(null);
            return;
        }

        if (!tilgang) {
            settLastestatus({ status: 'ikke-tilgang' });
            return;
        }

        const abortAntall = new AbortController();
        const abortForhold = new AbortController();
        settLastestatus({ status: 'laster' });

        hentAntallArbeidsforholdFraAareg(
            orgnr,
            underenhet.ParentOrganizationNumber,
            abortAntall.signal
        )
            .then((antall) => {
                settLastestatus({ status: 'laster', estimertAntall: antall });
                hentArbeidsforholdFraAAreg(
                    orgnr,
                    underenhet.ParentOrganizationNumber,
                    abortForhold.signal,
                    erPåTidligereUnderenhet
                )
                    .then((respons) => {
                        settLastestatus({
                            status: 'ferdig',
                            arbeidsforhold: respons.arbeidsforholdoversikter,
                        });
                    })
                    .catch((error) => {
                        if (error.name !== 'AbortError') {
                            const status = error?.response?.status;
                            if (status === 401) {
                                redirectTilLogin();
                            }
                            settLastestatus({ status: 'feil', beskjed: feilmeldingtekst(status) });
                        }
                    });
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error(error);
                    settLastestatus({ status: 'feil', beskjed: feilmeldingtekst(null) });
                }
            });
        return () => {
            abortAntall.abort();
            abortForhold.abort();
        };
    }, [tilgang, arbeidsforholdFor, erPåTidligereUnderenhet, underenhet.ParentOrganizationNumber]);

    useEffect(() => {
        if (arbeidsforholdFor !== null && lastestatus !== null) {
            settContext({
                arbeidsforholdFor,
                lastestatus,
                tidligereVirksomhet: erPåTidligereUnderenhet,
            });
        } else {
            settContext(null);
        }
    }, [settContext, arbeidsforholdFor, lastestatus, erPåTidligereUnderenhet]);

    return (
        <ArbeidsforholdContext.Provider value={context}>
            {props.children}
        </ArbeidsforholdContext.Provider>
    );
};

import React, { createContext, FunctionComponent, useEffect, useState } from 'react';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import environment from '../utils/environment';
import { APISTATUS } from '../api/api-utils';
import { Organisasjon, tomaAltinnOrganisasjon } from './Objekter/OrganisasjonFraAltinn';
import { hentOrganisasjonerFraAltinn, hentOrganisasjonerMedTilgangTilAltinntjeneste } from '../api/altinnApi';
import { hentTidligereVirksomheter } from '../api/aaregApi';
import {
    loggForbiddenFraAltinn,
    loggInfoOmFeilFraAltinn,
    loggInfoOmFeilTidligereOrganisasjoner
} from './amplitudefunksjonerForLogging';

export const SERVICEKODEINNSYNAAREGISTERET = '5441';
export const SERVICEEDITIONINNSYNAAREGISTERET = '1';

export const erGyldigOrganisasjon = (organisasjon: Organisasjon) => {
    return (
        organisasjon.Type === 'Enterprise' ||
        organisasjon.OrganizationForm === 'FLI' ||
        organisasjon.OrganizationForm === 'BEDR' || organisasjon.OrganizationForm === 'AAFY'
    );
};

export enum TILGANGSSTATE {
    LASTER,
    TILGANG,
    IKKE_TILGANG
}

type Context = {
    organisasjonerFraAltinn: Organisasjon[];
    organisasjonerFraAltinnMedTilgang: Organisasjon[] | null;
    valgtAktivOrganisasjon: Organisasjon;
    setValgtAktivOrganisasjon: (org: Organisasjon) => void;
    tilgangArbeidsforhold: TILGANGSSTATE;
    tilgangTilTidligereArbeidsforhold: boolean;
    setTilgangTilTidligereArbeidsforhold: (bool: boolean) => void;
    tidligereVirksomheter: Organisasjon[] | undefined;
};

export const OrganisasjonerOgTilgangerContext = createContext<Context>({} as Context);

export const OrganisasjonerOgTilgangerProvider: FunctionComponent = props => {
    const [organisasjonerFraAltinnLasteState, setOrganisasjonerFraAltinnLasteState] = useState<APISTATUS>(APISTATUS.LASTER);
    const [organisasjonerFraAltinn, setorganisasjoneFraAltinn] = useState(Array<Organisasjon>());
    const [organisasjonerFraAltinnMedTilgang, setOrganisasjonerFraAltinnMedTilgang] = useState<Array<Organisasjon> | null>(null);
    const [valgtAktivOrganisasjon, setValgtAktivOrganisasjon] = useState(tomaAltinnOrganisasjon);
    const [tilgangArbeidsforhold, setTilgangArbeidsforhold] = useState<TILGANGSSTATE>(TILGANGSSTATE.LASTER);
    const [tilgangTilTidligereArbeidsforhold, setTilgangTilTidligereArbeidsforhold] = useState<boolean>(false);
    const [tidligereVirksomheter, setTidligereVirksomheter] = useState<Array<Organisasjon> | undefined>(undefined);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        hentOrganisasjonerFraAltinn(signal)
            .then(organisasjonsliste => {
                setorganisasjoneFraAltinn(organisasjonsliste);
                hentOrganisasjonerMedTilgangTilAltinntjeneste(
                    SERVICEKODEINNSYNAAREGISTERET,
                    SERVICEEDITIONINNSYNAAREGISTERET,
                    signal
                )
                    .then(organisasjonerMedTilgangFraAltinn => {
                        setOrganisasjonerFraAltinnMedTilgang(organisasjonerMedTilgangFraAltinn.filter(organisasjon => erGyldigOrganisasjon(organisasjon)))
                        setOrganisasjonerFraAltinnLasteState(APISTATUS.OK);
                    })
                    .catch((e: Error) => {
                        loggInfoOmFeilFraAltinn(e.message);
                        setOrganisasjonerFraAltinnLasteState(APISTATUS.FEILET);
                    });
            })
            .catch((e: Error) => {
                loggInfoOmFeilFraAltinn(e.message);
                if (e.message === 'Forbidden') {
                    loggForbiddenFraAltinn();
                    setOrganisasjonerFraAltinnMedTilgang([]);
                    setOrganisasjonerFraAltinnLasteState(APISTATUS.OK);
                } else {
                    setOrganisasjonerFraAltinnLasteState(APISTATUS.FEILET);
                }
            });
        return function cleanup() {
            abortController.abort();
        };
    }, []);

    useEffect(() => {
        setTilgangArbeidsforhold(TILGANGSSTATE.LASTER);
        if (organisasjonerFraAltinnMedTilgang && valgtAktivOrganisasjon !== tomaAltinnOrganisasjon) {
            if (
                organisasjonerFraAltinnMedTilgang.filter(organisasjonMedTilgang => {
                    return organisasjonMedTilgang.OrganizationNumber === valgtAktivOrganisasjon.OrganizationNumber;
                }).length >= 1
            ) {
                setTilgangArbeidsforhold(TILGANGSSTATE.TILGANG);
            } else {
                setTilgangArbeidsforhold(TILGANGSSTATE.IKKE_TILGANG);
            }
        }
        if (organisasjonerFraAltinnMedTilgang && organisasjonerFraAltinnMedTilgang.length === 0) {
            setTilgangArbeidsforhold(TILGANGSSTATE.IKKE_TILGANG);
        }
    }, [valgtAktivOrganisasjon, organisasjonerFraAltinnMedTilgang]);

    useEffect(() => {
        if (
            organisasjonerFraAltinnMedTilgang &&
            valgtAktivOrganisasjon === tomaAltinnOrganisasjon &&
            environment.MILJO === 'dev-sbs'
        ) {
            setTilgangArbeidsforhold(TILGANGSSTATE.IKKE_TILGANG);
        }
        setTimeout(() => {}, 3000);
    }, [valgtAktivOrganisasjon, organisasjonerFraAltinnMedTilgang]);

    useEffect(() => {
        if (valgtAktivOrganisasjon.ParentOrganizationNumber && tilgangTilTidligereArbeidsforhold) {
            const abortController = new AbortController();
            const signal = abortController.signal;
            hentTidligereVirksomheter(valgtAktivOrganisasjon.ParentOrganizationNumber, signal)
                .then(virksomheter => {
                    setTidligereVirksomheter(virksomheter);
                })
                .catch(e => loggInfoOmFeilTidligereOrganisasjoner(e));
        }
    }, [valgtAktivOrganisasjon.ParentOrganizationNumber, tilgangTilTidligereArbeidsforhold]);

    if (organisasjonerFraAltinnLasteState === APISTATUS.OK) {

        const context: Context = {
            organisasjonerFraAltinn,
            organisasjonerFraAltinnMedTilgang,
            valgtAktivOrganisasjon,
            setValgtAktivOrganisasjon: (org: Organisasjon) => {
                setValgtAktivOrganisasjon(org);
            },
            tilgangArbeidsforhold,
            tilgangTilTidligereArbeidsforhold,
            setTilgangTilTidligereArbeidsforhold: bool => setTilgangTilTidligereArbeidsforhold(bool),
            tidligereVirksomheter
        };

        return (
            <OrganisasjonerOgTilgangerContext.Provider value={context}>
                {props.children}
            </OrganisasjonerOgTilgangerContext.Provider>
        );
    } else if (organisasjonerFraAltinnLasteState === APISTATUS.FEILET) {
        return (
            <div className="feilmelding-altinn">
                <AlertStripeFeil>
                    Vi opplever ustabilitet med Altinn. Hvis du mener at du har roller i
                    Altinn kan du prøve å laste siden på nytt.
                </AlertStripeFeil>
            </div>
        );
    } else  {
        return (
            <div className="spinner">
                <NavFrontendSpinner type="L" />
            </div>
        );
    }
};

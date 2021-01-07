import React, { createContext, FunctionComponent, useEffect, useState } from 'react';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Organisasjon } from './Objekter/OrganisasjonFraAltinn';
import { hentOrganisasjonerFraAltinn, hentOrganisasjonerMedTilgangTilAltinntjeneste } from '../api/altinnApi';
import {
    loggForbiddenFraAltinn,
    loggInfoOmFeilFraAltinn,
} from './amplitudefunksjonerForLogging';

export const SERVICEKODEINNSYNAAREGISTERET = '5441';
export const SERVICEEDITIONINNSYNAAREGISTERET = '1';

const erGyldigOrganisasjon = (organisasjon: Organisasjon) => {
    return (
        organisasjon.Type === 'Enterprise' ||
        organisasjon.OrganizationForm === 'FLI' ||
        organisasjon.OrganizationForm === 'BEDR' ||
        organisasjon.OrganizationForm === 'AAFY'
    );
};

type Context = Array<Organisasjon & {tilgang: boolean}>;

export const AltinnorganisasjonerContext = createContext<Context>([]);

export const AltinnorganisasjonerProvider: FunctionComponent = props => {
    const [organisasjoner, settOrganisasjoner] = useState<null | Array<Organisasjon>>(null)
    const [organisasjonerMedTilgang, settOrganisasjonerMedTilgang] = useState<null | Set<string>>(null)
    const [feil, settFeil] = useState(false)

    useEffect(() => {
        const abortController = new AbortController();

        hentOrganisasjonerFraAltinn(abortController.signal)
            .then(settOrganisasjoner)
            .catch((e: Error) => {
                loggInfoOmFeilFraAltinn(e.message);
                if (e.message === 'Forbidden') {
                    loggForbiddenFraAltinn();
                    settOrganisasjoner([]);
                } else {
                    settFeil(true)
                    abortController.abort()
                }
            });

        hentOrganisasjonerMedTilgangTilAltinntjeneste(
            SERVICEKODEINNSYNAAREGISTERET,
            SERVICEEDITIONINNSYNAAREGISTERET,
            abortController.signal
        )
            .then(organisasjonerMedTilgangFraAltinn => {
                settOrganisasjonerMedTilgang(new Set(
                    organisasjonerMedTilgangFraAltinn
                        .filter(erGyldigOrganisasjon)
                        .map(org => org.OrganizationNumber)
                    )
                )
            })
            .catch((e: Error) => {
                loggInfoOmFeilFraAltinn(e.message);
                settFeil(true)
                abortController.abort()
            });
        return function cleanup() {
            abortController.abort();
        };
    }, []);

    if (organisasjoner !== null && organisasjonerMedTilgang !== null) {
        const context = organisasjoner.map(org => ({
                ...org,
                tilgang: organisasjonerMedTilgang.has(org.OrganizationNumber)
            }));

        return (
            <AltinnorganisasjonerContext.Provider value={context}>
                {props.children}
            </AltinnorganisasjonerContext.Provider>
        );
    } else if (feil) {
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

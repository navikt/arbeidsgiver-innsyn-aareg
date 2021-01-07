import React, { createContext, FunctionComponent, useContext, useEffect, useState } from 'react';
import { Organisasjon, tomaAltinnOrganisasjon } from './Objekter/OrganisasjonFraAltinn';
import { hentTidligereVirksomheter } from '../api/aaregApi';
import {
    loggInfoOmFeilTidligereOrganisasjoner
} from './amplitudefunksjonerForLogging';
import { AltinnorganisasjonerContext } from './AltinnorganisasjonerProvider';

export const SERVICEKODEINNSYNAAREGISTERET = '5441';
export const SERVICEEDITIONINNSYNAAREGISTERET = '1';

export const erGyldigOrganisasjon = (organisasjon: Organisasjon) => {
    return (
        organisasjon.Type === 'Enterprise' ||
        organisasjon.OrganizationForm === 'FLI' ||
        organisasjon.OrganizationForm === 'BEDR' || organisasjon.OrganizationForm === 'AAFY'
    );
};

type Context = {
    valgtAktivOrganisasjon: Organisasjon;
    setValgtAktivOrganisasjon: (org: Organisasjon) => void;
    tilgangArbeidsforhold: boolean;
    tilgangTilTidligereArbeidsforhold: boolean;
    setTilgangTilTidligereArbeidsforhold: (bool: boolean) => void;
    tidligereVirksomheter: Organisasjon[] | undefined;
};

export const OrganisasjonsdetaljerContext = createContext<Context>({} as Context);

export const OrganisasjonsdetaljerProvider: FunctionComponent = props => {
    const altinnorganisasjoner = useContext(AltinnorganisasjonerContext)

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


    const context: Context = {
        valgtAktivOrganisasjon,
        setValgtAktivOrganisasjon,
        tilgangArbeidsforhold,
        tilgangTilTidligereArbeidsforhold,
        setTilgangTilTidligereArbeidsforhold,
        tidligereVirksomheter
    };

    return (
        <OrganisasjonsdetaljerContext.Provider value={context}>
            {props.children}
        </OrganisasjonsdetaljerContext.Provider>
    );
};

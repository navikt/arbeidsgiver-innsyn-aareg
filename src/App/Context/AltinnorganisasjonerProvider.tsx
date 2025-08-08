import React, {
    createContext,
    FunctionComponent,
    PropsWithChildren,
    useEffect,
    useState,
} from 'react';
import { Organisasjon } from '../Objekter/OrganisasjonFraAltinn';
import {
    hentOrganisasjonerFraAltinn,
    hentOrganisasjonerMedTilgangTilAltinntjeneste,
} from '../../api/altinnApi';
import Lasteboks from '../GeneriskeKomponenter/Lasteboks';
import EnkelBanner from '../EnkelBanner/EnkelBanner';
import { Alert } from '@navikt/ds-react';

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

export type AltinnOrganisasjon = Organisasjon & { tilgang: boolean };
type Context = Array<AltinnOrganisasjon>;

export const AltinnorganisasjonerContext = createContext<Context>([]);

export const AltinnorganisasjonerProvider: FunctionComponent<PropsWithChildren> = (props) => {
    const [organisasjoner, settOrganisasjoner] = useState<null | Array<Organisasjon>>(null);
    const [organisasjonerMedTilgang, settOrganisasjonerMedTilgang] = useState<null | Set<string>>(
        null
    );
    const [feil, settFeil] = useState(false);

    useEffect(() => {
        hentOrganisasjonerFraAltinn()
            .then(settOrganisasjoner)
            .catch((e: Error) => {
                if (e.message === 'Forbidden') {
                    settOrganisasjoner([]);
                } else {
                    settFeil(true);
                }
            });

        hentOrganisasjonerMedTilgangTilAltinntjeneste(
            SERVICEKODEINNSYNAAREGISTERET,
            SERVICEEDITIONINNSYNAAREGISTERET
        )
            .then((organisasjonerMedTilgangFraAltinn) => {
                settOrganisasjonerMedTilgang(
                    new Set(
                        organisasjonerMedTilgangFraAltinn
                            .filter(erGyldigOrganisasjon)
                            .map((org) => org.OrganizationNumber)
                    )
                );
            })
            .catch((e: Error) => {
                if (e.message === 'Forbidden') {
                    settOrganisasjonerMedTilgang(new Set());
                } else {
                    settFeil(true);
                }
            });
    }, []);

    if (organisasjoner !== null && organisasjonerMedTilgang !== null) {
        const context = organisasjoner.map((org) => ({
            ...org,
            tilgang: organisasjonerMedTilgang.has(org.OrganizationNumber),
        }));

        return (
            <AltinnorganisasjonerContext.Provider value={context}>
                {props.children}
            </AltinnorganisasjonerContext.Provider>
        );
    } else if (feil) {
        return (
            <>
                <EnkelBanner />
                <div className="feilmelding-altinn">
                    <Alert variant="error">
                        Vi opplever ustabilitet med Altinn. Hvis du mener at du har roller i Altinn
                        kan du prøve å laste siden på nytt.
                    </Alert>
                </div>
            </>
        );
    } else {
        return (
            <>
                <EnkelBanner />
                <Lasteboks />
            </>
        );
    }
};

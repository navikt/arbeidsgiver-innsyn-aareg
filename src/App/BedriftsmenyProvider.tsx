import Bedriftsmeny from '@navikt/bedriftsmeny';
import React, { createContext, FunctionComponent, useCallback, useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps, useLocation } from 'react-router';
import { AltinnOrganisasjon, AltinnorganisasjonerContext } from './AltinnorganisasjonerProvider';
import { Organisasjon } from './Objekter/OrganisasjonFraAltinn';
import { hentTidligereVirksomheter } from '../api/aaregApi';
import { loggInfoOmFeilTidligereOrganisasjoner } from './amplitudefunksjonerForLogging';
import IngenTilgangInfo from './IngenTilgangInfo/IngenTilgangInfo';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';

interface Enhet {
    hovedenhet: AltinnOrganisasjon;
    underenhet: AltinnOrganisasjon;
}

interface Context extends Enhet {
    tidligereUnderenheter: Organisasjon[] | 'laster';
}

export const BedriftsmenyContext = createContext<Context>({} as Context);

const BedriftsmenyProvider: FunctionComponent<RouteComponentProps> = ({ children, history }) => {
    const altinnorganisasjoner = useContext(AltinnorganisasjonerContext);

    const finnOrg = useCallback(
        (orgnr: string): AltinnOrganisasjon | null =>
            altinnorganisasjoner.find(org => org.OrganizationNumber === orgnr) ?? null,
        [altinnorganisasjoner]
    );

    const orgnr = new URLSearchParams(useLocation().search).get('bedrift');

    const [enhet, settEnhet] = useState<Enhet | null>(null);
    const [tidligereUnderenheter, settTidligereUnderenheter] = useState<Organisasjon[] | 'laster'>([]);

    const tidligereArbeidsforhold = history.location.pathname.startsWith('/tidligere-arbeidsforhold');
    const sidetittel = tidligereArbeidsforhold ? 'Tidligere arbeidsforhold' : 'Arbeidsforhold';

    const tidligereUnderenheterFor =
        enhet !== null && enhet.hovedenhet.tilgang ? enhet.hovedenhet.OrganizationNumber : null;

    useEffect(() => {
        if (orgnr === null) {
            settEnhet(null);
        } else {
            const underenhet = finnOrg(orgnr);
            const hovedenhet = underenhet === null ? null : finnOrg(underenhet.ParentOrganizationNumber);
            if (hovedenhet === null || underenhet === null) {
                console.error('Bedriftsmeny byttet til ukjent organisasjon');
                settEnhet(null);
            } else {
                settEnhet({ underenhet, hovedenhet });
            }
        }
    }, [orgnr, finnOrg]);

    useEffect(() => {
        if (tidligereUnderenheterFor === null) {
            settTidligereUnderenheter([]);
        } else {
            settTidligereUnderenheter('laster');
            const abortController = new AbortController();
            hentTidligereVirksomheter(tidligereUnderenheterFor, abortController.signal)
                .then(settTidligereUnderenheter)
                .catch(loggInfoOmFeilTidligereOrganisasjoner);
            return () => abortController.abort();
        }
    }, [altinnorganisasjoner, tidligereUnderenheterFor]);

    return (
        <>
            <div className="hovebanner">
                <Bedriftsmeny
                    sidetittel={sidetittel}
                    organisasjoner={tidligereArbeidsforhold ? [] : altinnorganisasjoner}
                    onOrganisasjonChange={() => {}}
                    history={history}
                />
            </div>
            {altinnorganisasjoner.length === 0 ? (
                <IngenTilgangInfo />
            ) : enhet === null ? (
                /* TODO: her er det mulighet for at ingen tilgang-siden flasher før en org er når appen starter opp. */
                <IngenTilgangInfo />
            ) : (
                <BedriftsmenyContext.Provider value={{ ...enhet, tidligereUnderenheter }}>
                    {children}
                </BedriftsmenyContext.Provider>
            )}
        </>
    );
};

export default withRouter(BedriftsmenyProvider);

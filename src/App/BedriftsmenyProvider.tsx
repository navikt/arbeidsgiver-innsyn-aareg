import Bedriftsmeny from '@navikt/bedriftsmeny';
import React, { createContext, FunctionComponent, useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { AltinnOrganisasjon, AltinnorganisasjonerContext } from './AltinnorganisasjonerProvider';
import { Organisasjon } from './Objekter/OrganisasjonFraAltinn';
import { hentTidligereVirksomheter } from '../api/aaregApi';
import { loggInfoOmFeilTidligereOrganisasjoner } from './amplitudefunksjonerForLogging';
import IngenTilgangInfo from './IngenTilgangInfo/IngenTilgangInfo';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import Lasteboks from './Lasteboks';
import { useSearchParameters } from '../utils/UrlManipulation';
import emptyList from "./Objekter/EmptyList";

interface Enhet {
    hovedenhet: AltinnOrganisasjon | null;
    underenhet: AltinnOrganisasjon;
}

interface Context extends Enhet {
    tidligereUnderenheter: Organisasjon[] | 'laster';
}

export const BedriftsmenyContext = createContext<Context>({} as Context);

const BedriftsmenyProvider: FunctionComponent = ({ children}) => {
    const history = useHistory()
    const altinnorganisasjoner = useContext(AltinnorganisasjonerContext);
    const { getSearchParameter } = useSearchParameters();

    const [oppstart, settOppstart] = useState(true);
    const [context, settContext] = useState<Context | null>(null);
    const [enhet, settEnhet] = useState<Enhet | null>(null);
    const [tidligereUnderenheter, settTidligereUnderenheter] = useState<Organisasjon[] | 'laster'>('laster');

    const finnOrg = useCallback(
        (orgnr: string): AltinnOrganisasjon | null =>
            altinnorganisasjoner.find(org => org.OrganizationNumber === orgnr) ?? null,
        [altinnorganisasjoner]
    );

    const orgnr = getSearchParameter('bedrift');

    const tidligereArbeidsforhold = history.location.pathname.startsWith('/tidligere-arbeidsforhold');
    const sidetittel = tidligereArbeidsforhold ? 'Tidligere arbeidsforhold' : 'Arbeidsforhold';

    const tidligereUnderenheterFor =
        enhet !== null && enhet.hovedenhet !== null && enhet.hovedenhet.tilgang
            ? enhet.hovedenhet.OrganizationNumber
            : null;

    /* Det kan ta litt tid før bedriftsvelgeren setter default bedrift, så
     * de første sekundene anser vi som en oppstarts-periode hvor vi ikke
     * viser ingen-tilgang-siden.
     */
    useEffect(() => {
        const timeout = setTimeout(() => {
            settOppstart(false);
        }, 20_000);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (orgnr === null) {
            settEnhet(null);
        } else {
            const underenhet = finnOrg(orgnr);
            const hovedenhet = underenhet === null ? null : finnOrg(underenhet.ParentOrganizationNumber);
            if (underenhet === null) {
                console.error('Bedriftsmeny byttet til ukjent organisasjon');
                settEnhet(null);
            } else {
                settEnhet({ underenhet, hovedenhet });
            }
        }
    }, [orgnr, finnOrg]);

    useEffect(() => {
        if (tidligereUnderenheterFor === null) {
            settTidligereUnderenheter(emptyList);
        } else {
            settTidligereUnderenheter('laster');
            const abortController = new AbortController();
            hentTidligereVirksomheter(tidligereUnderenheterFor, abortController.signal)
                .then(enheter => {
                    settTidligereUnderenheter(enheter)
                })
                .catch(err => {
                    settTidligereUnderenheter(emptyList);
                    loggInfoOmFeilTidligereOrganisasjoner(err);
                });
            return () => abortController.abort();
        }
    }, [altinnorganisasjoner, tidligereUnderenheterFor]);

    useEffect(() => {
        if (enhet === null) {
            settContext(null);
        } else {
            settContext({ ...enhet, tidligereUnderenheter })
        }
    }, [settContext, enhet, tidligereUnderenheter]);

    return (
        <>
            <Bedriftsmeny
                sidetittel={sidetittel}
                organisasjoner={tidligereArbeidsforhold ? [] : altinnorganisasjoner}
                onOrganisasjonChange={({ OrganizationNumber }) => {
                    /* Bedriftsmenyen vil ved oppstart kalle hit, selv om det ikke er en
                     * endring i bedrift-parameteret. I så fall ønsker vi ikke å slette
                     * filter/søk-parameterene.
                     */
                    if (enhet?.underenhet.OrganizationNumber !== OrganizationNumber) {
                        history.replace({ pathname: '/', search: `bedrift=${OrganizationNumber}` });
                    }
                }}
                history={history}
            />
            {altinnorganisasjoner.length === 0 ? (
                <IngenTilgangInfo />
            ) : context === null ? (
                oppstart ? (
                    <Lasteboks />
                ) : (
                    <IngenTilgangInfo />
                )
            ) : (
                <BedriftsmenyContext.Provider value={context}>
                    {children}
                </BedriftsmenyContext.Provider>
            )}
        </>
    );
};

export default BedriftsmenyProvider;

import React, { createContext, FunctionComponent, useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import { AltinnOrganisasjon, AltinnorganisasjonerContext } from './AltinnorganisasjonerProvider';
import { Organisasjon } from '../Objekter/OrganisasjonFraAltinn';
import { hentTidligereVirksomheter } from '../../api/aaregApi';
import IngenTilgangInfo from '../IngenTilgangInfo/IngenTilgangInfo';
import Lasteboks from '../GeneriskeKomponenter/Lasteboks';
import { useSearchParameters } from '../../utils/UrlManipulation';
import emptyList from '../Objekter/EmptyList';
import { NotifikasjonWidget } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { gittMiljø } from '../../utils/environment';

interface Enhet {
    hovedenhet: AltinnOrganisasjon | null;
    underenhet: AltinnOrganisasjon;
}

interface Context extends Enhet {
    tidligereUnderenheter: Organisasjon[] | 'laster';
}

export const BedriftsmenyContext = createContext<Context>({} as Context);

const BedriftsmenyProvider: FunctionComponent = ({ children }) => {
    const history = useHistory();
    const altinnorganisasjoner: Array<AltinnOrganisasjon> = useContext(AltinnorganisasjonerContext);
    const { getSearchParameter } = useSearchParameters();

    const [oppstart, settOppstart] = useState(true);
    const [context, settContext] = useState<Context | null>(null);
    const [enhet, settEnhet] = useState<Enhet | null>(null);
    const [tidligereUnderenheter, settTidligereUnderenheter] = useState<Organisasjon[] | 'laster'>('laster');

    const finnOrg = useCallback(
        (orgnr: string): AltinnOrganisasjon | null =>
            altinnorganisasjoner.find((org) => org.OrganizationNumber === orgnr) ?? null,
        [altinnorganisasjoner]
    );

    const orgnrFraUrl = getSearchParameter('bedrift');

    const tidligereArbeidsforhold = history.location.pathname.startsWith('/tidligere-arbeidsforhold');
    const sidetittel = tidligereArbeidsforhold ? 'Tidligere arbeidsforhold' : 'Arbeidsforhold';

    const tidligereUnderenheterFor =
        enhet !== null && enhet.hovedenhet !== null && enhet.hovedenhet.tilgang
            ? enhet.hovedenhet.OrganizationNumber
            : null;

    const miljø = gittMiljø<'local' | 'labs' | 'dev' | 'prod'>({
        prod: 'prod',
        dev: 'dev',
        labs: 'labs',
        other: 'local'
    });

    const lasteboksEllerIngenTilgang = (visLasteBoks: boolean) => {
        if (visLasteBoks) {
            return <Lasteboks />;
        }
        return <IngenTilgangInfo />;
    };
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
        if (orgnrFraUrl === null) {
            settEnhet(null);
        } else {
            const underenhet = finnOrg(orgnrFraUrl);
            const hovedenhet = underenhet === null ? null : finnOrg(underenhet.ParentOrganizationNumber);
            if (underenhet === null) {
                console.error('Bedriftsmeny byttet til ukjent organisasjon');
                settEnhet(null);
            } else {
                settEnhet({ underenhet, hovedenhet });
            }
        }
    }, [orgnrFraUrl, finnOrg]);

    useEffect(() => {
        if (tidligereUnderenheterFor === null) {
            settTidligereUnderenheter(emptyList);
        } else {
            settTidligereUnderenheter('laster');
            const abortController = new AbortController();
            hentTidligereVirksomheter(tidligereUnderenheterFor, abortController.signal)
                .then((enheter) => {
                    settTidligereUnderenheter(enheter);
                })
                .catch((err) => {
                    settTidligereUnderenheter(emptyList);
                });
            return () => abortController.abort();
        }
    }, [altinnorganisasjoner, tidligereUnderenheterFor]);

    useEffect(() => {
        if (enhet === null) {
            settContext(null);
        } else {
            settContext({ ...enhet, tidligereUnderenheter });
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
            >
                <NotifikasjonWidget miljo={miljø} />
            </Bedriftsmeny>
            {altinnorganisasjoner.length === 0 || context === null ? (
                lasteboksEllerIngenTilgang(oppstart)
            ) : (
                <BedriftsmenyContext.Provider value={context}>{children}</BedriftsmenyContext.Provider>
            )}
        </>
    );
};

export default BedriftsmenyProvider;

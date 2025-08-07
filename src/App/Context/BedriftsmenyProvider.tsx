import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type FunctionComponent,
    type PropsWithChildren,
} from 'react';
import { useLocation } from 'react-router-dom';
import Bedriftsmeny, {
    Organisasjon as BedriftsmenyOrganisasjon,
} from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';

import { AltinnOrganisasjon, AltinnorganisasjonerContext } from './AltinnorganisasjonerProvider';
import { Organisasjon } from '../Objekter/OrganisasjonFraAltinn';
import { hentTidligereVirksomheter } from '../../api/aaregApi';
import IngenTilgangInfo from '../IngenTilgangInfo/IngenTilgangInfo';
import Lasteboks from '../GeneriskeKomponenter/Lasteboks';
import { useReplace, useSearchParameters } from '../../utils/UrlManipulation';
import { NotifikasjonWidget } from '@navikt/arbeidsgiver-notifikasjon-widget';


interface Enhet {
    hovedenhet: AltinnOrganisasjon | null;
    underenhet: AltinnOrganisasjon;
}

interface Context extends Enhet {
    tidligereUnderenheter: Organisasjon[] | 'laster';
}

export const BedriftsmenyContext = createContext<Context>({} as Context);

const useOppstart = (ms: number) => {
    const [oppstart, setOppstart] = useState(true);
    useEffect(() => {
        const t = setTimeout(() => setOppstart(false), ms);
        return () => clearTimeout(t);
    }, [ms]);
    return oppstart;
};

const useEnhet = (orgnrFraUrl: string | null, finnOrg: (orgnr: string) => AltinnOrganisasjon | null): Enhet | null => {
    const [enhet, setEnhet] = useState<Enhet | null>(null);

    useEffect(() => {
        if (orgnrFraUrl == null || orgnrFraUrl === '') {
            setEnhet(null);
            return;
        }

        const underenhet = finnOrg(orgnrFraUrl);
        const hovedenhet = underenhet ? finnOrg(underenhet.ParentOrganizationNumber) : null;

        if (!underenhet) {
            console.error('Bedriftsmeny byttet til ukjent organisasjon');
            return setEnhet(null);
        }

        setEnhet({ underenhet, hovedenhet });
    }, [orgnrFraUrl, finnOrg]);

    return enhet;
};

const useTidligereUnderenheter = (orgnr: string | null) => {
    const [data, setData] = useState<Organisasjon[] | 'laster'>('laster');

    useEffect(() => {
        if (orgnr == null || orgnr === '') {
            setData([]);
            return;
        }

        setData('laster');
        hentTidligereVirksomheter(orgnr)
            .then(setData)
            .catch(() => setData([]));
    }, [orgnr]);

    return data;
};

const BedriftsmenyProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const replace = useReplace();
    const location = useLocation();
    const altinnorganisasjoner = useContext(AltinnorganisasjonerContext);
    const { getSearchParameter } = useSearchParameters();

    const orgnrFraUrl = getSearchParameter('bedrift');
    const tidligereArbeidsforhold = location.pathname.startsWith('/tidligere-arbeidsforhold');
    const sidetittel = tidligereArbeidsforhold ? 'Tidligere arbeidsforhold' : 'Arbeidsforhold';

    const finnOrg = useCallback(
        (orgnr: string) => altinnorganisasjoner.find(org => org.OrganizationNumber === orgnr) ?? null,
        [altinnorganisasjoner]
    );

    const oppstart = useOppstart(20_000);
    const enhet = useEnhet(orgnrFraUrl, finnOrg);

    const tidligereUnderenheterFor =
        enhet?.hovedenhet?.tilgang === true
            ? enhet.hovedenhet.OrganizationNumber
            : null;

    const tidligereUnderenheter = useTidligereUnderenheter(tidligereUnderenheterFor);

    const context: Context | null = enhet
        ? { ...enhet, tidligereUnderenheter }
        : null;

    const handleOrganisasjonChange = (organisasjon: BedriftsmenyOrganisasjon) => {
        const { OrganizationNumber } = organisasjon;

        const fullOrg = altinnorganisasjoner.find(
            (org) => org.OrganizationNumber === OrganizationNumber
        );

        if (fullOrg && enhet?.underenhet.OrganizationNumber !== OrganizationNumber) {
            replace({
                pathname: location.pathname + '/',
                search: `bedrift=${OrganizationNumber}`,
            });
        }
    };

    const skalViseInnhold = altinnorganisasjoner.length > 0 && context !== null;

    return (
        <>
            <Bedriftsmeny
                sidetittel={sidetittel}
                organisasjoner={tidligereArbeidsforhold ? [] : altinnorganisasjoner}
                onOrganisasjonChange={handleOrganisasjonChange}
            >
                <NotifikasjonWidget />
            </Bedriftsmeny>

            {skalViseInnhold ? (
                <BedriftsmenyContext.Provider value={context}>
                    {children}
                </BedriftsmenyContext.Provider>
            ) : oppstart ? (
                <Lasteboks />
            ) : (
                <IngenTilgangInfo />
            )}
        </>
    );
};

export default BedriftsmenyProvider;

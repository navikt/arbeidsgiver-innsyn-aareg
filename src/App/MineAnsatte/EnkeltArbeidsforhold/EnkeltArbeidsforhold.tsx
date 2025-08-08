import React, { FunctionComponent, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DetaljertArbeidsforhold } from '@navikt/arbeidsforhold';
import { gittMiljo } from '../../../utils/environment';
import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';
import { useReplace, useSearchParameters } from '../../../utils/UrlManipulation';
import { BedriftsmenyContext } from '../../Context/BedriftsmenyProvider';
import { FiltrerteOgSorterteArbeidsforholdContext } from '../../Context/FiltrerteOgSorterteArbeidsforholdProvider';
import IngenTilgangInfo from '../../IngenTilgangInfo/IngenTilgangInfo';
import EnkeltArbeidsforholdVarselVisning from './EnkeltArbeidsforholdVarselVisning/EnkeltArbeidsforholdVarselVisning';
import Brodsmulesti from '../../Brodsmulesti/Brodsmulesti';
import './EnkeltArbeidsforhold.css';
import { Alert, BodyShort, Heading } from '@navikt/ds-react';
import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';

const miljø = gittMiljo<'PROD' | 'DEV' | 'LOCAL'>({
    prod: 'PROD',
    dev: 'DEV',
    other: 'LOCAL',
});

const apiURL = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/arbeidsforhold/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver/{id}',
    dev: 'https://arbeidsforhold.intern.dev.nav.no/arbeidsforhold/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver/{id}',
    other: '/arbeidsforhold/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver/{id}',
});

const EnkeltArbeidsforhold: FunctionComponent = () => {
    const replace = useReplace();
    const location = useLocation();
    const { underenhet } = useContext(BedriftsmenyContext);
    const { aareg } = useContext(FiltrerteOgSorterteArbeidsforholdContext);
    const { setSearchParameter, getSearchParameter } = useSearchParameters();
    const redirectTilbake = () => {
        const params = new URLSearchParams(location.search);
        params.delete('arbeidsforhold');
        replace({ search: params.toString(), pathname: '..' }, { relative: 'path' });
    };

    const redirectTilArbeidsforhold = (arbeidsforhold: Arbeidsforhold) => {
        setSearchParameter({ arbeidsforhold: arbeidsforhold.navArbeidsforholdId });
    };

    const arbeidsforholdIdFraUrl = getSearchParameter('arbeidsforhold');
    window.scrollTo(0, 0);

    useEffect(() => {
        if (arbeidsforholdIdFraUrl === null) {
            redirectTilbake();
        }
    });

    const filtrertOgSortertListe: Arbeidsforhold[] =
        aareg?.lastestatus?.status === 'ferdig' ? aareg.lastestatus.arbeidsforhold : [];
    const indeksValgtArbeidsforhold = filtrertOgSortertListe.findIndex(
        (arbeidsforhold) => arbeidsforhold.navArbeidsforholdId === arbeidsforholdIdFraUrl
    );

    const nesteArbeidsforhold: Arbeidsforhold | undefined =
        filtrertOgSortertListe[indeksValgtArbeidsforhold + 1];
    const forrigeArbeidsforhold: Arbeidsforhold | undefined =
        filtrertOgSortertListe[indeksValgtArbeidsforhold - 1];
    const valgtArbeidsforhold: Arbeidsforhold | undefined =
        filtrertOgSortertListe[indeksValgtArbeidsforhold];

    return (
        <div className="enkelt-arbeidsforhold-container">
            <Brodsmulesti valgtOrg={underenhet.OrganizationNumber} />
            <div className="enkelt-arbeidsforhold-innhold">
                <div className="enkelt-arbeidsforhold-innhold__topp">
                    <button className="brodsmule" onClick={redirectTilbake}>
                        <ChevronLeftIcon />
                        <BodyShort>Tilbake til liste</BodyShort>
                    </button>
                    <div className="enkelt-arbeidsforhold-innhold__fram-tilbake-knapp">
                        {forrigeArbeidsforhold !== undefined && (
                            <button
                                className="brodsmule"
                                onClick={() => redirectTilArbeidsforhold(forrigeArbeidsforhold)}
                            >
                                <ChevronLeftIcon />
                                <BodyShort>Forrige</BodyShort>
                            </button>
                        )}
                        {nesteArbeidsforhold !== undefined && (
                            <button
                                className="brodsmule"
                                onClick={() => redirectTilArbeidsforhold(nesteArbeidsforhold)}
                            >
                                <BodyShort>Neste</BodyShort>
                                <ChevronRightIcon />
                            </button>
                        )}
                    </div>
                </div>

                {aareg === null || aareg?.lastestatus?.status === 'ikke-tilgang' ? (
                    <IngenTilgangInfo underenhet={underenhet} />
                ) : valgtArbeidsforhold === undefined ? (
                    <Alert variant="warning">Arbeidsforhold ikke funnet</Alert>
                ) : (
                    <div className="enkelt-arbeidsforhold">
                        <EnkeltArbeidsforholdVarselVisning
                            valgtArbeidsforhold={valgtArbeidsforhold}
                        />
                        <div className="af-detaljert__header">
                            <span className="af-detaljert__kolonne">
                                <div className="af-detaljert__arbeidsgiver">
                                    <Heading size="small">
                                        {valgtArbeidsforhold.arbeidstaker.navn}
                                    </Heading>
                                    <BodyShort>
                                        Fødselsnummer:{' '}
                                        {valgtArbeidsforhold.arbeidstaker.offentligIdent}
                                    </BodyShort>
                                </div>
                            </span>
                        </div>
                        <DetaljertArbeidsforhold
                            locale="nb"
                            miljo={miljø}
                            navArbeidsforholdId={parseInt(valgtArbeidsforhold.navArbeidsforholdId)}
                            rolle="ARBEIDSGIVER"
                            fnrArbeidstaker={valgtArbeidsforhold.arbeidstaker.offentligIdent}
                            customApiUrl={apiURL}
                            printActivated={true}
                            printName={valgtArbeidsforhold.arbeidstaker.navn}
                            printSSN={valgtArbeidsforhold.arbeidstaker.offentligIdent}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnkeltArbeidsforhold;

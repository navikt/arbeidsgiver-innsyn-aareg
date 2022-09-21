import React, { FunctionComponent, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DetaljertArbeidsforhold } from '@navikt/arbeidsforhold';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Chevron from 'nav-frontend-chevron';
import { gittMiljø } from '../../../utils/environment';
import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';
import { useSearchParameters } from '../../../utils/UrlManipulation';
import { BedriftsmenyContext } from '../../Context/BedriftsmenyProvider';
import { FiltrerteOgSorterteArbeidsforholdContext } from '../../Context/FiltrerteOgSorterteArbeidsforholdProvider';
import IngenTilgangInfo from '../../IngenTilgangInfo/IngenTilgangInfo';
import EnkeltArbeidsforholdVarselVisning from './EnkeltArbeidsforholdVarselVisning/EnkeltArbeidsforholdVarselVisning';
import Brodsmulesti from '../../Brodsmulesti/Brodsmulesti';
import './EnkeltArbeidsforhold.less';


const miljø = gittMiljø<'PROD' | 'DEV' | 'LOCAL'>({
    prod: 'PROD',
    dev: 'DEV',
    other: 'LOCAL',
});

const apiURL = gittMiljø({
    prod: 'https://arbeidsgiver.nav.no/arbeidsforhold/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver/{id}',
    other: 'https://arbeidsforhold.dev.nav.no/arbeidsforhold/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver/{id}'
});

const EnkeltArbeidsforhold: FunctionComponent = () => {
    const navigate = useNavigate();
    const loc = useLocation()
    const { underenhet } = useContext(BedriftsmenyContext);
    const aareg = useContext(FiltrerteOgSorterteArbeidsforholdContext);
    const { setSearchParameter, getSearchParameter } = useSearchParameters();
    const redirectTilbake = () => {
        const params = new URLSearchParams(loc.search);
        params.delete('arbeidsforhold');
        navigate({ search: params.toString(), pathname: '..' },{replace:true});
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

    const nesteArbeidsforhold: Arbeidsforhold | undefined = filtrertOgSortertListe[indeksValgtArbeidsforhold + 1];
    const forrigeArbeidsforhold: Arbeidsforhold | undefined = filtrertOgSortertListe[indeksValgtArbeidsforhold - 1];
    const valgtArbeidsforhold: Arbeidsforhold | undefined = filtrertOgSortertListe[indeksValgtArbeidsforhold];

    return (
        <div className="enkelt-arbeidsforhold-container">
            <Brodsmulesti valgtOrg={underenhet.OrganizationNumber} />
            <div className="enkelt-arbeidsforhold-innhold">
                <div className="enkelt-arbeidsforhold-innhold__topp">
                    <button className="brodsmule" onClick={redirectTilbake}>
                        <Chevron type="venstre" />
                        <Normaltekst>Tilbake til liste</Normaltekst>
                    </button>
                    <div className="enkelt-arbeidsforhold-innhold__fram-tilbake-knapp">
                        {forrigeArbeidsforhold && (
                            <button
                                className="brodsmule"
                                onClick={() => redirectTilArbeidsforhold(forrigeArbeidsforhold)}
                            >
                                <Chevron type="venstre" />
                                <Normaltekst>Forrige</Normaltekst>
                            </button>
                        )}
                        {nesteArbeidsforhold && (
                            <button
                                className="brodsmule"
                                onClick={() => redirectTilArbeidsforhold(nesteArbeidsforhold)}
                            >
                                <Normaltekst>Neste</Normaltekst>
                                <Chevron type={'høyre'} />
                            </button>
                        )}
                    </div>
                </div>

                {aareg === null || aareg?.lastestatus?.status === 'ikke-tilgang' ? (
                    <IngenTilgangInfo underenhet={underenhet} />
                ) : valgtArbeidsforhold === undefined ? (
                    <AlertStripeAdvarsel>Arbeidsforhold ikke funnet</AlertStripeAdvarsel>
                ) : (
                    <div className="enkelt-arbeidsforhold">
                        <EnkeltArbeidsforholdVarselVisning valgtArbeidsforhold={valgtArbeidsforhold} />
                        <div className="af-detaljert__header">
                            <span className="af-detaljert__kolonne">
                                <div className="af-detaljert__arbeidsgiver">
                                    <Undertittel>{valgtArbeidsforhold.arbeidstaker.navn}</Undertittel>
                                    <Normaltekst>
                                        Fødselsnummer: {valgtArbeidsforhold.arbeidstaker.offentligIdent}
                                    </Normaltekst>
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

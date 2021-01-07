import React, { FunctionComponent, useContext, useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Systemtittel, Element } from 'nav-frontend-typografi';
import { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';
import Chevron from 'nav-frontend-chevron';
import { APISTATUS } from '../../api/api-utils';
import { Arbeidsforhold } from '../Objekter/ArbeidsForhold';
import { Organisasjon, tomaAltinnOrganisasjon } from '../Objekter/OrganisasjonFraAltinn';
import { OrganisasjonerOgTilgangerContext } from '../OrganisasjonerOgTilgangerProvider';
import { lagListeBasertPaUrl } from './sorteringOgFiltreringsFunksjoner';
import { regnUtantallSider, regnUtArbeidsForholdSomSkalVisesPaEnSide } from './pagineringsFunksjoner';
import Progressbar from './Progressbar/Progressbar';
import MineAnsatteTopp from './MineAnsatteTopp/MineAnsatteTopp';
import TabellMineAnsatte from './TabellMineAnsatte/TabellMineAnsatte';
import ListeMedAnsatteForMobil from './ListeMineAnsatteForMobil/ListeMineAnsatteForMobil';
import SideBytter from './SideBytter/SideBytter';
import VelgTidligereVirksomhet from './VelgTidligereVirksomhet/VelgTidligereVirksomhet';
import { nullStillSorteringIUrlParametere } from './urlFunksjoner';
import { loggTrykketPåTidligereArbeidsforholdSide } from '../amplitudefunksjonerForLogging';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import { MAKS_ANTALL_ARBEIDSFORHOLD } from '../ArbeidsforholdRoutes';
import './MineAnsatte.less';

export enum SorteringsAttributt {
    NAVN,
    FNR,
    YRKE,
    STARTDATO,
    SLUTTDATO,
    VARSEL,
    PERMITTERINGSPROSENT,
    STILLINGSPROSENT
}

const forMangeArbeidsforholdTekst = (antall: number, valgtVirksomhet: String) => {
    return (
        <>
            <Element>For mange arbeidsforhold</Element>
            {'Vi har ikke kapasitet til å hente flere enn ' +
                MAKS_ANTALL_ARBEIDSFORHOLD +
                ' avsluttede eller aktive arbeidsforhold om gangen. '}
            {'Vi jobber med å forbedre systemet slik at flere arbeidsforhold kan vises.'}
            <br />
            <br />
            {'Du har ' + antall + ' aktive eller avsluttede arbeidsforhold registrert på ' + valgtVirksomhet + '.'}
        </>
    );
};

interface Props extends RouteComponentProps {
    valgtTidligereVirksomhet: Organisasjon;
    hentOgSetAntallOgArbeidsforhold: (organisasjon: Organisasjon, erTidligereArbeidsforhold: boolean) => void;
    listeMedArbeidsforholdFraAareg: Arbeidsforhold[];
    antallArbeidsforhold: number;
    visProgressbar: boolean;
    setVisProgressbar: (skalVises: boolean) => void;
    aaregLasteState: APISTATUS;
    feilkodeFraAareg: string;
    antallArbeidsforholdUkjent: boolean;
    nåværendeUrlString: string;
    setNåværendeUrlString: (endret: string) => void;
    setTidligereVirksomhet: (tidligereVirksomhet: Organisasjon) => void;
}

const MineAnsatte: FunctionComponent<Props> = ({
    history,
    listeMedArbeidsforholdFraAareg,
    antallArbeidsforhold,
    antallArbeidsforholdUkjent,
    visProgressbar,
    setVisProgressbar,
    aaregLasteState,
    feilkodeFraAareg,
    nåværendeUrlString,
    setNåværendeUrlString,
    hentOgSetAntallOgArbeidsforhold,
    valgtTidligereVirksomhet,
    setTidligereVirksomhet,
}) => {
    const {
        valgtAktivOrganisasjon,
        organisasjonerFraAltinn,
        tilgangTilTidligereArbeidsforhold,
        tidligereVirksomheter
    } = useContext(OrganisasjonerOgTilgangerContext);

    const naVærendeUrl = new URL(nåværendeUrlString);
    const sidetall = naVærendeUrl.searchParams.get('side') || '1';

    const ARBEIDSFORHOLDPERSIDE = 25;
    const ERPATIDLIGEREARBEIDSFORHOLD = naVærendeUrl.toString().includes('tidligere-arbeidsforhold');
    const TILGANGTILTIDLIGEREARBEIDSFORHOLD =
        tilgangTilTidligereArbeidsforhold && tidligereVirksomheter && tidligereVirksomheter.length > 0;
    const forMangeArbeidsforhold = antallArbeidsforhold >= MAKS_ANTALL_ARBEIDSFORHOLD;

    const valgtJuridiskEnhet = organisasjonerFraAltinn.filter(
        organisasjon => organisasjon.OrganizationNumber === valgtAktivOrganisasjon.ParentOrganizationNumber
    )[0];

    const delOverskrift = 'Opplysninger for ';
    const overskriftMedOrganisasjonsdel = ERPATIDLIGEREARBEIDSFORHOLD
        ? delOverskrift + valgtJuridiskEnhet.Name + ' org.nr ' + valgtJuridiskEnhet.OrganizationNumber
        : delOverskrift + valgtAktivOrganisasjon.Name;

    const setSideTallIUrlOgGenererListe = (indeks: number) => {
        setParameterIUrl('side', indeks.toString());
    };

    const setParameterIUrl = (parameter: string, variabel: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set(parameter, variabel);
        const { search } = url;
        history.replace({ search: search });
        setNåværendeUrlString(url.toString());
    };

    const setTidligereVirksomhetHentArbeidsforholdOgNullstillUrlParametere = (organisasjon: Organisasjon) => {
        setTidligereVirksomhet(organisasjon);
        hentOgSetAntallOgArbeidsforhold(organisasjon, true);
        const search = nullStillSorteringIUrlParametere();
        history.replace({ search: search });
        setParameterIUrl('tidligereVirksomhet', organisasjon.OrganizationNumber);
    };

    useEffect(() => {
        if (ERPATIDLIGEREARBEIDSFORHOLD) {
            loggTrykketPåTidligereArbeidsforholdSide(listeMedArbeidsforholdFraAareg);
        }
    }, [ERPATIDLIGEREARBEIDSFORHOLD, listeMedArbeidsforholdFraAareg]);

    const filtrertOgSortertListe: Arbeidsforhold[] = lagListeBasertPaUrl(listeMedArbeidsforholdFraAareg);
    const antallSider = regnUtantallSider(ARBEIDSFORHOLDPERSIDE, filtrertOgSortertListe.length);
    const listeForNåværendeSidetall = regnUtArbeidsForholdSomSkalVisesPaEnSide(
        parseInt(sidetall),
        ARBEIDSFORHOLDPERSIDE,
        filtrertOgSortertListe
    );

    const redirectTilTidligereArbeidsforhold = () => {
        const search = nullStillSorteringIUrlParametere();
        history.replace({ search: search, pathname: 'tidligere-arbeidsforhold' });
        valgtTidligereVirksomhet !== tomaAltinnOrganisasjon &&
            hentOgSetAntallOgArbeidsforhold(valgtTidligereVirksomhet, true);
        setNåværendeUrlString(window.location.href);
    };

    const redirectTilbake = () => {
        hentOgSetAntallOgArbeidsforhold(valgtAktivOrganisasjon, false);
        const search = nullStillSorteringIUrlParametere();
        history.replace({ search: search, pathname: '/' });
    };

    const antallVarsler = listeMedArbeidsforholdFraAareg.filter(forhold => {
        return forhold.varsler;
    }).length;

    const feilmeldingtekst = () => {
        switch (feilkodeFraAareg) {
            case '408':
                return 'Det oppstod en feil da vi prøvde å hente dine arbeidsforhold. Prøv å laste siden på nytt eller kontakte brukerstøtte hvis problemet vedvarer.';
            case '403':
                return 'ikke tilgang til forespurt entitet i Aa-reg, Vi opplever problemer med å hente opplysninger, kontakt brukerstøtte dersom du mener du har tilgang';
            default:
                return 'Vi opplever ustabilitet med Aa-registret. Prøv å laste siden på nytt eller kontakte brukerstøtte hvis problemet vedvarer.';
        }
    };

    return (
        <div className="bakgrunnsside">
            <div className="innhold-container">
                <Brodsmulesti valgtOrg={valgtAktivOrganisasjon.OrganizationNumber}/>
                {ERPATIDLIGEREARBEIDSFORHOLD && (
                    <div className="brodsmule venstre">
                        <button className="brodsmule__direct-tidligere-arbeidsforhold" onClick={redirectTilbake}>
                            <Chevron type="venstre" />
                            Tilbake til arbeidsforhold
                        </button>
                    </div>
                )}
                {!ERPATIDLIGEREARBEIDSFORHOLD && TILGANGTILTIDLIGEREARBEIDSFORHOLD && (
                    <div className="brodsmule hoyre">
                        <button
                            className="brodsmule__direct-tidligere-arbeidsforhold"
                            onClick={() => {
                                redirectTilTidligereArbeidsforhold();
                            }}
                        >
                            {'Arbeidsforhold i tidligere virksomheter for ' + valgtJuridiskEnhet.Name}
                            <Chevron type="høyre" />
                        </button>
                    </div>
                )}
                <div className="mine-ansatte">
                    <Systemtittel className="mine-ansatte__systemtittel">
                        {overskriftMedOrganisasjonsdel}
                    </Systemtittel>
                    {ERPATIDLIGEREARBEIDSFORHOLD && !visProgressbar && (
                        <VelgTidligereVirksomhet
                            redirectTilbake={redirectTilbake}
                            valgtTidligereVirksomhet={valgtTidligereVirksomhet}
                            tidligereVirksomheter={tidligereVirksomheter}
                            setTidligereVirksomhet={setTidligereVirksomhetHentArbeidsforholdOgNullstillUrlParametere}
                        />
                    )}
                    {(antallArbeidsforhold > 0 || antallArbeidsforholdUkjent) &&
                        visProgressbar &&
                        aaregLasteState !== APISTATUS.FEILET &&
                        !forMangeArbeidsforhold && (
                            <Progressbar
                                antallArbeidsforholdUkjent={antallArbeidsforholdUkjent}
                                antall={antallArbeidsforhold}
                                setSkalvises={setVisProgressbar}
                                erFerdigLastet={aaregLasteState === APISTATUS.OK}
                                startTid={new Date().getTime()}
                            />
                        )}
                    {aaregLasteState === APISTATUS.OK && !visProgressbar && !forMangeArbeidsforhold && (
                        <MineAnsatteTopp
                            setParameterIUrl={setParameterIUrl}
                            valgtOrganisasjon={valgtAktivOrganisasjon}
                            antallSider={antallSider}
                            antallVarsler={antallVarsler}
                            filtrertOgSortertListe={filtrertOgSortertListe}
                            alleArbeidsforhold={listeMedArbeidsforholdFraAareg}
                        />
                    )}

                    {aaregLasteState === APISTATUS.OK &&
                        listeForNåværendeSidetall.length > 0 &&
                        !visProgressbar &&
                        !forMangeArbeidsforhold && (
                            <>
                                <TabellMineAnsatte
                                    setParameterIUrl={setParameterIUrl}
                                    listeMedArbeidsForhold={listeForNåværendeSidetall}
                                    byttSide={setSideTallIUrlOgGenererListe}
                                />
                                <ListeMedAnsatteForMobil
                                    className="mine-ansatte__liste"
                                    listeMedArbeidsForhold={listeForNåværendeSidetall}
                                />
                                {antallSider > 1 && (
                                    <SideBytter
                                        plassering="nederst"
                                        className="nedre-sidebytter"
                                        setParameterIUrl={setParameterIUrl}
                                        antallSider={antallSider}
                                    />
                                )}
                            </>
                        )}
                    {aaregLasteState === APISTATUS.FEILET && (
                        <div className="mine-ansatte__feilmelding-aareg">
                            <AlertStripeFeil>{feilmeldingtekst()}</AlertStripeFeil>
                        </div>
                    )}
                    {forMangeArbeidsforhold && (
                        <div className="mine-ansatte__feilmelding-aareg">
                            <AlertStripeAdvarsel>
                                {' '}
                                {forMangeArbeidsforholdTekst(antallArbeidsforhold, valgtAktivOrganisasjon.Name)}
                            </AlertStripeAdvarsel>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default withRouter(MineAnsatte);

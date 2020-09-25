import React, {FunctionComponent, useContext} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Normaltekst, Systemtittel, Element } from 'nav-frontend-typografi';
import { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';
import Chevron from 'nav-frontend-chevron';
import Lenke from 'nav-frontend-lenker';
import { APISTATUS } from '../../api/api-utils';
import { Arbeidsforhold } from '../Objekter/ArbeidsForhold';
import {Organisasjon, tomaAltinnOrganisasjon} from '../Objekter/OrganisasjonFraAltinn';
import { linkTilMinSideArbeidsgiver } from '../lenker';
import {
    lagListeBasertPaUrl
} from './sorteringOgFiltreringsFunksjoner';
import { regnUtantallSider, regnUtArbeidsForholdSomSkalVisesPaEnSide } from './pagineringsFunksjoner';
import Progressbar from './Progressbar/Progressbar';
import MineAnsatteTopp from './MineAnsatteTopp/MineAnsatteTopp';
import TabellMineAnsatte from './TabellMineAnsatte/TabellMineAnsatte';
import ListeMedAnsatteForMobil from './ListeMineAnsatteForMobil/ListeMineAnsatteForMobil';
import SideBytter from './SideBytter/SideBytter';
import './MineAnsatte.less';
import VelgTidligereVirksomhet from "./VelgTidligereVirksomhet/VelgTidligereVirksomhet";
import {nullStillSorteringIUrlParametere} from "./urlFunksjoner";
import {MAKS_ANTALL_ARBEIDSFORHOLD} from "../App";
import {Feature, FeatureToggleContext} from "../FeatureToggleProvider";

interface Props extends RouteComponentProps {
    valgtAktivOrganisasjon: Organisasjon;
    valgtTidligereVirksomhet: Organisasjon;
    organisasjonerFraAltinn: Organisasjon[];
    hentOgSetAntallOgArbeidsforhold: (organisasjon: Organisasjon) => void;
    listeMedArbeidsforholdFraAareg: Arbeidsforhold[];
    antallArbeidsforhold: number;
    visProgressbar: boolean;
    setVisProgressbar: (skalVises: boolean) => void;
    aaregLasteState: APISTATUS;
    feilkodeFraAareg: string;
    antallArbeidsforholdUkjent: boolean;
    setNåværendeUrlString: (endret: string) => void;
    nåværendeUrlString: string;
    tilgangTilTidligereArbeidsforhold: boolean,
    setTidligereVirksomhet: (tidligereVirksomhet: Organisasjon) => void;
    tidligereVirksomheter?: Organisasjon[];
}

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

export interface KolonneState {
    erValgt: boolean;
    sorteringsAttributt: SorteringsAttributt;
    reversSortering: boolean;
}

const forMangeArbeidsforholdTekst = (antall: number, valgtVirksomhet: String) => {
    return (
        <>
            <Element>For mange arbeidsforhold</Element>
            {'Vi har ikke kapasitet til å hente flere enn ' + MAKS_ANTALL_ARBEIDSFORHOLD + ' avsluttede eller aktive arbeidsforhold om gangen. '}
            {'Vi jobber med å forbedre systemet slik at flere arbeidsforhold kan vises.'}
            <br />
            <br />
            {'Du har ' + antall + ' aktive eller avsluttede arbeidsforhold registrert på ' + valgtVirksomhet + '.'}
        </>
    );
};

const MineAnsatte: FunctionComponent<Props> = ({
    history,
    valgtAktivOrganisasjon,
    listeMedArbeidsforholdFraAareg,
    antallArbeidsforhold,
    antallArbeidsforholdUkjent,
    setVisProgressbar,
    visProgressbar,
    aaregLasteState,
    feilkodeFraAareg,
    setNåværendeUrlString,
    setTidligereVirksomhet,
    hentOgSetAntallOgArbeidsforhold,
    tidligereVirksomheter,
    valgtTidligereVirksomhet,
    organisasjonerFraAltinn,
    tilgangTilTidligereArbeidsforhold,
}) => {
    const naVærendeUrl = new URL(window.location.href);
    const sidetall = naVærendeUrl.searchParams.get('side') || '1';

    const ARBEIDSFORHOLDPERSIDE = 25;
    const ERPATIDLIGEREARBEIDSFORHOLD = naVærendeUrl.toString().includes('tidligere-arbeidsforhold')
    const TILGANGTILTIDLIGEREARBEIDSFORHOLD = tilgangTilTidligereArbeidsforhold && tidligereVirksomheter && tidligereVirksomheter.length>0;
    const forMangeArbeidsforhold = antallArbeidsforhold >= MAKS_ANTALL_ARBEIDSFORHOLD;

    const valgtJuridiskEnhet = organisasjonerFraAltinn.filter(organisasjon => organisasjon.OrganizationNumber === valgtAktivOrganisasjon.ParentOrganizationNumber)[0];

    const featureToggleContext = useContext(FeatureToggleContext);
    const visHistorikkLenke = featureToggleContext[Feature.visHistorikk];


    const delOverskrift = "Opplysninger for "
    const overskriftMedOrganisasjonsdel = ERPATIDLIGEREARBEIDSFORHOLD ?
        delOverskrift + valgtJuridiskEnhet.Name + " org.nr " + valgtJuridiskEnhet.OrganizationNumber :
        delOverskrift + valgtAktivOrganisasjon.Name

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
        hentOgSetAntallOgArbeidsforhold(organisasjon)
        const search  = nullStillSorteringIUrlParametere()
        history.replace({search: search});
        setParameterIUrl('tidligereVirksomhet', organisasjon.OrganizationNumber);
    }

    const filtrertOgSortertListe: Arbeidsforhold[] = lagListeBasertPaUrl(listeMedArbeidsforholdFraAareg);
    const antallSider = regnUtantallSider(ARBEIDSFORHOLDPERSIDE, filtrertOgSortertListe.length);
    const listeForNåværendeSidetall = regnUtArbeidsForholdSomSkalVisesPaEnSide(
        parseInt(sidetall),
        ARBEIDSFORHOLDPERSIDE,
        filtrertOgSortertListe);

    const redirectTilTidligereArbeidsforhold = () => {
        const search   = nullStillSorteringIUrlParametere();
        history.replace({ search: search, pathname: 'tidligere-arbeidsforhold' });
        valgtTidligereVirksomhet !== tomaAltinnOrganisasjon && hentOgSetAntallOgArbeidsforhold(valgtTidligereVirksomhet);
        setNåværendeUrlString(window.location.href);
    };

    const redirectTilbake = () => {
        hentOgSetAntallOgArbeidsforhold(valgtAktivOrganisasjon);
        const search   = nullStillSorteringIUrlParametere();
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
                return 'ikke tilgang til forspurt entitet i Aa-reg, Vi opplever problemer med å hente opplysninger, vennligst ta kontakt med brukerstøtte ';
            default:
                return 'Vi opplever ustabilitet med Aa-registret. Prøv å laste siden på nytt eller kontakte brukerstøtte hvis problemet vedvarer.';
        }
    };

    console.log("vis progressbar: " +visProgressbar, "lastestate", aaregLasteState);
    console.log("antall ukjent:", antallArbeidsforholdUkjent, antallArbeidsforhold);

    return (
        <div className="bakgrunnsside">
            <div className="innhold-container">
                <Normaltekst className="brodsmule">
                    {!ERPATIDLIGEREARBEIDSFORHOLD && <div>
                        <Chevron type={'venstre'}/>
                        <Lenke href={linkTilMinSideArbeidsgiver(valgtAktivOrganisasjon.OrganizationNumber)}>
                            Min side – arbeidsgiver
                        </Lenke>
                    </div>
                    }
                    { ERPATIDLIGEREARBEIDSFORHOLD &&
                    <button className={'brodsmule__direct-tidligere-arbeidsforhold'} onClick={redirectTilbake}>
                        <Chevron type={'venstre'}/>
                        Tilbake til arbeidsforhold
                    </button>}
                    {visHistorikkLenke && !ERPATIDLIGEREARBEIDSFORHOLD && TILGANGTILTIDLIGEREARBEIDSFORHOLD && <button className={'brodsmule__direct-tidligere-arbeidsforhold'} onClick={redirectTilTidligereArbeidsforhold}>
                        Tidligere arbeidsforhold
                        <Chevron type={'høyre'} />
                    </button>}

                </Normaltekst>
                <div className="mine-ansatte">
                    <Systemtittel className="mine-ansatte__systemtittel" tabIndex={0}>
                        {overskriftMedOrganisasjonsdel}
                    </Systemtittel>
                    { ERPATIDLIGEREARBEIDSFORHOLD && !visProgressbar &&
                    <VelgTidligereVirksomhet
                        redirectTilbake={redirectTilbake}
                        valgtTidligereVirksomhet= {valgtTidligereVirksomhet}
                        tidligereVirksomheter={tidligereVirksomheter}
                        setTidligereVirksomhet={setTidligereVirksomhetHentArbeidsforholdOgNullstillUrlParametere }
                    />}
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
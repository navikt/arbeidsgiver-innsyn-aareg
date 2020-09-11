import React, { FunctionComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Normaltekst, Systemtittel, Element } from 'nav-frontend-typografi';
import { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';
import Chevron from 'nav-frontend-chevron';
import Lenke from 'nav-frontend-lenker';
import { APISTATUS } from '../../api/api-utils';
import { Arbeidsforhold } from '../Objekter/ArbeidsForhold';
import {Organisasjon, tomaAltinnOrganisasjon} from '../Objekter/OrganisasjonFraAltinn';
import { linkTilMinSideArbeidsgiver } from '../lenker';
import { byggListeBasertPaPArametere, sorterArbeidsforhold } from './sorteringOgFiltreringsFunksjoner';
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

interface Props extends RouteComponentProps {
    valgtJuridiskEnhet: Organisasjon;
    valgtAktivOrganisasjon: Organisasjon;
    valgtTidligereVirksomhet: Organisasjon;
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
    valgtJuridiskEnhet
}) => {
    const naVærendeUrl = new URL(window.location.href);

    //parametere som bestemmer tilstanden på listen som vises
    const sortertPå = naVærendeUrl.searchParams.get('sorter') || '0';
    const valgtKolonne: KolonneState = {
        erValgt: true,
        sorteringsAttributt: parseInt(sortertPå),
        reversSortering: naVærendeUrl.searchParams.get('revers') === 'true'
    };
    const filtreringsvalg = naVærendeUrl.searchParams.get('filter') || 'Alle';
    const sokefeltTekst = naVærendeUrl.searchParams.get('sok') || '';
    const filtrertPaVarsler = naVærendeUrl.searchParams.get('varsler') === 'true';
    const sidetall = naVærendeUrl.searchParams.get('side') || '1'
    const antallArbeidsforhold = listeMedArbeidsforholdFraAareg.length

    const ARBEIDSFORHOLDPERSIDE = 25;
    const ERPATIDLIGEREARBEIDSFORHOLD = naVærendeUrl.toString().includes('tidligere-arbeidsforhold')
    const TILGANGTILTIDLIGEREARBEIDSFORHOLD = tidligereVirksomheter && tidligereVirksomheter.length>0;
    const forMangeArbeidsforhold = antallArbeidsforhold >= MAKS_ANTALL_ARBEIDSFORHOLD;

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

    const filtrertListe = byggListeBasertPaPArametere(
        listeMedArbeidsforholdFraAareg,
        filtreringsvalg,
        filtrertPaVarsler,
        sokefeltTekst
    );
    const filtrertOgSortertListe: Arbeidsforhold[] = valgtKolonne.reversSortering ?  sorterArbeidsforhold(filtrertListe, valgtKolonne.sorteringsAttributt).reverse() : sorterArbeidsforhold(filtrertListe, valgtKolonne.sorteringsAttributt)
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
                    { !ERPATIDLIGEREARBEIDSFORHOLD && TILGANGTILTIDLIGEREARBEIDSFORHOLD && <button className={'brodsmule__direct-tidligere-arbeidsforhold'} onClick={redirectTilTidligereArbeidsforhold}>
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
                            filtrerPaAktiveAvsluttede={filtreringsvalg}
                            valgtOrganisasjon={valgtAktivOrganisasjon}
                            antallSider={antallSider}
                            antallVarsler={antallVarsler}
                            filtrertOgSortertListe={filtrertOgSortertListe}
                            alleArbeidsforhold={listeMedArbeidsforholdFraAareg}
                            soketekst={sokefeltTekst}
                            skalFiltrerePaVarsler={filtrertPaVarsler}
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
                                    navarendeKolonne={valgtKolonne}
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
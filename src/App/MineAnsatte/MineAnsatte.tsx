import React, {FunctionComponent, useEffect, useState} from 'react';
import { APISTATUS } from '../../api/api-utils';
import { Arbeidsforhold } from '../Objekter/ArbeidsForhold';
import { Organisasjon } from '../Objekter/OrganisasjonFraAltinn';
import { byggListeBasertPaPArametere, sorterArbeidsforhold } from './sorteringOgFiltreringsFunksjoner';
import {
    regnUtantallSider,
    regnUtArbeidsForholdSomSkalVisesPaEnSide
} from './pagineringsFunksjoner';
import Progressbar from './Progressbar/Progressbar';
import MineAnsatteTopp from './MineAnsatteTopp/MineAnsatteTopp';
import { Normaltekst, Systemtittel, Element } from 'nav-frontend-typografi';
import { linkTilMinSideArbeidsgiver} from '../lenker';
import Lenke from 'nav-frontend-lenker';
import TabellMineAnsatte from './TabellMineAnsatte/TabellMineAnsatte';
import ListeMedAnsatteForMobil from './ListeMineAnsatteForMobil/ListeMineAnsatteForMobil';
import { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';
import SideBytter from './SideBytter/SideBytter';
import './MineAnsatte.less';
import { RouteComponentProps, withRouter } from 'react-router';
import Chevron from "nav-frontend-chevron";

interface Props extends RouteComponentProps {
    setValgtArbeidsforhold: (arbeidsforhold: Arbeidsforhold) => void;
    valgtOrganisasjon: Organisasjon;
    listeFraAareg: Arbeidsforhold[];
    antallArbeidsforhold: number;
    visProgressbar: boolean;
    setVisProgressbar: (skalVises: boolean) => void
    aaregLasteState: APISTATUS;
    feilkode: string;
    forMangeArbeidsforhold: boolean;
    antallArbeidsforholdUkjent: boolean;

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

const MAKS_ANTALL_ARBEIDSFORHOLD = 10000;

export interface KolonneState {
    erValgt: boolean;
    sorteringsAttributt: SorteringsAttributt;
    reversSortering: boolean;

}

const forMangeArbeidsforholdTekst = (antall: number, valgtVirksomhet: String) => {
    return (
        <>
            <Element>For mange arbeidsforhold </Element>
            {'Vi har ikke kapasitet til å hente flere enn ' + MAKS_ANTALL_ARBEIDSFORHOLD + ' avsluttede eller aktive arbeidsforhold om gangen. '}
            {'Vi jobber med å forbedre systemet slik at flere arbeidsforhold kan vises.'}
            <br/>
            <br/>
            {'Du har ' + antall + ' aktive eller avsluttede arbeidsforhold registrert på ' + valgtVirksomhet + '.'}
            </>
    );
}

const MineAnsatte: FunctionComponent<Props> = ({history, valgtOrganisasjon, listeFraAareg,antallArbeidsforholdUkjent,antallArbeidsforhold, setVisProgressbar, visProgressbar,aaregLasteState,feilkode, forMangeArbeidsforhold}) =>  {
    const currentUrl = new URL(window.location.href);
    const sidetall = currentUrl.searchParams.get("side") || "1";
    const [naVarendeSidetall, setnaVarendeSidetall] = useState<number>(parseInt(sidetall));
    const [listeMedArbeidsForhold, setListeMedArbeidsForhold] = useState(Array<Arbeidsforhold>());

    const sortering = currentUrl.searchParams.get("sorter") || "0";
    const initialKolonne: KolonneState = {
        erValgt: true,
        sorteringsAttributt: parseInt(sortering),
        reversSortering: currentUrl.searchParams.get("revers") === "true"
    };

    const [navarendeKolonne, setNavarendeKolonne] = useState(initialKolonne);
    const filtreringsvalg = currentUrl.searchParams.get("filter") || "Alle";
    const [filtrerPaAktiveAvsluttede, setFiltrerPaAktiveAvsluttede] = useState(filtreringsvalg);
    const sokefeltTekst = currentUrl.searchParams.get("sok") || "";
    const [soketekst, setSoketekst] = useState<string>(sokefeltTekst);
    const filtrertPaVarsler = currentUrl.searchParams.get("varsler") === "true";
    const [skalFiltrerePaVarsler, setSkalFiltrerePaVarsler] = useState<boolean>(filtrertPaVarsler);

    const arbeidsforholdPerSide = 25;

    const setIndeksOgGenererListe = (indeks: number) => {
        setnaVarendeSidetall(indeks);
    };

    useEffect(() => {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("side", naVarendeSidetall.toString());
        currentUrl.searchParams.set("filter", filtrerPaAktiveAvsluttede);
        currentUrl.searchParams.set("varsler", skalFiltrerePaVarsler.toString());
        currentUrl.searchParams.set("sok", soketekst);
        currentUrl.searchParams.set("sorter", navarendeKolonne.sorteringsAttributt.toString());
        currentUrl.searchParams.set("revers", navarendeKolonne.reversSortering.toString());
        const { search } = currentUrl;
        history.replace({ search: search });
    }, [history, filtrerPaAktiveAvsluttede, naVarendeSidetall,skalFiltrerePaVarsler, soketekst, navarendeKolonne]);

    const setValgtArbeidsforholdOgSendMedParametere = (arbeidsforhold: Arbeidsforhold ) => {
        const nyUrl = new URL(window.location.href);
        nyUrl.searchParams.set("side", naVarendeSidetall.toString());
        nyUrl.searchParams.set("filter", filtrerPaAktiveAvsluttede);
        nyUrl.searchParams.set("varsler", skalFiltrerePaVarsler.toString());
        nyUrl.searchParams.set("sok", soketekst);
        nyUrl.searchParams.set("sorter", navarendeKolonne.sorteringsAttributt.toString());
        nyUrl.searchParams.set("revers", navarendeKolonne.reversSortering.toString());
        nyUrl.searchParams.set("arbeidsforhold", arbeidsforhold.navArbeidsforholdId);
        const { search } = nyUrl;
        history.replace({pathname: '/enkeltArbeidsforhold', search: search });
    }

    useEffect(() => {
        const oppdatertListe = byggListeBasertPaPArametere(
            listeFraAareg,
            filtrerPaAktiveAvsluttede,
            skalFiltrerePaVarsler,
            soketekst
        );
        if (navarendeKolonne.reversSortering) {
                setListeMedArbeidsForhold(sorterArbeidsforhold(oppdatertListe, navarendeKolonne.sorteringsAttributt).reverse());

        } else {
                setListeMedArbeidsForhold(sorterArbeidsforhold(oppdatertListe, navarendeKolonne.sorteringsAttributt));
        }
    }, [listeFraAareg, soketekst, navarendeKolonne, filtrerPaAktiveAvsluttede, skalFiltrerePaVarsler]);


    const antallSider = regnUtantallSider(arbeidsforholdPerSide, listeMedArbeidsForhold.length);

    let forholdPaEnSide: Arbeidsforhold[] = [];
    if (navarendeKolonne.reversSortering) {
        forholdPaEnSide = regnUtArbeidsForholdSomSkalVisesPaEnSide(
            naVarendeSidetall,
            arbeidsforholdPerSide,
            antallSider,
            sorterArbeidsforhold(listeMedArbeidsForhold, navarendeKolonne.sorteringsAttributt).reverse()
        );
    } else {
        forholdPaEnSide = regnUtArbeidsForholdSomSkalVisesPaEnSide(
            naVarendeSidetall,
            arbeidsforholdPerSide,
            antallSider,
            sorterArbeidsforhold(listeMedArbeidsForhold, navarendeKolonne.sorteringsAttributt)
        );
    }

    const antallVarsler = listeMedArbeidsForhold.filter(forhold => {
        return forhold.varsler;
    }).length;


    const feilmeldingtekst = () => {
        switch (feilkode) {
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
                    <Chevron type={'venstre'} />
                    <Lenke href={linkTilMinSideArbeidsgiver(valgtOrganisasjon.OrganizationNumber)}>
                        Min side – arbeidsgiver
                    </Lenke>
                </Normaltekst>
                <div className="mine-ansatte">
                    <Systemtittel className="mine-ansatte__systemtittel" tabIndex={0}>
                        {'Opplysninger for '+ valgtOrganisasjon.Name}
                    </Systemtittel>
                    {(antallArbeidsforhold > 0 || antallArbeidsforholdUkjent) && visProgressbar && aaregLasteState !== APISTATUS.FEILET && !forMangeArbeidsforhold && (
                        <Progressbar
                            antallArbeidsforholdUkjent={antallArbeidsforholdUkjent}
                            antall={antallArbeidsforhold}
                            setSkalvises={setVisProgressbar}
                            erFerdigLastet={aaregLasteState === APISTATUS.OK}
                            startTid={new Date().getTime()}
                        />
                    )}
                    {aaregLasteState === APISTATUS.OK && !visProgressbar && !forMangeArbeidsforhold &&(
                        <MineAnsatteTopp
                            filtrerPaAktiveAvsluttede={filtrerPaAktiveAvsluttede}
                            valgtOrganisasjon={valgtOrganisasjon}
                            setIndeksOgGenererListe={setIndeksOgGenererListe}
                            setSoketekst={setSoketekst}
                            antallSider={antallSider}
                            antallVarsler={antallVarsler}
                            lengdeResponsFiltrertListe={listeMedArbeidsForhold.length}
                            listeMedArbeidsforhold={listeMedArbeidsForhold}
                            naVarendeSidetall={naVarendeSidetall}
                            responsFraAaregisteret={listeFraAareg}
                            soketekst={soketekst}
                            setSkalFiltrerePaVarsler={setSkalFiltrerePaVarsler}
                            skalFiltrerePaVarsler={skalFiltrerePaVarsler}
                            setFiltrerPaAktiveAvsluttede={setFiltrerPaAktiveAvsluttede}
                        />
                    )}

                    {aaregLasteState === APISTATUS.OK && listeMedArbeidsForhold.length > 0 && !visProgressbar && !forMangeArbeidsforhold && (
                        <>
                            {' '}
                            <TabellMineAnsatte
                                className="mine-ansatte__table"
                                listeMedArbeidsForhold={forholdPaEnSide}
                                fullListe={listeMedArbeidsForhold}
                                setNavarendeKolonne={setNavarendeKolonne}
                                byttSide={setIndeksOgGenererListe}
                                navarendeKolonne={navarendeKolonne}
                                setValgtArbeidsforhold={setValgtArbeidsforholdOgSendMedParametere}
                                valgtBedrift={valgtOrganisasjon.OrganizationNumber}
                            />
                            <ListeMedAnsatteForMobil
                                fullListe={listeMedArbeidsForhold}
                                listeMedArbeidsForhold={forholdPaEnSide}
                                className="mine-ansatte__liste"
                                setValgtArbeidsforhold={setValgtArbeidsforholdOgSendMedParametere}
                                valgtBedrift={valgtOrganisasjon.OrganizationNumber}
                            />
                            { antallSider>1 &&<SideBytter
                                plassering="nederst"
                                className="nedre-sidebytter"
                                byttSide={setIndeksOgGenererListe}
                                antallSider={antallSider}
                                naVarendeSidetall={naVarendeSidetall}
                            />}
                        </>
                    )}
                    {aaregLasteState === APISTATUS.FEILET && (
                        <div className="mine-ansatte__feilmelding-aareg">
                            <AlertStripeFeil>{feilmeldingtekst()}</AlertStripeFeil>
                        </div>
                    )}
                    {forMangeArbeidsforhold && (
                        <div className="mine-ansatte__feilmelding-aareg">
                            <AlertStripeAdvarsel > {forMangeArbeidsforholdTekst(antallArbeidsforhold, valgtOrganisasjon.Name)}</AlertStripeAdvarsel>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default withRouter(MineAnsatte);
import React, {FunctionComponent, useEffect, useState} from 'react';
import { APISTATUS } from '../../api/api-utils';
import { Arbeidsforhold } from '../Objekter/ArbeidsForhold';
import { Organisasjon } from '../Objekter/OrganisasjonFraAltinn';
import { Arbeidstaker } from '../Objekter/Arbeidstaker';
import {
    hentAntallArbeidsforholdFraAareg, hentAntallArbeidsforholdFraAaregNyBackend,
    hentArbeidsforholdFraAAreg,
    hentArbeidsforholdFraAAregNyBackend
} from '../../api/aaregApi';
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
import {loggInfoOmFeil} from "../amplitudefunksjonerForLogging";
import {redirectTilLogin} from "../LoggInn/LoggInn";
import { RouteComponentProps, withRouter } from 'react-router';



interface Props extends RouteComponentProps {
    setValgtArbeidstaker: (arbeidstaker: Arbeidstaker) => void;
    valgtOrganisasjon: Organisasjon;
    setAbortControllerAntallArbeidsforhold: (abortcontroller: AbortController) => void;
    setAbortControllerArbeidsforhold: (abortcontroller: AbortController) => void;
    tilgangTiLOpplysningspliktigOrg: boolean;
    antallOrganisasjonerTotalt: number;
    antallOrganisasjonerMedTilgang: number;
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

const MineAnsatte: FunctionComponent<Props> = ({history, setValgtArbeidstaker, valgtOrganisasjon, setAbortControllerAntallArbeidsforhold, setAbortControllerArbeidsforhold, tilgangTiLOpplysningspliktigOrg, antallOrganisasjonerTotalt, antallOrganisasjonerMedTilgang}) =>  {
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

    const [listeFraAareg, setListeFraAareg] = useState(Array<Arbeidsforhold>());
    const [antallArbeidsforhold, setAntallArbeidsforhold] = useState(0);
    const [visProgressbar, setVisProgressbar] = useState(false);

    const [aaregLasteState, setAaregLasteState] = useState<APISTATUS>(APISTATUS.LASTER);
    const [feilkode, setFeilkode] = useState<string>('');
    const [forMangeArbeidsforhold, setForMangeArbeidsforhold] = useState(false);
    const [antallArbeidsforholdUkjent, setAntallArbeidsforholdUkjent] = useState(false);

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
        history.replace({ search });
    }, [history, filtrerPaAktiveAvsluttede, naVarendeSidetall,skalFiltrerePaVarsler, soketekst, navarendeKolonne]);

    useEffect(() => {
        setAntallArbeidsforhold(0);
        setAntallArbeidsforholdUkjent(true)
        setForMangeArbeidsforhold(false)
        const abortController = new AbortController();
        setAbortControllerAntallArbeidsforhold(abortController)
        const signal = abortController.signal;
        hentAntallArbeidsforholdFraAareg(
            valgtOrganisasjon.OrganizationNumber,
            valgtOrganisasjon.ParentOrganizationNumber, signal
        ).then(antall => {
            const antallForhold = antall.valueOf();
            if (antallForhold > 0) {
                setAntallArbeidsforholdUkjent(false);
                setAntallArbeidsforhold(antallForhold);
                if (antallForhold>MAKS_ANTALL_ARBEIDSFORHOLD) {
                    setVisProgressbar(false);
                    setAaregLasteState(APISTATUS.OK);
                    setForMangeArbeidsforhold(true);
                }
            }
            if (antallForhold <= MAKS_ANTALL_ARBEIDSFORHOLD) {
                setAaregLasteState(APISTATUS.LASTER);
                setVisProgressbar(true);
            }

        }).catch(error => {
            loggInfoOmFeil(error.response.status, valgtOrganisasjon.OrganizationNumber )
            if (error.response.status === 401) {
                redirectTilLogin();
            }
            setAaregLasteState(APISTATUS.FEILET);
            setFeilkode(error.response.status.toString());
        });
    }, [setAbortControllerAntallArbeidsforhold, valgtOrganisasjon]);

    useEffect(() => {
        if ((antallArbeidsforhold>0 || antallArbeidsforholdUkjent) && !forMangeArbeidsforhold) {
            const abortController = new AbortController();
            setAbortControllerArbeidsforhold(abortController)
            const signal = abortController.signal;
            hentArbeidsforholdFraAAreg(
                valgtOrganisasjon.OrganizationNumber,
                valgtOrganisasjon.ParentOrganizationNumber,
                signal
            )
                .then(responsAareg => {
                    setListeFraAareg(responsAareg.arbeidsforholdoversikter);
                    setAaregLasteState(APISTATUS.OK);
                    if (antallArbeidsforholdUkjent) {
                        setAntallArbeidsforhold(responsAareg.arbeidsforholdoversikter.length);
                    }
                })
                .catch(error => {
                    loggInfoOmFeil(error.response.status, valgtOrganisasjon.OrganizationNumber )
                    if (error.response.status === 401) {
                        redirectTilLogin();
                    }
                    setAaregLasteState(APISTATUS.FEILET);
                    setFeilkode(error.response.status.toString());
                });
        }
    }, [valgtOrganisasjon, antallArbeidsforhold, forMangeArbeidsforhold, setAbortControllerArbeidsforhold, antallArbeidsforholdUkjent, tilgangTiLOpplysningspliktigOrg,
    antallOrganisasjonerMedTilgang, antallOrganisasjonerTotalt]);

    useEffect(() => {
        const oppdatertListe = byggListeBasertPaPArametere(
            listeFraAareg,
            filtrerPaAktiveAvsluttede,
            skalFiltrerePaVarsler,
            soketekst
        );
        setListeMedArbeidsForhold(oppdatertListe);
    }, [listeFraAareg, soketekst, navarendeKolonne, filtrerPaAktiveAvsluttede, skalFiltrerePaVarsler]);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        hentArbeidsforholdFraAAregNyBackend(
            valgtOrganisasjon.OrganizationNumber,
            valgtOrganisasjon.ParentOrganizationNumber,
            signal
        )
            .then(responsAareg => {
                console.log(responsAareg)

            })
            .catch(error => {

            });
        hentAntallArbeidsforholdFraAaregNyBackend(
            valgtOrganisasjon.OrganizationNumber,
            valgtOrganisasjon.ParentOrganizationNumber,
            signal
        )
            .then(responsAareg => {
                console.log(responsAareg)

            })
            .catch(error => {

            });
    }, [valgtOrganisasjon]);

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
                    <Lenke href={linkTilMinSideArbeidsgiver(valgtOrganisasjon.OrganizationNumber)}>
                        Min side – arbeidsgiver
                    </Lenke>
                    {' / arbeidsforhold'}
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
                                setNavarendeKolonne={setNavarendeKolonne}
                                byttSide={setIndeksOgGenererListe}
                                navarendeKolonne={navarendeKolonne}
                                settValgtArbeidsgiver={setValgtArbeidstaker}
                                valgtBedrift={valgtOrganisasjon.OrganizationNumber}
                            />
                            <ListeMedAnsatteForMobil
                                listeMedArbeidsForhold={forholdPaEnSide}
                                className="mine-ansatte__liste"
                                settValgtArbeidsgiver={setValgtArbeidstaker}
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
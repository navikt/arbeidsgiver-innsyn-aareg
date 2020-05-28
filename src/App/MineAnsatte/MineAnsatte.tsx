import React, { useEffect, useState } from 'react';
import { APISTATUS } from '../../api/api-utils';
import { Arbeidsforhold } from '../Objekter/ArbeidsForhold';
import { Organisasjon } from '../Objekter/OrganisasjonFraAltinn';
import { Arbeidstaker } from '../Objekter/Arbeidstaker';
import { hentAntallArbeidsforholdFraAareg, hentArbeidsforholdFraAAreg } from '../../api/aaregApi';
import { byggListeBasertPaPArametere, sorterArbeidsforhold } from './sorteringOgFiltreringsFunksjoner';
import {
    regnUtantallSider,
    regnUtArbeidsForholdSomSkalVisesPaEnSide
} from './pagineringsFunksjoner';
import Progressbar from './Progressbar/Progressbar';
import MineAnsatteTopp from './MineAnsatteTopp/MineAnsatteTopp';
import { Normaltekst, Systemtittel, Element } from 'nav-frontend-typografi';
import { linkTilMinSideArbeidsgiver } from '../lenker';
import Lenke from 'nav-frontend-lenker';
import TabellMineAnsatte from './TabellMineAnsatte/TabellMineAnsatte';
import ListeMedAnsatteForMobil from './ListeMineAnsatteForMobil/ListeMineAnsatteForMobil';
import { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';
import SideBytter from './SideBytter/SideBytter';
import './MineAnsatte.less';

interface Props {
    setValgtArbeidstaker: (arbeidstaker: Arbeidstaker) => void;
    valgtOrganisasjon: Organisasjon;
    setAbortControllerAntallArbeidsforhold: (abortcontroller: AbortController) => void;
    setAbortControllerArbeidsforhold: (abortcontroller: AbortController) => void;
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

const MAKS_ANTALL_ARBEIDSFORHOLD = 3000;

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

const initialKolonne: KolonneState = {
    erValgt: true,
    sorteringsAttributt: SorteringsAttributt.NAVN,
    reversSortering: false
};

const MineAnsatte = (
    {
        setValgtArbeidstaker,
        valgtOrganisasjon,
        setAbortControllerAntallArbeidsforhold,
        setAbortControllerArbeidsforhold
    }: Props ) => {
    const [naVarendeSidetall, setnaVarendeSidetall] = useState<number>(1);
    const [listeMedArbeidsForhold, setListeMedArbeidsForhold] = useState(Array<Arbeidsforhold>());
    const [navarendeKolonne, setNavarendeKolonne] = useState(initialKolonne);
    const [filtrerPaAktiveAvsluttede, setFiltrerPaAktiveAvsluttede] = useState('Alle');
    const [soketekst, setSoketekst] = useState<string>('');
    const [skalFiltrerePaVarsler, setSkalFiltrerePaVarsler] = useState<boolean>(false);

    const [listeFraAareg, setListeFraAareg] = useState(Array<Arbeidsforhold>());
    const [antallArbeidsforhold, setAntallArbeidsforhold] = useState(0);
    const [visProgressbar, setVisProgressbar] = useState(false);

    const [aaregLasteState, setAaregLasteState] = useState<APISTATUS>(APISTATUS.LASTER);
    const [feilkode, setFeilkode] = useState<string>('');
    const [forMangeArbeidsforhold, setForMangeArbeidsforhold] = useState(false);
    const arbeidsforholdPerSide = 25;

    const setIndeksOgGenererListe = (indeks: number) => {
        setnaVarendeSidetall(indeks);
    };

    useEffect(() => {
        setForMangeArbeidsforhold(false)
        const abortController = new AbortController();
        setAbortControllerAntallArbeidsforhold(abortController)
        const signal = abortController.signal;
        hentAntallArbeidsforholdFraAareg(
            valgtOrganisasjon.OrganizationNumber,
            valgtOrganisasjon.ParentOrganizationNumber, signal
        ).then(antall => {
            const antallForhold = antall.valueOf();
            console.log(antallForhold)
            if (antallForhold > 0) {
                setAntallArbeidsforhold(antallForhold);
                if (antallForhold>MAKS_ANTALL_ARBEIDSFORHOLD) {
                    setVisProgressbar(false);
                    setAaregLasteState(APISTATUS.OK);
                    setForMangeArbeidsforhold(true);
                }
            }
            else {
                setAntallArbeidsforhold(-1);
            }
            if ((antallForhold>0 && antallForhold <= MAKS_ANTALL_ARBEIDSFORHOLD) || antallForhold === -1) {
                setAaregLasteState(APISTATUS.LASTER);
                setVisProgressbar(true);
            }

        }).catch(error => {
            setAaregLasteState(APISTATUS.FEILET);
            setFeilkode(error.response.status.toString());
        });
    }, [setAbortControllerAntallArbeidsforhold, valgtOrganisasjon]);

    useEffect(() => {
        if ((antallArbeidsforhold > 0 || antallArbeidsforhold === -1) && !forMangeArbeidsforhold) {
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
                })
                .catch(error => {
                    setAaregLasteState(APISTATUS.FEILET);
                    setFeilkode(error.response.status.toString());
                });
        }
    }, [valgtOrganisasjon, antallArbeidsforhold, forMangeArbeidsforhold, setAbortControllerArbeidsforhold]);

    useEffect(() => {
        const oppdatertListe = byggListeBasertPaPArametere(
            listeFraAareg,
            filtrerPaAktiveAvsluttede,
            skalFiltrerePaVarsler,
            soketekst
        );
        setListeMedArbeidsForhold(oppdatertListe);
        setnaVarendeSidetall(1);
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


    const feilmeldingtekst =
        feilkode === '408'
            ? 'Det oppstod en feil da vi prøvde å hente dine arbeidsforhold. Prøv å laste siden på nytt eller kontakte brukerstøtte hvis problemet vedvarer.'
            : 'Vi opplever ustabilitet med Aa-registret. Prøv å laste siden på nytt eller kontakte brukerstøtte hvis problemet vedvarer.';

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
                        Opplysninger fra Aa-registeret
                    </Systemtittel>
                    {(antallArbeidsforhold > 0 || antallArbeidsforhold ===-1) && visProgressbar && aaregLasteState !== APISTATUS.FEILET &&(
                        <Progressbar
                            antall={antallArbeidsforhold}
                            setSkalvises={setVisProgressbar}
                            erFerdigLastet={aaregLasteState === APISTATUS.OK}
                            startTid={new Date().getTime()}
                        />
                    )}
                    {aaregLasteState === APISTATUS.OK && !visProgressbar && !forMangeArbeidsforhold &&(
                        <MineAnsatteTopp
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
                            <AlertStripeFeil>{feilmeldingtekst}</AlertStripeFeil>
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

export default MineAnsatte;
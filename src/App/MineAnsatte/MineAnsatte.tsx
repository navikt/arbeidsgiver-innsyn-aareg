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
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { linkTilMinSideArbeidsgiver } from '../lenker';
import Lenke from 'nav-frontend-lenker';
import TabellMineAnsatte from './TabellMineAnsatte/TabellMineAnsatte';
import ListeMedAnsatteForMobil from './ListeMineAnsatteForMobil/ListeMineAnsatteForMobil';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import SideBytter from './SideBytter/SideBytter';
import './MineAnsatte.less';

interface MineAnsatteProps {
    setValgtArbeidstaker: (arbeidstaker: Arbeidstaker) => void;
    valgtOrganisasjon: Organisasjon;
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

const initialKolonne: KolonneState = {
    erValgt: true,
    sorteringsAttributt: SorteringsAttributt.NAVN,
    reversSortering: false
};

const MineAnsatte = (props: MineAnsatteProps) => {
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
        hentAntallArbeidsforholdFraAareg(
            props.valgtOrganisasjon.OrganizationNumber,
            props.valgtOrganisasjon.ParentOrganizationNumber
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
            if ((antallForhold>0 && antallForhold < MAKS_ANTALL_ARBEIDSFORHOLD) || antallForhold === -1) {
                setAaregLasteState(APISTATUS.LASTER);
                setVisProgressbar(true);
            }

        }).catch(error => {
            setAaregLasteState(APISTATUS.FEILET);
            setFeilkode(error.response.status.toString());
        });
    }, [props.valgtOrganisasjon]);

    useEffect(() => {
        if (antallArbeidsforhold > 0 || antallArbeidsforhold === -1 && !forMangeArbeidsforhold) {
            hentArbeidsforholdFraAAreg(
                props.valgtOrganisasjon.OrganizationNumber,
                props.valgtOrganisasjon.ParentOrganizationNumber
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
    }, [props.valgtOrganisasjon, antallArbeidsforhold, forMangeArbeidsforhold]);

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
                    <Lenke href={linkTilMinSideArbeidsgiver(props.valgtOrganisasjon.OrganizationNumber)}>
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
                            valgtOrganisasjon={props.valgtOrganisasjon}
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
                                settValgtArbeidsgiver={props.setValgtArbeidstaker}
                                valgtBedrift={props.valgtOrganisasjon.OrganizationNumber}
                            />
                            <ListeMedAnsatteForMobil
                                listeMedArbeidsForhold={forholdPaEnSide}
                                className="mine-ansatte__liste"
                                settValgtArbeidsgiver={props.setValgtArbeidstaker}
                                valgtBedrift={props.valgtOrganisasjon.OrganizationNumber}
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
                            <AlertStripeFeil>For mange arbeidsforhold</AlertStripeFeil>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MineAnsatte;

import React, {FunctionComponent, SyntheticEvent, useEffect, useState} from 'react';
import './MineAnsatte.less';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import SideBytter from './SideBytter/SideBytter';
import ListeMedAnsatteForMobil from './ListeMineAnsatteForMobil/ListeMineAnsatteForMobil';
import TabellMineAnsatte from './TabellMineAnsatte/TabellMineAnsatte';
import {
    byggListeBasertPaPArametere, filtreringValgt, sorterArbeidsforhold,
    tellAntallAktiveOgInaktiveArbeidsforhold
} from './sorteringOgFiltreringsFunksjoner';

import {
    regnUtantallSider,
    regnUtArbeidsForholdSomSkalVisesPaEnSide,
    visEllerSkjulChevroner
} from './pagineringsFunksjoner';
import { ObjektFraAAregisteret } from '../Objekter/ObjektFraAAreg';
import Sokefelt from './Sokefelt/Sokefelt';
import { hentArbeidsforholdFraAAreg } from '../../api/AaregApi';
import { Organisasjon } from '../Objekter/OrganisasjonFraAltinn';
import { Arbeidstaker } from '../Objekter/Arbeidstaker';
import ExcelEksport from './ExcelEksport/ExcelEksport';
import {Arbeidsforhold} from "../Objekter/ArbeidsForhold";
import {ToggleKnappPureProps} from 'nav-frontend-toggle';
import Filtervalg from "./Filtervalg/Filtervalg";
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Lenke from "nav-frontend-lenker";
import {linkTilMinSideArbeidsgiver} from "../lenker";
import NavFrontendSpinner from "nav-frontend-spinner";

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

export declare interface MineAnsatteProps {
    setValgtArbeidstaker: (arbeidstaker: Arbeidstaker) => void;
    valgtOrganisasjon: Organisasjon;
}

export interface KolonneState {
    erValgt: boolean;
    sorteringsAttributt: SorteringsAttributt;
    reversSortering: boolean;
}

const MineAnsatte: FunctionComponent<MineAnsatteProps> = (props: MineAnsatteProps) => {
    const [naVarendeSidetall, setnaVarendeSidetall] = useState(1);
    const [listeMedArbeidsForhold, setListeMedArbeidsForhold] = useState(Array<Arbeidsforhold>());
    const initialKolonne: KolonneState = {
        erValgt: true,
        sorteringsAttributt: SorteringsAttributt.NAVN,
        reversSortering: false
    };
    const [navarendeKolonne, setNavarendeKolonne] = useState(initialKolonne);
    const [filtrerPaAktiveAvsluttede, setFiltrerPaAktiveAvsluttede] = useState('Alle');
    const [soketekst, setSoketekst] = useState('');
    const [listeFraAareg, setListeFraAareg] = useState(Array<Arbeidsforhold>());
    const [skalFiltrerePaVarsler, setSkalFiltrerePaVarsler] = useState(false);
    const [ferdiglastet, setFerdiglastet] = useState(false);
    const arbeidsforholdPerSide = 25;
    const setIndeksOgGenererListe = (indeks: number) => {
        setnaVarendeSidetall(indeks);
    };

    const onSoketekstChange = (soketekst: string) => {
        setSoketekst(soketekst);
    };

    const velgFiltrering = (event: SyntheticEvent<EventTarget>,toggles: ToggleKnappPureProps[]) => {
        const filtrering = filtreringValgt(event, toggles);
        setFiltrerPaAktiveAvsluttede(filtrering);
    };

    useEffect(() => {
        setFerdiglastet(false);
        const hentogSettArbeidsforhold = async () => {
            const responsAareg: ObjektFraAAregisteret = await hentArbeidsforholdFraAAreg(
                props.valgtOrganisasjon.OrganizationNumber,
                props.valgtOrganisasjon.ParentOrganizationNumber
            );
            return responsAareg;
        };
        if (
            props.valgtOrganisasjon.OrganizationNumber !== '' &&
            props.valgtOrganisasjon.ParentOrganizationNumber !== ''
        ) {
            hentogSettArbeidsforhold().then(responsAareg => {
                setListeFraAareg(responsAareg.arbeidsforholdoversikter);
                setFerdiglastet(true);
            });
        }
    }, [props.valgtOrganisasjon]);

    useEffect(() => {
        const oppdatertListe = byggListeBasertPaPArametere(listeFraAareg, filtrerPaAktiveAvsluttede, skalFiltrerePaVarsler, soketekst);
        setListeMedArbeidsForhold(oppdatertListe);
        setnaVarendeSidetall(1);
    }, [listeFraAareg, soketekst, navarendeKolonne, filtrerPaAktiveAvsluttede, skalFiltrerePaVarsler ]);

    const antallSider = regnUtantallSider(arbeidsforholdPerSide,listeMedArbeidsForhold.length);
    let forholdPaEnSide: Arbeidsforhold[] = [];
    if (navarendeKolonne.reversSortering) {
        forholdPaEnSide =regnUtArbeidsForholdSomSkalVisesPaEnSide(naVarendeSidetall,arbeidsforholdPerSide,antallSider,sorterArbeidsforhold(listeMedArbeidsForhold, navarendeKolonne.sorteringsAttributt).reverse());
    }
    else {
        forholdPaEnSide =regnUtArbeidsForholdSomSkalVisesPaEnSide(naVarendeSidetall,arbeidsforholdPerSide,antallSider,sorterArbeidsforhold(listeMedArbeidsForhold, navarendeKolonne.sorteringsAttributt));
    }

    useEffect(() => {
        visEllerSkjulChevroner(
            naVarendeSidetall,
            antallSider,
            'sidebytter-chevron-venstre',
            'sidebytter-chevron-hoyre'
        );
    }, [antallSider,naVarendeSidetall]);

    return (
        <div className={"bakgrunnsside"}>
            <Normaltekst><Lenke href={linkTilMinSideArbeidsgiver(props.valgtOrganisasjon.OrganizationNumber)}>Min side – arbeidsgiver</Lenke> /arbeidsforhold /</Normaltekst>
        <div className={'mine-ansatte'}>
            <div className={'mine-ansatte__header'}>
                <Undertittel className={'mine-ansatte__systemtittel'} tabIndex={0}>
                    Opplysninger fra Aa-registeret
                </Undertittel>
                <ExcelEksport
                    arbeidsforholdListe={listeMedArbeidsForhold}
                    navnBedrift={props.valgtOrganisasjon.Name}
                    orgnrBedrift={props.valgtOrganisasjon.OrganizationNumber}
                />
            </div>
            <AlertStripeInfo className = {"mine-ansatte__informasjon"}>Under finner du en oversikt over arbeidsforhold rapportert inn etter 01.01.2015. Dersom du finner feil eller mangler i oversikten skal disse korrigeres/rapporteres inn via a-meldingen. </AlertStripeInfo>
            <div className={'mine-ansatte__sok-og-filter'}>
                <Normaltekst>Arbeidsforhold</Normaltekst>
                { listeFraAareg.length > 0 && <Filtervalg filtreringValgt={velgFiltrering} overSiktOverAntallAktiveOgInaktive={tellAntallAktiveOgInaktiveArbeidsforhold(listeFraAareg)} setfiltrerPaVarsler={() => setSkalFiltrerePaVarsler(!skalFiltrerePaVarsler)}/>
          }
                <Sokefelt onChange={onSoketekstChange} soketekst={soketekst} />
            </div>
            <div className={'mine-ansatte__topp'}>
                <div tabIndex={0} className={'mine-ansatte__antall-forhold'}>
                    <Normaltekst>Viser {listeMedArbeidsForhold.length} av {listeFraAareg.length} arbeidsforhold</Normaltekst>
                </div>
                {antallSider > 1 && <SideBytter
                    plassering={"overst"}
                    className={'sidebytter'}
                    byttSide={setIndeksOgGenererListe}
                    antallSider={antallSider}
                    naVarendeSidetall={naVarendeSidetall}
                />}
            </div>
            { !ferdiglastet && <div className={"mine-ansatte__spinner-container"}> Henter arbeidsforhold<NavFrontendSpinner className={"mine-ansatte__spinner"}/></div>}
            { ferdiglastet && <><TabellMineAnsatte
                className={'mine-ansatte__table'}
                listeMedArbeidsForhold={forholdPaEnSide}
                setNavarendeKolonne={setNavarendeKolonne}
                byttSide={setIndeksOgGenererListe}
                navarendeKolonne={navarendeKolonne}
                settValgtArbeidsgiver={props.setValgtArbeidstaker}
                valgtBedrift={props.valgtOrganisasjon.OrganizationNumber}
            />
            <ListeMedAnsatteForMobil
                listeMedArbeidsForhold={forholdPaEnSide}
                className={'mine-ansatte__liste'}
                settValgtArbeidsgiver={props.setValgtArbeidstaker}
                valgtBedrift={props.valgtOrganisasjon.OrganizationNumber}
            />
            </>}
            {antallSider > 1 && <SideBytter
                plassering={"nederst"}
                className={'nedre-sidebytter'}
                byttSide={setIndeksOgGenererListe}
                antallSider={antallSider}
                naVarendeSidetall={naVarendeSidetall}
            />}
        </div>
            </div>
    );
};

export default MineAnsatte;

import React, {FunctionComponent, SyntheticEvent, useEffect, useState} from 'react';
import './MineAnsatte.less';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import SideBytter from './SideBytter/SideBytter';
import ListeMedAnsatteForMobil from './ListeMineAnsatteForMobil/ListeMineAnsatteForMobil';
import TabellMineAnsatte from './TabellMineAnsatte/TabellMineAnsatte';
import {
    byggListeBasertPaPArametere, filtreringValgt, sorterArbeidsforhold,
} from './sorteringOgFiltreringsFunksjoner';

import {
    regnUtantallSider,
    regnUtArbeidsForholdSomSkalVisesPaEnSide,
    visEllerSkjulChevroner
} from './pagineringsFunksjoner';
import { ObjektFraAAregisteret } from '../Objekter/ObjektFraAAreg';
import { hentArbeidsforholdFraAAreg } from '../../api/AaregApi';
import { Organisasjon } from '../Objekter/OrganisasjonFraAltinn';
import { Arbeidstaker } from '../Objekter/Arbeidstaker';
import {Arbeidsforhold} from "../Objekter/ArbeidsForhold";
import {ToggleKnappPureProps} from 'nav-frontend-toggle';
import amplitude from "../../utils/amplitude";
import Lenke from "nav-frontend-lenker";
import {linkTilMinSideArbeidsgiver} from "../lenker";
import environment from "../../utils/environment";
import NavFrontendSpinner from "nav-frontend-spinner";
import MineAnsatteTopp from "./MineAnsatteTopp/MineAnsatteTopp";

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
                    amplitude.logEvent(" #arbeidsforhold hentet: " + responsAareg.arbeidsforholdoversikter.length + " arbeidsforhold i miljøet " + environment.MILJO);
                    setFerdiglastet(true);
            }
            );
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

    const antallVarsler = listeMedArbeidsForhold.filter(forhold => {
        return forhold.varsler;}).length;

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
            <Undertittel className={'mine-ansatte__systemtittel'} tabIndex={0}>
                    Opplysninger fra Aa-registeret
                </Undertittel>
            <MineAnsatteTopp valgtOrganisasjon={props.valgtOrganisasjon } setIndeksOgGenererListe={setIndeksOgGenererListe}
                             onSoketekstChange={onSoketekstChange} antallSider={antallSider} antallVarsler={antallVarsler} lengdeResponsFiltrertListe={listeMedArbeidsForhold.length} velgFiltrering={velgFiltrering}
                             listeMedArbeidsforhold={listeMedArbeidsForhold} naVarendeSidetall={naVarendeSidetall} responsFraAaregisteret={listeFraAareg} soketekst={soketekst} setSkalFiltrerePaVarsler={setSkalFiltrerePaVarsler} skalFiltrerePaVarsler={skalFiltrerePaVarsler}  />
            { !ferdiglastet && <div className={"mine-ansatte__spinner-container"}> Henter arbeidsforhold<NavFrontendSpinner className={"mine-ansatte__spinner"}/></div>}
            { ferdiglastet && <>  <TabellMineAnsatte
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
            </>
            }
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

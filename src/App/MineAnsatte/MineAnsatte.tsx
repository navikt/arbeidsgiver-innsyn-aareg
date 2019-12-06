import React, { FunctionComponent, useEffect, useState } from 'react';
import './MineAnsatte.less';
import { Undertittel } from 'nav-frontend-typografi';
import SideBytter from './SideBytter/SideBytter';
import ListeMedAnsatteForMobil from './ListeMineAnsatteForMobil/ListeMineAnsatteForMobil';
import TabellMineAnsatte from './TabellMineAnsatte/TabellMineAnsatte';
import {
    filtrerAktiveOgAvsluttede,
    sorterArbeidsforhold,
} from './sorteringOgFiltreringsFunksjoner';

import {
    regnUtantallSider,
    regnUtArbeidsForholdSomSkalVisesPaEnSide,
    visEllerSkjulChevroner,
} from './pagineringsFunksjoner';
import {arbeidsforhold} from "../Objekter/ObjektFraAAreg";
import {genererMockingAvArbeidsForhold} from "../../mocking/funksjonerForAlageAAregMock";
import HovedBanner from "./HovedBanner/HovedBanner";
import Sokefelt from "./Sokefelt/Sokefelt";
import {byggArbeidsforholdSokeresultat} from "./Sokefelt/byggArbeidsforholdSokeresultat";
import NedtrekksMenyForFiltrering from "./NedtrekksMenyForFiltrering/NedtrekksMenyForFiltrering";
import {hentArbeidsforholdFraAAreg} from "../../api/AaregApi";

export enum SorteringsAttributt {
    NAVN,
    FNR,
    YRKE,
    STARTDATO,
    SLUTTDATO,
    VARSEL,
}

export interface KolonneState {
    erValgt: boolean;
    sorteringsAttributt: SorteringsAttributt;
    reversSortering: boolean;
}
const MineAnsatte: FunctionComponent = () => {
    const [ansattForholdPaSiden, setAnsattForholdPaSiden] = useState(Array<arbeidsforhold>());
    const [antallSider, setAntallSider] = useState(0);
    const [naVarendeSidetall, setnaVarendeSidetall] = useState(1);
    const [listeMedArbeidsForhold, setListeMedArbeidsForhold] = useState(Array<arbeidsforhold>());
    const initialKolonne: KolonneState = {
        erValgt: true,
        sorteringsAttributt: SorteringsAttributt.NAVN,
        reversSortering: false,
    };
    const [navarendeKolonne, setNavarendeKolonne] = useState(initialKolonne);
    const [filterState, setFilterState] = useState('visAlle');
    const [soketekst, setSoketekst] = useState('');
    const [listeFraAareg,setListeFraAareg] = useState(Array<arbeidsforhold>());

    const fraAareg = hentArbeidsforholdFraAAreg("910825518", "810825472");
    console.log(fraAareg);


    const arbeidsforholdPerSide = 25;

    const setIndeksOgGenererListe = (indeks: number) => {
        setnaVarendeSidetall(indeks);
    };

    const filtreringValgt = (value: any, event: any) => {
        setFilterState(value);
    };

    const onSoketekstChange = (soketekst: string) => {
        setSoketekst(soketekst);
    };

    useEffect(() => {
        setListeFraAareg(genererMockingAvArbeidsForhold(20000));
    }, []);

    useEffect(() => {
        if (soketekst.length>0) {
            setListeMedArbeidsForhold(byggArbeidsforholdSokeresultat(listeFraAareg,soketekst));
        }
        else {
            setListeMedArbeidsForhold(listeFraAareg);
        }
    }, [soketekst,listeFraAareg]);

    useEffect(() => {
        let sortertListe = sorterArbeidsforhold(
           listeMedArbeidsForhold,
            navarendeKolonne.sorteringsAttributt
        );
        if (navarendeKolonne.reversSortering) {
            sortertListe = sortertListe.reverse();
        }
        if (filterState !== 'visAlle') {
            const visAktive = filterState === 'aktive';
            sortertListe = filtrerAktiveOgAvsluttede(sortertListe, visAktive);
        }
        setAntallSider(regnUtantallSider(arbeidsforholdPerSide, sortertListe.length));
        const ansattForholdPaNavarendeSide: arbeidsforhold[] = regnUtArbeidsForholdSomSkalVisesPaEnSide(
            naVarendeSidetall,
            arbeidsforholdPerSide,
            antallSider,
            sortertListe
        );
        setAnsattForholdPaSiden(ansattForholdPaNavarendeSide);
        visEllerSkjulChevroner(
            naVarendeSidetall,
            antallSider,
            'sidebytter-chevron-venstre',
            'sidebytter-chevron-hoyre'
        );
    }, [listeMedArbeidsForhold, naVarendeSidetall, navarendeKolonne, filterState, antallSider]);

    useEffect(() => {
        setnaVarendeSidetall(1);
    }, [navarendeKolonne,soketekst]);

    return (
        <>
        <HovedBanner/>
        <div className={'mine-ansatte'}>

            <Undertittel className={'mine-ansatte__systemtittel'} tabIndex={0}>
                Opplysninger fra Aa-registeret
            </Undertittel>
            <div className={"mine-ansatte__sok-og-filter"}>
          <NedtrekksMenyForFiltrering onFiltrering={filtreringValgt}/>
            <Sokefelt onChange={onSoketekstChange} soketekst={soketekst}/>
            </div>
            <div className={'mine-ansatte__topp'}>
                <div tabIndex={0} className={'mine-ansatte__antall-forhold'}>
                    {listeMedArbeidsForhold.length} arbeidsforhold
                </div>
                <SideBytter
                    className={'sidebytter'}
                    byttSide={setIndeksOgGenererListe}
                    antallSider={antallSider}
                    naVarendeSidetall={naVarendeSidetall}
                />
            </div>
            <TabellMineAnsatte
                className={'mine-ansatte__table'}
                listeMedArbeidsForhold={ansattForholdPaSiden}
                setNavarendeKolonne={setNavarendeKolonne}
                byttSide={setIndeksOgGenererListe}
                navarendeKolonne={navarendeKolonne}
            />
            <ListeMedAnsatteForMobil
                listeMedArbeidsForhold={ansattForholdPaSiden}
                className={'mine-ansatte__liste'}
            />
        </div>
            </>
    );
};

export default MineAnsatte;
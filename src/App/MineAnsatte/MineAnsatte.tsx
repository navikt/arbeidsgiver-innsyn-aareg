import React, { FunctionComponent, useEffect, useState } from 'react';
import './MineAnsatte.less';
import './stylingNedtrekksMeny.less';
import { Undertittel } from 'nav-frontend-typografi';
import { Button, Wrapper, Menu, MenuItem } from 'react-aria-menubutton';
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
    const [sokeresultat, setSokeresultat] = useState(Array<arbeidsforhold>());
    const listeFraAareg = genererMockingAvArbeidsForhold(300);

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
        if (soketekst.length>0) {
            setListeMedArbeidsForhold(byggArbeidsforholdSokeresultat(listeMedArbeidsForhold,soketekst));
        }
        else {
            setListeMedArbeidsForhold(listeFraAareg);
        }
    }, [soketekst]);

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
            <Wrapper className="wrapper" onSelection={filtreringValgt}>
                <Button className="wrapper__button">
                    Filtrer på aktive/avsluttede
                </Button>
                <Menu className="wrapper">
                    <MenuItem className="wrapper__valg" value={'visAlle'}>
                        Vis alle
                    </MenuItem>
                    <MenuItem className="wrapper__valg" value={'aktive'}>
                        Aktive
                    </MenuItem>
                    <MenuItem className="wrapper__valg" value={'avsluttede'}>
                        Avsluttede
                    </MenuItem>
                </Menu>
            </Wrapper>
            <Sokefelt onChange={onSoketekstChange} soketekst={soketekst}/>
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
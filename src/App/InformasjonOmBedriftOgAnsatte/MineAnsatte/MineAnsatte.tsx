import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import './MineAnsatte.less';
import { Undertittel } from 'nav-frontend-typografi';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import SideBytter from './SideBytter/SideBytter';
import ListeMedAnsatteForMobil from './ListeMineAnsatteForMobil/ListeMineAnsatteForMobil';
import TabellMineAnsatte from './TabellMineAnsatte/TabellMineAnsatte';
import {
    filtrerAktiveOgAvsluttede,
    sorterArbeidsforhold,
} from './sorteringOgFiltreringsFunksjoner';

import { Button, Wrapper, Menu, MenuItem } from 'react-aria-menubutton';
import {
    regnUtantallSider,
    regnUtArbeidsForholdSomSkalVisesPaEnSide,
    visEllerSkjulChevroner,
} from './pagineringsFunksjoner';
import { arbeidsforhold } from '../../../Objekter/Ansatte';

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
    const { mineAnsatte } = useContext(OrganisasjonsDetaljerContext);
    const [ansattForholdPaSiden, setAnsattForholdPaSiden] = useState(Array<arbeidsforhold>());
    const [antallSider, setAntallSider] = useState(0);
    const [naVarendeSidetall, setnaVarendeSidetall] = useState(1);
    const initialKolonne: KolonneState = {
        erValgt: true,
        sorteringsAttributt: SorteringsAttributt.NAVN,
        reversSortering: false,
    };

    const [navarendeKolonne, setNavarendeKolonne] = useState(initialKolonne);
    const [filterState, setFilterState] = useState('visAlle');
    const arbeidsforholdPerSide = 25;

    const setIndeksOgGenererListe = (indeks: number) => {
        setnaVarendeSidetall(indeks);
    };

    const filtreringValgt = (value: any, event: any) => {
        setFilterState(value);
    };

    useEffect(() => {
        let sortertListe = sorterArbeidsforhold(
            mineAnsatte.arbeidsforholdoversikter,
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
    }, [mineAnsatte, naVarendeSidetall, navarendeKolonne, filterState, antallSider]);

    useEffect(() => {
        setnaVarendeSidetall(1);
    }, [navarendeKolonne]);

    return (
        <div className={'mine-ansatte'}>
            <Undertittel className={'mine-ansatte__systemtittel'} tabIndex={0}>
                Opplysninger fra Aa-registeret
            </Undertittel>
            <Wrapper className="MyMenuButton" onSelection={filtreringValgt}>
                <Button className="MyMenuButton-button">
                    Filtrer på aktive eller avsluttede arbeidsforhold
                </Button>
                <Menu className="MyMenuButton-menu">
                    <MenuItem className="MyMenuButton-menuItem" value={'visAlle'}>
                        Vis alle
                    </MenuItem>
                    <MenuItem className="MyMenuButton-menuItem" value={'aktive'}>
                        Aktive
                    </MenuItem>
                    <MenuItem className="MyMenuButton-menuItem" value={'avsluttede'}>
                        Avsluttede
                    </MenuItem>
                </Menu>
            </Wrapper>
            <div className={'mine-ansatte__topp'}>
                <div tabIndex={0} className={'mine-ansatte__antall-forhold'}>
                    {mineAnsatte.arbeidsforholdoversikter.length} arbeidsforhold
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
    );
};

export default MineAnsatte;

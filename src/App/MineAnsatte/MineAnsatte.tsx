import React, { FunctionComponent, useEffect, useState } from 'react';
import './MineAnsatte.less';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import SideBytter from './SideBytter/SideBytter';
import ListeMedAnsatteForMobil from './ListeMineAnsatteForMobil/ListeMineAnsatteForMobil';
import TabellMineAnsatte from './TabellMineAnsatte/TabellMineAnsatte';
import { filtrerAktiveOgAvsluttede, sorterArbeidsforhold } from './sorteringOgFiltreringsFunksjoner';

import {
    regnUtantallSider,
    regnUtArbeidsForholdSomSkalVisesPaEnSide,
    visEllerSkjulChevroner
} from './pagineringsFunksjoner';
import { arbeidsforhold, ObjektFraAAregisteret } from '../Objekter/ObjektFraAAreg';
import Sokefelt from './Sokefelt/Sokefelt';
import { byggArbeidsforholdSokeresultat } from './Sokefelt/byggArbeidsforholdSokeresultat';
import NedtrekksMenyForFiltrering from './NedtrekksMenyForFiltrering/NedtrekksMenyForFiltrering';
import { hentArbeidsforholdFraAAreg } from '../../api/AaregApi';
import { Organisasjon } from '../Objekter/OrganisasjonFraAltinn';
import { Arbeidstaker } from '../Objekter/Arbeidstaker';

export enum SorteringsAttributt {
    NAVN,
    FNR,
    YRKE,
    STARTDATO,
    SLUTTDATO,
    VARSEL
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
    const [ansattForholdPaSiden, setAnsattForholdPaSiden] = useState(Array<arbeidsforhold>());
    const [antallSider, setAntallSider] = useState(0);
    const [naVarendeSidetall, setnaVarendeSidetall] = useState(1);
    const [listeMedArbeidsForhold, setListeMedArbeidsForhold] = useState(Array<arbeidsforhold>());
    const initialKolonne: KolonneState = {
        erValgt: true,
        sorteringsAttributt: SorteringsAttributt.NAVN,
        reversSortering: false
    };
    const [navarendeKolonne, setNavarendeKolonne] = useState(initialKolonne);
    const [filterState, setFilterState] = useState('visAlle');
    const [soketekst, setSoketekst] = useState('');
    const [listeFraAareg, setListeFraAareg] = useState(Array<arbeidsforhold>());
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
            hentogSettArbeidsforhold().then(responsAareg => setListeFraAareg(responsAareg.arbeidsforholdoversikter));
        }
    }, [props.valgtOrganisasjon]);

    useEffect(() => {
        if (soketekst.length > 0) {
            setListeMedArbeidsForhold(byggArbeidsforholdSokeresultat(listeFraAareg, soketekst));
        } else {
            setListeMedArbeidsForhold(listeFraAareg);
        }
    }, [soketekst, listeFraAareg]);

    useEffect(() => {
        let sortertListe = sorterArbeidsforhold(listeMedArbeidsForhold, navarendeKolonne.sorteringsAttributt);
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
    }, [navarendeKolonne, soketekst]);

    return (
        <div className={'mine-ansatte'}>
            <Undertittel className={'mine-ansatte__systemtittel'} tabIndex={0}>
                Opplysninger fra Aa-registeret
            </Undertittel>
            <div className={'mine-ansatte__sok-og-filter'}>
                <NedtrekksMenyForFiltrering onFiltrering={filtreringValgt} />
                <Sokefelt onChange={onSoketekstChange} soketekst={soketekst} />
            </div>
            <div className={'mine-ansatte__topp'}>
                <div tabIndex={0} className={'mine-ansatte__antall-forhold'}>
                    <Normaltekst>{listeMedArbeidsForhold.length} arbeidsforhold</Normaltekst>
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
                settValgtArbeidsgiver={props.setValgtArbeidstaker}
                valgtBedrift={props.valgtOrganisasjon.OrganizationNumber}
            />
            <ListeMedAnsatteForMobil
                listeMedArbeidsForhold={ansattForholdPaSiden}
                className={'mine-ansatte__liste'}
                settValgtArbeidsgiver={props.setValgtArbeidstaker}
                valgtBedrift={props.valgtOrganisasjon.OrganizationNumber}
            />
        </div>
    );
};

export default MineAnsatte;

import React, {FunctionComponent, SyntheticEvent, useEffect, useState} from 'react';
import './MineAnsatte.less';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import SideBytter from './SideBytter/SideBytter';
import ListeMedAnsatteForMobil from './ListeMineAnsatteForMobil/ListeMineAnsatteForMobil';
import TabellMineAnsatte from './TabellMineAnsatte/TabellMineAnsatte';
import {
    filtrerAktiveOgAvsluttede,
    sorterArbeidsforhold, tellAntallAktiveOgInaktiveArbeidsforhold
} from './sorteringOgFiltreringsFunksjoner';

import {
    regnUtantallSider,
    regnUtArbeidsForholdSomSkalVisesPaEnSide,
    visEllerSkjulChevroner
} from './pagineringsFunksjoner';
import { ObjektFraAAregisteret } from '../Objekter/ObjektFraAAreg';
import Sokefelt from './Sokefelt/Sokefelt';
import { byggArbeidsforholdSokeresultat } from './Sokefelt/byggArbeidsforholdSokeresultat';
import { hentArbeidsforholdFraAAreg } from '../../api/AaregApi';
import { Organisasjon } from '../Objekter/OrganisasjonFraAltinn';
import { Arbeidstaker } from '../Objekter/Arbeidstaker';
import ExcelEksport from './ExcelEksport/ExcelEksport';
import {Arbeidsforhold} from "../Objekter/ArbeidsForhold";
import {ToggleKnappPureProps} from 'nav-frontend-toggle';
import Filtervalg from "./Filtervalg/Filtervalg";
import { AlertStripeInfo } from 'nav-frontend-alertstriper';

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
    const [ansattForholdPaSiden, setAnsattForholdPaSiden] = useState(Array<Arbeidsforhold>());
    const [antallSider, setAntallSider] = useState(0);
    const [naVarendeSidetall, setnaVarendeSidetall] = useState(1);
    const [listeMedArbeidsForhold, setListeMedArbeidsForhold] = useState(Array<Arbeidsforhold>());
    const initialKolonne: KolonneState = {
        erValgt: true,
        sorteringsAttributt: SorteringsAttributt.NAVN,
        reversSortering: false
    };
    const [navarendeKolonne, setNavarendeKolonne] = useState(initialKolonne);
    const [filterState, setFilterState] = useState('Alle');
    const [soketekst, setSoketekst] = useState('');
    const [listeFraAareg, setListeFraAareg] = useState(Array<Arbeidsforhold>());
    const [erFiltrertPaVarsler, setErFiltrertPaVarsler] = useState(false);
    const arbeidsforholdPerSide = 25;

    const setIndeksOgGenererListe = (indeks: number) => {
        setnaVarendeSidetall(indeks);
    };
    const filtreringValgt = (event: SyntheticEvent<EventTarget>,toggles: ToggleKnappPureProps[]) => {
        toggles.forEach(toggle => {
            if (toggle.pressed === true && toggle.children) {
                const includesString: boolean = true;
                switch (includesString) {
                    case (toggle.children.toString().startsWith("Alle")):
                        setFilterState("Alle");
                        break;
                    case (toggle.children.toString().startsWith("Aktive")):
                        setFilterState("Aktive");
                        break;
                    case (toggle.children.toString().startsWith("Avsluttede")):
                        setFilterState("Avsluttede");
                        break;
                    default:
                        break;
                }
                ;

            }
            ;
        })
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
            hentogSettArbeidsforhold().then(responsAareg => {
                setListeFraAareg(responsAareg.arbeidsforholdoversikter);
            });
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
        if (filterState !== 'Alle') {
            const visAktive = filterState === 'Aktive';
            sortertListe = filtrerAktiveOgAvsluttede(sortertListe, visAktive);
        }
        setAntallSider(regnUtantallSider(arbeidsforholdPerSide, sortertListe.length));
        const ansattForholdPaNavarendeSide: Arbeidsforhold[] = regnUtArbeidsForholdSomSkalVisesPaEnSide(
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
        const filtrertPaVarsler = listeFraAareg.filter(forhold => {
                if (forhold.varslingskode && erFiltrertPaVarsler ) {
                    if (forhold.varslingskode.length) {
                        return forhold
                    }
                }
                if (!erFiltrertPaVarsler) {
                    return forhold
                }
                return null
            }
        );
        setListeMedArbeidsForhold(filtrertPaVarsler);
        setnaVarendeSidetall(1);
    }, [erFiltrertPaVarsler,listeFraAareg]);

    return (
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
            <AlertStripeInfo className = {"mine-ansatte__informasjon"}>Under finner du en oversikt over arbeidsforhold rapportert inn etter 01.01.2015. Hvis du finner feil i oversikten skal disse rapporteres inn via A-meldingen. </AlertStripeInfo>
            <div className={'mine-ansatte__sok-og-filter'}>
                <Normaltekst>Arbeidsforhold</Normaltekst>
                { listeFraAareg.length > 0 && <Filtervalg filtreringValgt={filtreringValgt} overSiktOverAntallAktiveOgInaktive={tellAntallAktiveOgInaktiveArbeidsforhold(listeFraAareg)} setfiltrerPaVarsler={() => setErFiltrertPaVarsler(!erFiltrertPaVarsler)}/>
          }
                <Sokefelt onChange={onSoketekstChange} soketekst={soketekst} />
            </div>
            <div className={'mine-ansatte__topp'}>
                <div tabIndex={0} className={'mine-ansatte__antall-forhold'}>
                    <Normaltekst>{listeMedArbeidsForhold.length} arbeidsforhold</Normaltekst>
                </div>
                {antallSider > 1 && <SideBytter
                    className={'sidebytter'}
                    byttSide={setIndeksOgGenererListe}
                    antallSider={antallSider}
                    naVarendeSidetall={naVarendeSidetall}
                />}
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

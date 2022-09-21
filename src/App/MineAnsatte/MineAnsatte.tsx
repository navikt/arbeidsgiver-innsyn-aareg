import React, { FunctionComponent, useContext } from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import Chevron from 'nav-frontend-chevron';
import { BedriftsmenyContext } from '../Context/BedriftsmenyProvider';
import { FiltrerteOgSorterteArbeidsforholdContext } from '../Context/FiltrerteOgSorterteArbeidsforholdProvider';
import { useSearchParameters } from '../../utils/UrlManipulation';
import { regnUtantallSider, regnUtArbeidsForholdSomSkalVisesPaEnSide } from './pagineringsFunksjoner';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import Progressbar from './Progressbar/Progressbar';
import MineAnsatteTopp from './MineAnsatteTopp/MineAnsatteTopp';
import TabellMineAnsatte from './TabellMineAnsatte/TabellMineAnsatte';
import ListeMedAnsatteForMobil from './ListeMineAnsatteForMobil/ListeMineAnsatteForMobil';
import SideBytter from './SideBytter/SideBytter';
import VelgTidligereVirksomhet from './VelgTidligereVirksomhet/VelgTidligereVirksomhet';
import IngenTilgangInfo from '../IngenTilgangInfo/IngenTilgangInfo';
import './MineAnsatte.less';
import { LenkeMedLogging } from '../GeneriskeKomponenter/LenkeMedLogging';

export enum SorteringsAttributt {
    NAVN,
    FNR,
    YRKE,
    STARTDATO,
    SLUTTDATO,
    VARSEL,
    PERMITTERINGSPROSENT,
    STILLINGSPROSENT,
}

export const MineNåværendeArbeidsforhold: FunctionComponent = () => {
    const { underenhet, hovedenhet, tidligereUnderenheter } = useContext(BedriftsmenyContext);
    const tilgangTidligereArbeidsforhold =
        hovedenhet?.tilgang === true && tidligereUnderenheter !== 'laster' && tidligereUnderenheter.length > 0;
    const overskriftMedOrganisasjonsdel = 'Opplysninger for ' + underenhet.Name;

    return (
        <div className='bakgrunnsside'>
            <div className='innhold-container'>
                <Brodsmulesti valgtOrg={underenhet.OrganizationNumber} />
                {tilgangTidligereArbeidsforhold && (
                    <div className='brodsmule hoyre'>
                        <LenkeMedLogging loggLenketekst={`tidligere-arbeidsforhold`}
                                         href={`tidligere-arbeidsforhold/?bedrift=${underenhet.OrganizationNumber}`}
                                         className={'brodsmule__direct-tidligere-arbeidsforhold'}
                        >
                            {'Arbeidsforhold i tidligere virksomheter for ' + hovedenhet?.Name}
                            <Chevron type='høyre' />
                        </LenkeMedLogging>
                    </div>
                )}

                <div className='mine-ansatte'>
                    <Systemtittel className='mine-ansatte__systemtittel'>{overskriftMedOrganisasjonsdel}</Systemtittel>
                    <MineArbeidsforhold />
                </div>
            </div>
        </div>
    );
};

export const MineTidligereArbeidsforhold: FunctionComponent = () => {
    const { underenhet, hovedenhet, tidligereUnderenheter } = useContext(BedriftsmenyContext);
    return (
        <div className='bakgrunnsside'>
            <div className='innhold-container'>
                <Brodsmulesti valgtOrg={underenhet.OrganizationNumber} />
                <div className='brodsmule venstre'>
                    <LenkeMedLogging loggLenketekst={`nåværende-arbeidsforhold`}
                                     href={`../?bedrift=${underenhet.OrganizationNumber}`}
                                     className={'brodsmule__direct-tidligere-arbeidsforhold'}
                    >
                        <Chevron type='venstre' />
                        Tilbake til arbeidsforhold
                    </LenkeMedLogging>
                </div>
                <div className='mine-ansatte'>
                    <Systemtittel className='mine-ansatte__systemtittel'>
                        {`Opplysninger for ${hovedenhet?.Name} org.nr ${hovedenhet?.OrganizationNumber}`}
                    </Systemtittel>
                    {tidligereUnderenheter !== 'laster' && <VelgTidligereVirksomhet />}
                    <MineArbeidsforhold />
                </div>
            </div>
        </div>
    );
};

const MineArbeidsforhold: FunctionComponent = () => {
    const { underenhet } = useContext(BedriftsmenyContext);
    const aaregContext = useContext(FiltrerteOgSorterteArbeidsforholdContext);
    const { getSearchParameter, setSearchParameter } = useSearchParameters();
    const sidetall = getSearchParameter('side') || '1';
    const setSideTallIUrlOgGenererListe = (indeks: number) => {
        setSearchParameter({ side: indeks.toString() });
    };
    const filtrertOgSortertListe = aaregContext?.lastestatus?.status === 'ferdig' ? aaregContext.lastestatus.arbeidsforhold : null;
    const ARBEIDSFORHOLDPERSIDE = 25;
    const antallSider = regnUtantallSider(ARBEIDSFORHOLDPERSIDE, filtrertOgSortertListe?.length ?? 0);
    const listeForNåværendeSidetall = regnUtArbeidsForholdSomSkalVisesPaEnSide(
        parseInt(sidetall),
        ARBEIDSFORHOLDPERSIDE,
        filtrertOgSortertListe ?? []
    );

    if (aaregContext === null) {
        return null;
    } else if (aaregContext.lastestatus.status === 'laster') {
        return <Progressbar estimertAntall={aaregContext.lastestatus.estimertAntall} />;
    } else if (aaregContext.lastestatus.status === 'ferdig') {
        return (
            <>
                <MineAnsatteTopp valgtOrganisasjon={underenhet} antallSider={antallSider} />
                {listeForNåværendeSidetall.length > 0 && (
                    <>
                        <TabellMineAnsatte
                            listeMedArbeidsForhold={listeForNåværendeSidetall}
                            byttSide={setSideTallIUrlOgGenererListe}
                        />
                        <ListeMedAnsatteForMobil
                            className='mine-ansatte__liste'
                            listeMedArbeidsForhold={listeForNåværendeSidetall}
                        />
                        {antallSider > 1 && (
                            <SideBytter plassering='nederst' className='nedre-sidebytter' antallSider={antallSider} />
                        )}
                    </>
                )}
            </>
        );
    } else if (aaregContext.lastestatus.status === 'ikke-tilgang') {
        return <IngenTilgangInfo />;
    } else {
        return (
            <div className='mine-ansatte__feilmelding-aareg'>
                <AlertStripeFeil>{aaregContext.lastestatus.beskjed}</AlertStripeFeil>
            </div>
        );
    }
};

import React, { FunctionComponent, useContext, useEffect } from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import Chevron from 'nav-frontend-chevron';
import { ArbeidsforholdContext } from '../ArbeidsforholdProvider';
import { regnUtantallSider, regnUtArbeidsForholdSomSkalVisesPaEnSide } from './pagineringsFunksjoner';
import Progressbar from './Progressbar/Progressbar';
import MineAnsatteTopp from './MineAnsatteTopp/MineAnsatteTopp';
import TabellMineAnsatte from './TabellMineAnsatte/TabellMineAnsatte';
import ListeMedAnsatteForMobil from './ListeMineAnsatteForMobil/ListeMineAnsatteForMobil';
import SideBytter from './SideBytter/SideBytter';
import VelgTidligereVirksomhet from './VelgTidligereVirksomhet/VelgTidligereVirksomhet';
import { loggTrykketPåTidligereArbeidsforholdSide } from '../amplitudefunksjonerForLogging';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import './MineAnsatte.less';
import { BedriftsmenyContext } from '../BedriftsmenyProvider';
import { Link } from 'react-router-dom';
import { useSearchParameters } from '../../utils/UrlManipulation';
import { FiltrerteOgSorterteArbeidsforholdContext } from '../FiltrerteOgSorterteArbeidsforholdProvider';
import IngenTilgangInfo from '../IngenTilgangInfo/IngenTilgangInfo';

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

export const MineNåværendeArbeidsforhold: FunctionComponent = () => {
    const { underenhet, hovedenhet, tidligereUnderenheter } = useContext(BedriftsmenyContext);

    const tilgangTidligereArbeidsforhold =
        hovedenhet !== null && hovedenhet.tilgang && tidligereUnderenheter !== 'laster' && tidligereUnderenheter.length > 0;
    const overskriftMedOrganisasjonsdel = 'Opplysninger for ' + underenhet.Name;

    return (
        <div className="bakgrunnsside">
            <div className="innhold-container">
                <Brodsmulesti valgtOrg={underenhet.OrganizationNumber} />

                {tilgangTidligereArbeidsforhold && (
                    <div className="brodsmule hoyre">
                        <Link
                            to={{
                                pathname: '/tidligere-arbeidsforhold',
                                search: `bedrift=${underenhet.OrganizationNumber}`
                            }}
                            className="brodsmule__direct-tidligere-arbeidsforhold"
                        >
                            {'Arbeidsforhold i tidligere virksomheter for ' + hovedenhet?.Name}
                            <Chevron type="høyre" />
                        </Link>
                    </div>
                )}

                <div className="mine-ansatte">
                    <Systemtittel className="mine-ansatte__systemtittel">{overskriftMedOrganisasjonsdel}</Systemtittel>
                    <MineArbeidsforhold />
                </div>
            </div>
        </div>
    );
};

export const MineTidligereArbeidsforhold: FunctionComponent = () => {
    const aareg = useContext(ArbeidsforholdContext);
    const { underenhet, hovedenhet, tidligereUnderenheter } = useContext(BedriftsmenyContext);

    const antallArbeidsforhold =
        aareg?.lastestatus?.status === 'ferdig' ? aareg.lastestatus.arbeidsforhold.length : null;

    useEffect(() => {
        if (antallArbeidsforhold) {
            loggTrykketPåTidligereArbeidsforholdSide(antallArbeidsforhold);
        }
    }, [antallArbeidsforhold]);

    return (
        <div className="bakgrunnsside">
            <div className="innhold-container">
                <Brodsmulesti valgtOrg={underenhet.OrganizationNumber} />

                <div className="brodsmule venstre">
                    <Link
                        className="brodsmule__direct-tidligere-arbeidsforhold"
                        to={{
                            pathname: '/',
                            search: `bedrift=${underenhet.OrganizationNumber}`
                        }}
                    >
                        <Chevron type="venstre" />
                        Tilbake til arbeidsforhold
                    </Link>
                </div>

                <div className="mine-ansatte">
                    <Systemtittel className="mine-ansatte__systemtittel">
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
    const aareg = useContext(FiltrerteOgSorterteArbeidsforholdContext);
    const { getSearchParameter, setSearchParameter } = useSearchParameters();

    const sidetall = getSearchParameter('side') || '1';

    const setSideTallIUrlOgGenererListe = (indeks: number) => {
        setSearchParameter({ side: indeks.toString() });
    };

    const filtrertOgSortertListe = aareg?.lastestatus?.status === 'ferdig' ? aareg.lastestatus.arbeidsforhold : [];

    const ARBEIDSFORHOLDPERSIDE = 25;
    const antallSider = regnUtantallSider(ARBEIDSFORHOLDPERSIDE, filtrertOgSortertListe.length);
    const listeForNåværendeSidetall = regnUtArbeidsForholdSomSkalVisesPaEnSide(
        parseInt(sidetall),
        ARBEIDSFORHOLDPERSIDE,
        filtrertOgSortertListe
    );

    if (aareg === null) {
        return null;
    } else if (aareg.lastestatus.status === 'laster') {
        return <Progressbar estimertAntall={aareg.lastestatus.estimertAntall} />;
    } else if (aareg.lastestatus.status === 'ferdig') {
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
                            className="mine-ansatte__liste"
                            listeMedArbeidsForhold={listeForNåværendeSidetall}
                        />
                        {antallSider > 1 && (
                            <SideBytter plassering="nederst" className="nedre-sidebytter" antallSider={antallSider} />
                        )}
                    </>
                )}
            </>
        );
    } else if (aareg.lastestatus.status === 'ikke-tilgang') {
        return <IngenTilgangInfo />;
    } else {
        return (
            <div className="mine-ansatte__feilmelding-aareg">
                <AlertStripeFeil>{aareg.lastestatus.beskjed}</AlertStripeFeil>
            </div>
        );
    }
};

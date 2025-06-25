import React, { FunctionComponent, useContext } from 'react';
import { BedriftsmenyContext } from '../Context/BedriftsmenyProvider';
import { FiltrerteOgSorterteArbeidsforholdContext } from '../Context/FiltrerteOgSorterteArbeidsforholdProvider';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import Progressbar from './Progressbar/Progressbar';
import MineAnsatteTopp from './MineAnsatteTopp/MineAnsatteTopp';
import TabellMineAnsatte from './TabellMineAnsatte/TabellMineAnsatte';
import ListeMedAnsatteForMobil from './ListeMineAnsatteForMobil/ListeMineAnsatteForMobil';
import SideBytter from './SideBytter/SideBytter';
import VelgTidligereVirksomhet from './VelgTidligereVirksomhet/VelgTidligereVirksomhet';
import IngenTilgangInfo from '../IngenTilgangInfo/IngenTilgangInfo';
import './MineAnsatte.css';
import { LenkeMedLogging } from '../GeneriskeKomponenter/LenkeMedLogging';
import { Alert, Heading } from '@navikt/ds-react';
import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';

export const MineNåværendeArbeidsforhold: FunctionComponent = () => {
    const { underenhet, hovedenhet, tidligereUnderenheter } = useContext(BedriftsmenyContext);
    const tilgangTidligereArbeidsforhold =
        hovedenhet?.tilgang === true &&
        tidligereUnderenheter !== 'laster' &&
        tidligereUnderenheter.length > 0;
    const overskriftMedOrganisasjonsdel = 'Opplysninger for ' + underenhet.Name;

    return (
        <div className="bakgrunnsside">
            <div className="innhold-container">
                <Brodsmulesti valgtOrg={underenhet.OrganizationNumber} />
                {tilgangTidligereArbeidsforhold && (
                    <div className="brodsmule hoyre">
                        <LenkeMedLogging
                            loggLenketekst={`tidligere-arbeidsforhold`}
                            href={`tidligere-arbeidsforhold/?bedrift=${underenhet.OrganizationNumber}`}
                            className={'brodsmule__direct-tidligere-arbeidsforhold'}
                        >
                            {'Arbeidsforhold i tidligere virksomheter for ' + hovedenhet?.Name}
                            <ChevronRightIcon />
                        </LenkeMedLogging>
                    </div>
                )}

                <div className="mine-ansatte">
                    <Heading size="medium" className="mine-ansatte__systemtittel">
                        {overskriftMedOrganisasjonsdel}
                    </Heading>
                    <MineArbeidsforhold />
                </div>
            </div>
        </div>
    );
};

export const MineTidligereArbeidsforhold: FunctionComponent = () => {
    const { underenhet, hovedenhet, tidligereUnderenheter } = useContext(BedriftsmenyContext);
    return (
        <div className="bakgrunnsside">
            <div className="innhold-container">
                <Brodsmulesti valgtOrg={underenhet.OrganizationNumber} />
                <div className="brodsmule venstre">
                    <LenkeMedLogging
                        loggLenketekst={`nåværende-arbeidsforhold`}
                        href={`../?bedrift=${underenhet.OrganizationNumber}`}
                        className={'brodsmule__direct-tidligere-arbeidsforhold'}
                    >
                        <ChevronLeftIcon />
                        Tilbake til arbeidsforhold
                    </LenkeMedLogging>
                </div>
                <div className="mine-ansatte">
                    <Heading size="medium" className="mine-ansatte__systemtittel">
                        {`Opplysninger for ${hovedenhet?.Name} org.nr ${hovedenhet?.OrganizationNumber}`}
                    </Heading>
                    {tidligereUnderenheter !== 'laster' && <VelgTidligereVirksomhet />}
                    <MineArbeidsforhold />
                </div>
            </div>
        </div>
    );
};

const MineArbeidsforhold: FunctionComponent = () => {
    const { aareg } = useContext(FiltrerteOgSorterteArbeidsforholdContext);

    if (aareg === null) {
        return null;
    } else if (aareg.lastestatus.status === 'laster') {
        return <Progressbar estimertAntall={aareg.lastestatus.estimertAntall} />;
    } else if (aareg.lastestatus.status === 'ferdig') {
        return (
            <>
                <MineAnsatteTopp />
                <TabellMineAnsatte />
                <ListeMedAnsatteForMobil className="mine-ansatte__liste" />
                <SideBytter />
            </>
        );
    } else if (aareg.lastestatus.status === 'ikke-tilgang') {
        return <IngenTilgangInfo />;
    } else {
        return (
            <div className="mine-ansatte__feilmelding-aareg">
                <Alert variant="error">{aareg.lastestatus.beskjed}</Alert>
            </div>
        );
    }
};

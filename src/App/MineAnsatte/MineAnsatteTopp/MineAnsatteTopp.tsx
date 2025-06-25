import React, { FunctionComponent, useContext } from 'react';
import ExcelEksport from '../ExcelEksport/ExcelEksport';
import Sokefelt from '../Sokefelt/Sokefelt';
import Filtervalg from '../Filtervalg/Filtervalg';
import SideBytter from '../SideBytter/SideBytter';
import NyFaneIkon from './NyFaneIkon';
import { FiltrerteOgSorterteArbeidsforholdContext } from '../../Context/FiltrerteOgSorterteArbeidsforholdProvider';
import './MineAnsatteTopp.css';
import { Alert, BodyLong, BodyShort, Heading, Link as Lenke } from '@navikt/ds-react';

const MineAnsatteTopp: FunctionComponent = () => {
    const { currentSelection, count, searchParams, aareg } = useContext(
        FiltrerteOgSorterteArbeidsforholdContext
    );
    const { sok } = searchParams;

    let antallArbeidsforholdPaSideTekst;
    if (sok.length === 0) {
        antallArbeidsforholdPaSideTekst = `Viser ${currentSelection.length} av ${count.Alle} arbeidsforhold`;
    } else {
        antallArbeidsforholdPaSideTekst = `${currentSelection.length} treff for "${sok}"`;
    }

    const viserTidligereVirksomhet = window.location.href.includes('tidligere-arbeidsforhold');
    const tekstFornedlagtVirksomhet = viserTidligereVirksomhet
        ? ' Merk at dette er en nedlagt eller overdratt virksomhet, så ingen av disse arbeidsforholdene skal være aktive.'
        : '';

    const skatteetatenUrl =
        'https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/a-meldingen/veiledning/';
    return (
        <>
            {count.Alle === 0 ? (
                <Alert variant="info" className="mine-ansatte__informasjon">
                    Det finnes ingen arbeidsforhold rapportert inn til Aa-registeret etter
                    01.01.2015 for valgt underenhet. Dersom dette er feil må det rettes opp via
                    a-meldingen.
                </Alert>
            ) : (
                <>
                    <div className="mine-ansatte__header">
                        <Alert variant="info" className="informasjon">
                            <BodyShort>
                                {'Oversikten viser alle arbeidsforhold rapportert etter 01.01.2015 for valgt virksomhet.' +
                                    tekstFornedlagtVirksomhet +
                                    ' Hvis du finner feil i oversikten, skal du som arbeidsgiver endre dette gjennom a-meldingen.'}
                            </BodyShort>
                            <BodyShort>
                                {'Se '}
                                <Lenke href={skatteetatenUrl} target="_blank">
                                    <span>Skatteetatens veiledning til a-meldingen</span>
                                    <NyFaneIkon />
                                </Lenke>
                            </BodyShort>
                        </Alert>
                        {currentSelection.length > 0 && <ExcelEksport />}
                    </div>
                    <div className="mine-ansatte__sok-og-filter">
                        <BodyShort>Arbeidsforhold</BodyShort>
                        <Filtervalg />
                        <Sokefelt />
                    </div>
                    <div className="mine-ansatte__topp">
                        <BodyShort className="mine-ansatte__antall-forhold" aria-live="assertive">
                            {antallArbeidsforholdPaSideTekst}
                        </BodyShort>
                        <SideBytter />
                    </div>
                </>
            )}

            {count.Alle > 0 && currentSelection.length === 0 && (
                <div className="mine-ansatte__bytt-filtrering">
                    <Heading size="medium">Finner ingen arbeidsforhold.</Heading>
                    <BodyLong>Prøv å endre søkeord eller bytt filtreringsvalg.</BodyLong>
                </div>
            )}
        </>
    );
};

export default MineAnsatteTopp;

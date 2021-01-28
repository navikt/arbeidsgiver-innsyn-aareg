/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Ingress, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { Organisasjon } from '../../Objekter/OrganisasjonFraAltinn';
import { loggBrukerTrykketPaVeiledning } from '../../amplitudefunksjonerForLogging';
import ExcelEksport from '../ExcelEksport/ExcelEksport';
import Sokefelt from '../Sokefelt/Sokefelt';
import Filtervalg from '../Filtervalg/Filtervalg';
import SideBytter from '../SideBytter/SideBytter';
import { tellAntallAktiveOgInaktiveArbeidsforhold } from '../sorteringOgFiltreringsFunksjoner';
import NyFaneIkon from './NyFaneIkon';
import { ArbeidsforholdContext } from '../../ArbeidsforholdProvider';
import { useSearchParameters } from '../../../utils/UrlManipulation';
import { BedriftsmenyContext } from '../../BedriftsmenyProvider';
import { FiltrerteOgSorterteArbeidsforholdContext } from '../../FiltrerteOgSorterteArbeidsforholdProvider';
import './MineAnsatteTopp.less';

interface Props {
    valgtOrganisasjon: Organisasjon;
    antallSider: number;
}

const MineAnsatteTopp: FunctionComponent<Props> = ({ antallSider }) => {
    const { underenhet } = useContext(BedriftsmenyContext);
    const alleAareg = useContext(ArbeidsforholdContext);
    const filtrertAareg = useContext(FiltrerteOgSorterteArbeidsforholdContext);
    const { getSearchParameter } = useSearchParameters();

    const soketekst = getSearchParameter('sok') || '';

    const alleArbeidsforhold = alleAareg?.lastestatus?.status === 'ferdig' ? alleAareg.lastestatus.arbeidsforhold : [];

    const filtrertOgSortertListe =
        filtrertAareg?.lastestatus?.status === 'ferdig' ? filtrertAareg.lastestatus.arbeidsforhold : [];

    const [antallArbeidsforholdPaSideTekst, setAntallArbeidsforholdPaSideTekst] = useState(
        `Viser ${filtrertOgSortertListe.length} av ${alleArbeidsforhold.length} arbeidsforhold`
    );

    useEffect(() => {
        if (soketekst.length === 0) {
            setAntallArbeidsforholdPaSideTekst(
                `Viser ${filtrertOgSortertListe.length} av ${alleArbeidsforhold.length} arbeidsforhold`
            );
        } else {
            setAntallArbeidsforholdPaSideTekst(`${filtrertOgSortertListe.length} treff for "${soketekst}"`);
        }
    }, [filtrertOgSortertListe, alleArbeidsforhold, soketekst]);

    const antallVarsler =
        alleAareg?.lastestatus?.status === 'ferdig'
            ? alleAareg.lastestatus.arbeidsforhold.filter((forhold) => forhold.varsler).length
            : 0;

    const viserTidligereVirksomhet = window.location.href.includes('tidligere-arbeidsforhold');
    const tekstFornedlagtVirksomhet = viserTidligereVirksomhet
        ? ' Merk at dette er en nedlagt eller overdratt virksomhet, så ingen av disse arbeidsforholdene skal være aktive.'
        : '';

    const skatteetatenUrl = 'https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/a-meldingen/veiledning/';
    return (
        <>
            {alleArbeidsforhold.length === 0 ? (
                <AlertStripeInfo className="mine-ansatte__informasjon">
                    Det finnes ingen arbeidsforhold rapportert inn til Aa-registeret etter 01.01.2015 for valgt
                    underenhet. Dersom dette er feil må det rettes opp via a-meldingen.
                </AlertStripeInfo>
            ) : alleArbeidsforhold.length > 0 ? (
                <>
                    <div className="mine-ansatte__header">
                        <AlertStripeInfo className="informasjon">
                            <Normaltekst>
                                {'Oversikten viser alle arbeidsforhold rapportert etter 01.01.2015 for valgt virksomhet.' +
                                    tekstFornedlagtVirksomhet +
                                    ' Hvis du finner feil i oversikten, skal du som arbeidsgiver endre dette gjennom a-meldingen.'}
                            </Normaltekst>
                            <Normaltekst>
                                {'Se '}
                                <Lenke
                                    href={skatteetatenUrl}
                                    target="_blank"
                                    onClick={() => loggBrukerTrykketPaVeiledning()}
                                >
                                    <span>Skatteetatens veiledning til a-meldingen</span>
                                    <NyFaneIkon />
                                </Lenke>
                            </Normaltekst>
                        </AlertStripeInfo>
                        {filtrertOgSortertListe.length > 0 && (
                            <ExcelEksport
                                className="excel-export"
                                arbeidsforholdListe={filtrertOgSortertListe}
                                navnBedrift={underenhet.Name}
                                orgnrBedrift={underenhet.OrganizationNumber}
                            />
                        )}
                    </div>
                    <div className="mine-ansatte__sok-og-filter">
                        <Normaltekst>Arbeidsforhold</Normaltekst>
                        {alleArbeidsforhold.length > 0 && (
                            <Filtervalg
                                anallVarsler={antallVarsler}
                                overSiktOverAntallAktiveOgInaktive={tellAntallAktiveOgInaktiveArbeidsforhold(
                                    alleArbeidsforhold
                                )}
                            />
                        )}
                        <Sokefelt />
                    </div>
                    <div className="mine-ansatte__topp">
                        <Normaltekst className="mine-ansatte__antall-forhold" aria-live="assertive">
                            {antallArbeidsforholdPaSideTekst}
                        </Normaltekst>
                        {antallSider > 1 && (
                            <SideBytter plassering="overst" className="ovre-sidebytter" antallSider={antallSider} />
                        )}
                    </div>
                </>
            ) : null}

            {alleArbeidsforhold.length > 0 && filtrertOgSortertListe.length === 0 && (
                <div className="mine-ansatte__bytt-filtrering">
                    <Systemtittel>Finner ingen arbeidsforhold.</Systemtittel>
                    <Ingress>Prøv å endre søkeord eller bytt filtreringsvalg.</Ingress>
                </div>
            )}
        </>
    );
};

export default MineAnsatteTopp;

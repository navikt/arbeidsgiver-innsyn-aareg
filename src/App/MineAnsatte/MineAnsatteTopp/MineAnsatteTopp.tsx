/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { FunctionComponent } from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Ingress, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';
import { Organisasjon } from '../../Objekter/OrganisasjonFraAltinn';
import { loggBrukerTrykketPaVeiledning } from '../../amplitudefunksjonerForLogging';
import ExcelEksport from '../ExcelEksport/ExcelEksport';
import Sokefelt from '../Sokefelt/Sokefelt';
import Filtervalg from '../Filtervalg/Filtervalg';
import SideBytter from '../SideBytter/SideBytter';
import { tellAntallAktiveOgInaktiveArbeidsforhold } from '../sorteringOgFiltreringsFunksjoner';
import NyFaneIkon from './NyFaneIkon';
import './MineAnsatteTopp.less';

interface Props {
    alleArbeidsforhold: Arbeidsforhold[];
    filtrertOgSortertListe: Arbeidsforhold[];
    valgtOrganisasjon: Organisasjon;
    antallSider: number;
    antallVarsler: number;
    setParameterIUrl: (parameter: string, variabel: string) => void;
}

const MineAnsatteTopp: FunctionComponent<Props> = ({
    setParameterIUrl,
    alleArbeidsforhold,
    filtrertOgSortertListe,
    valgtOrganisasjon,
    antallVarsler,
    antallSider,

}) => {
    const viserTidligereVirksomhet = window.location.href.includes('tidligere-arbeidsforhold');
    const tekstFornedlagtVirksomhet = viserTidligereVirksomhet? ' Merk at dette er en nedlagt eller overdratt virksomhet, så ingen av disse arbeidsforholdene skal være aktive.' : '';

    const skatteetatenUrl = 'https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/a-meldingen/veiledning/';
    return (
        <>
            {alleArbeidsforhold.length === 0 ? (
                <AlertStripeInfo className="mine-ansatte__informasjon">
                    Det finnes ingen arbeidsforhold rapportert inn til Aa-registeret etter 01.01.2015 for valgt underenhet. Dersom dette er feil må det rettes opp via a-meldingen.
                </AlertStripeInfo>
            ) : alleArbeidsforhold.length > 0 ? (
                <>
                    <div className="mine-ansatte__header">
                        <AlertStripeInfo className="informasjon">
                            <Normaltekst>
                                {"Oversikten viser alle arbeidsforhold rapportert etter 01.01.2015 for valgt virksomhet." + tekstFornedlagtVirksomhet + " Hvis du finner feil i oversikten, skal du som arbeidsgiver endre dette gjennoma-meldingen."}
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
                                navnBedrift={valgtOrganisasjon.Name}
                                orgnrBedrift={valgtOrganisasjon.OrganizationNumber}
                            />
                        )}
                    </div>
                    <div className="mine-ansatte__sok-og-filter">
                        <Normaltekst>Arbeidsforhold</Normaltekst>
                        {alleArbeidsforhold.length > 0 && (
                            <Filtervalg
                                setParameterIUrl={setParameterIUrl}
                                anallVarsler={antallVarsler}
                                overSiktOverAntallAktiveOgInaktive={tellAntallAktiveOgInaktiveArbeidsforhold(
                                    alleArbeidsforhold
                                )}
                            />
                        )}
                        <Sokefelt setParameterIUrl={setParameterIUrl} />
                    </div>
                    <div className="mine-ansatte__topp">
                        <Normaltekst className="mine-ansatte__antall-forhold" aria-live="assertive">
                            {`Viser ${filtrertOgSortertListe.length} av ${alleArbeidsforhold.length} arbeidsforhold`}
                        </Normaltekst>
                        {antallSider > 1 && (
                            <SideBytter
                                plassering="overst"
                                className="ovre-sidebytter"
                                setParameterIUrl={setParameterIUrl}
                                antallSider={antallSider}
                            />
                        )}
                    </div>
                </>
            ) : null}

            { alleArbeidsforhold.length > 0 && filtrertOgSortertListe.length === 0 && (
                <div className="mine-ansatte__bytt-filtrering">
                    <Systemtittel>Finner ingen arbeidsforhold.</Systemtittel>
                    <Ingress>Prøv å endre søkeord eller bytt filtreringsvalg.</Ingress>
                </div>
            )}
        </>
    );
};

export default MineAnsatteTopp;
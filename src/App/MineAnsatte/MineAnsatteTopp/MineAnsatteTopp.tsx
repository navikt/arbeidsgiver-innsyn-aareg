/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { FunctionComponent, SyntheticEvent } from 'react';
import { ToggleKnappPureProps } from 'nav-frontend-toggle';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Ingress, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';
import ExcelEksport from '../ExcelEksport/ExcelEksport';
import Sokefelt from '../Sokefelt/Sokefelt';
import Filtervalg from '../Filtervalg/Filtervalg';
import SideBytter from '../SideBytter/SideBytter';
import { filtreringValgt, tellAntallAktiveOgInaktiveArbeidsforhold } from '../sorteringOgFiltreringsFunksjoner';
import './MineAnsatteTopp.less';
import Lenke from 'nav-frontend-lenker';
import NyFaneIkon from './NyFaneIkon';

import {loggBrukerTrykketPaVeiledning} from "../../amplitudefunksjonerForLogging";
import {Organisasjon} from "../../Objekter/OrganisasjonFraAltinn";

interface Props {
    responsFraAaregisteret: Arbeidsforhold[];
    lengdeResponsFiltrertListe: number;
    listeMedArbeidsforhold: Arbeidsforhold[];
    valgtOrganisasjon: Organisasjon;
    antallSider: number;
    soketekst: string;
    antallVarsler: number;
    setIndeksOgGenererListe: (indeks: number) => void;
    naVarendeSidetall: number;
    skalFiltrerePaVarsler: boolean;
    filtrerPaAktiveAvsluttede: string;
    setParameterIUrl: (parameter: string, variabel: string) => void;
}

const MineAnsatteTopp: FunctionComponent<Props> = (
    {
        setParameterIUrl,
        responsFraAaregisteret,
        lengdeResponsFiltrertListe,
        listeMedArbeidsforhold,
        valgtOrganisasjon,
        soketekst,
        antallVarsler,
        antallSider,
        setIndeksOgGenererListe,
        skalFiltrerePaVarsler,
        naVarendeSidetall,
        filtrerPaAktiveAvsluttede
    },

) => {
    const onSoketekstChange = (soketekst: string) => {
        setParameterIUrl("sok", soketekst);
        setIndeksOgGenererListe(1);
    };

    const velgFiltrering = (event: SyntheticEvent<EventTarget>, toggles: ToggleKnappPureProps[]) => {
        const filtrering = filtreringValgt(event, toggles);
        setParameterIUrl("filter", filtrering);
        setIndeksOgGenererListe(1);
    };

    const skatteetatenUrl = 'https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/a-meldingen/veiledning/';
    return (
        <>
            {responsFraAaregisteret.length === 0 ? (
                <AlertStripeInfo className="mine-ansatte__informasjon">
                    Det finnes ingen arbeidsforhold rapportert inn til Aa-registeret etter 01.01.2015 for valgt
                    underenhet. Dersom dette er feil må det rettes opp via a-meldingen.
                </AlertStripeInfo>
            ) : responsFraAaregisteret.length > 0 ? (
                <>
                    <div className="mine-ansatte__header">
                        <AlertStripeInfo className="informasjon">
                            <Normaltekst>
                                Oversikten viser alle arbeidsforhold rapportert etter 01.01.2015 for valgt virksomhet.
                                Hvis det er feil i et arbeidsforhold, skal du som arbeidsgiver endre dette gjennom a-meldingen.
                            </Normaltekst>
                            <Normaltekst>
                                {'Se '}
                                <Lenke href={skatteetatenUrl} target="_blank" onClick={() => loggBrukerTrykketPaVeiledning()}>
                                    <span>Skatteetatens veiledning til a-meldingen</span>
                                    <NyFaneIkon />
                                </Lenke>
                            </Normaltekst>
                        </AlertStripeInfo>
                        {lengdeResponsFiltrertListe > 0 && (
                            <ExcelEksport
                                className="excel-export"
                                arbeidsforholdListe={listeMedArbeidsforhold}
                                navnBedrift={valgtOrganisasjon.Name}
                                orgnrBedrift={valgtOrganisasjon.OrganizationNumber}
                            />
                        )}
                    </div>
                    <div className="mine-ansatte__sok-og-filter">
                        <Normaltekst>Arbeidsforhold</Normaltekst>
                        {responsFraAaregisteret.length > 0 && (
                            <Filtervalg
                                setParameterIUrl = {setParameterIUrl}
                                skalFiltrerePaVarsler={skalFiltrerePaVarsler}
                                filtrerPaAktiveAvsluttede={filtrerPaAktiveAvsluttede}
                                anallVarsler={antallVarsler}
                                filtreringValgt={velgFiltrering}
                                overSiktOverAntallAktiveOgInaktive={tellAntallAktiveOgInaktiveArbeidsforhold(
                                    responsFraAaregisteret
                                )}
                                setfiltrerPaVarsler={() => {
                                    setParameterIUrl("varsler",(!skalFiltrerePaVarsler).toString());
                                    setIndeksOgGenererListe(1);
                                }
                                }
                            />
                        )}
                        <Sokefelt onChange={onSoketekstChange} soketekst={soketekst} />
                    </div>
                    <div className="mine-ansatte__topp">
                        <Normaltekst className="mine-ansatte__antall-forhold" tabIndex={0}>
                            Viser {lengdeResponsFiltrertListe} av {responsFraAaregisteret.length} arbeidsforhold
                        </Normaltekst>
                        {antallSider > 1 && (
                            <SideBytter
                                plassering="overst"
                                className="ovre-sidebytter"
                                byttSide={setIndeksOgGenererListe}
                                antallSider={antallSider}
                                naVarendeSidetall={naVarendeSidetall}
                            />
                        )}
                    </div>
                </>
            ) : null}

            {responsFraAaregisteret.length > 0 && lengdeResponsFiltrertListe === 0 && (
                <div className="mine-ansatte__bytt-filtrering">
                    <Systemtittel>Finner ingen arbeidsforhold.</Systemtittel>
                    <Ingress>Prøv å endre søkeord eller bytt filtreringsvalg.</Ingress>
                </div>
            )}
        </>
    );
};

export default MineAnsatteTopp;

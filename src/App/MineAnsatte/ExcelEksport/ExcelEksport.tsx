import React, { useState } from 'react';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
// @ts-ignore
import ReactExport from 'react-data-export';
import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';
import { filtrerAktiveOgAvsluttede } from '../sorteringOgFiltreringsFunksjoner';
import {loggBrukerTrykketPaExcel} from "../../amplitudefunksjonerForLogging";
import varselikon from './varselikon.svg';
import { convertToDataset, infosideData, datasett } from './excelexport-utils';
import './ExcelEksport.less'

Modal.setAppElement('#root');
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

type ExcelEksportProps = {
    arbeidsforholdListe: Arbeidsforhold[];
    className: string;
    navnBedrift: string;
    orgnrBedrift: string;
};

const ExcelEksport = (props: ExcelEksportProps) => {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const dagensDato: Date = new Date();
    const aktiveArbeidsforhold = filtrerAktiveOgAvsluttede(props.arbeidsforholdListe, 'Aktive');
    const aktiveArbeidsforholdDataset = convertToDataset(aktiveArbeidsforhold);
    const avsluttedeArbeidsforhold = filtrerAktiveOgAvsluttede(props.arbeidsforholdListe, 'Avsluttede');
    const avsluttedeArbeidsforholdDataset = convertToDataset(avsluttedeArbeidsforhold);

    return (
        <div className={props.className} onClick={() => {loggBrukerTrykketPaExcel()}}>
            <Hovedknapp className="excel-eksport-knapp" onClick={() => openModal()}>Last ned som excelfil</Hovedknapp>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => closeModal()}
                closeButton={true}
                contentLabel="Last ned Excelfil modal"
                className="eksport-modal"
            >
                <div className="eksport-modal__innhold">
                    <Undertittel className="eksport-modal__overskrift">
                        Last ned arbeidsforhold fra Aa-registret
                    </Undertittel>
                    <div className="eksport-modal__varsel">
                        <img
                            src={varselikon}
                            alt=""
                            className="varselikon"
                        />
                        <Normaltekst className="varseltekst">Personvern - lagre filen sikkert</Normaltekst>
                    </div>

                    <div className="eksport-modal__personvern-info">
                        <Normaltekst className="tekst">
                            Dennne filen inneholder personopplysninger. Vær varsom dersom du laster ned eller distribuerer filen videre. Ved nedlasting er du selv ansvarlig for å overholde personvernreglene.
                        </Normaltekst>
                    </div>

                    <div className="eksport-modal__knapper">
                        <ExcelFile
                            element={<Hovedknapp onClick={() => closeModal()}>Jeg forstår - Last ned filen</Hovedknapp>}
                            filename={
                                'ANSATTFORHOLD_' +
                                props.navnBedrift +
                                '_' +
                                props.orgnrBedrift +
                                '_' +
                                dagensDato.toLocaleDateString()
                            }
                        >
                            <ExcelSheet dataSet={infosideData} name="Info"/>
                            <ExcelSheet dataSet={datasett(aktiveArbeidsforholdDataset)} name="Aktive arbeidsforhold"/>
                            <ExcelSheet dataSet={datasett(avsluttedeArbeidsforholdDataset)} name="Avsluttede arbeidsforhold"/>
                        </ExcelFile>
                        <Flatknapp className="avbryt-knapp" onClick={() => closeModal()}>Avbryt</Flatknapp>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ExcelEksport;

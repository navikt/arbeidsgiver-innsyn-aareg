import React, { FunctionComponent, useState } from 'react';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
// @ts-ignore
import ReactExport from 'react-data-export';
import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';
import { filtrerAktiveOgAvsluttede } from '../sorteringOgFiltreringsFunksjoner';
import varselikon from './varselikon.svg';
import './ExcelEksport.less'

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

type ExcelEksportProps = {
    arbeidsforholdListe: Arbeidsforhold[];
    className: string;
    navnBedrift: string;
    orgnrBedrift: string;
};

const convertToDataset = (arbeidsforhold: Arbeidsforhold[]) => {
    const arbeidsforholdDataset: string[][] = [];

    arbeidsforhold.forEach(a => {
        const detteArbeidsforholdet: Array<string> = [];
        detteArbeidsforholdet.push(a.arbeidstaker.navn);
        detteArbeidsforholdet.push(a.arbeidstaker.offentligIdent);
        detteArbeidsforholdet.push(a.ansattFom);
        detteArbeidsforholdet.push(a.ansattTom ? a.ansattTom : '');
        detteArbeidsforholdet.push(a.yrkesbeskrivelse + ' (yrkeskode: ' + a.yrke + ')');
        detteArbeidsforholdet.push(a.stillingsprosent);
        detteArbeidsforholdet.push(
            a.varsler ? a.varsler[0].varslingskodeForklaring + ' (varselkode: ' + a.varsler[0].varslingskode + ')' : ''
        );
        arbeidsforholdDataset.push(detteArbeidsforholdet);
    });
    return arbeidsforholdDataset;
};

const kolonnerAktive = [
    { title: 'Navn', width: { wch: 25 } },
    { title: 'Fødselsnummer', width: { wch: 14 } },
    { title: 'Startdato', width: { wch: 13 } },
    { title: 'Sluttdato', width: { wch: 13 } },
    { title: 'Yrke', width: { wch: 35 } },
    { title: 'Stilling %', width: { wch: 20 } },
    { title: 'Varsel', width: { wch: 20 } }
];

const kolonnerAvsluttede = [
    { title: 'Navn', width: { wch: 25 } },
    { title: 'Fødselsnummer', width: { wch: 14 } },
    { title: 'Startdato', width: { wch: 13 } },
    { title: 'Sluttdato', width: { wch: 13 } },
    { title: 'Yrke', width: { wch: 35 } },
    { title: 'Stilling %', width: { wch: 20 } },
    { title: 'Varsel', width: { wch: 20 } }
];

const infosideData = [
    {
        columns: [{ title: '', width: { wpx: 500 } }],
        data: [
            [
                {
                    value:
                        'Oversikten viser alle aktive og avsluttede arbeidsforhold rapportert etter 01.01.2015 for valgt underenhet. Hvis det er feil i et arbeidsforhold, skal du som arbeidsgiver endre dette gjennom a-meldingen',
                    style: { font: { sz: '14', bold: true }, alignment: { wrapText: true, vertical: 'top' } }
                }
            ]
        ]
    }
];

const ExcelEksport: FunctionComponent<ExcelEksportProps> = (props: ExcelEksportProps) => {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const dagensDato: Date = new Date();
    const aktiveArbeidsforhold = filtrerAktiveOgAvsluttede(props.arbeidsforholdListe, 'Aktive');
    const aktiveArbeidsforholdDataset = convertToDataset(aktiveArbeidsforhold);
    const avsluttedeArbeidsforhold = filtrerAktiveOgAvsluttede(props.arbeidsforholdListe, 'Avsluttede');
    const avsluttedeArbeidsforholdDataset = convertToDataset(avsluttedeArbeidsforhold);

    const avsluttedeArbeidsforholdMultiDataSet = [
        {
            columns: kolonnerAvsluttede,
            data: avsluttedeArbeidsforholdDataset
        }
    ];
    const aktiveArbeidsforholdMultiDataSet = [
        {
            columns: kolonnerAktive,
            data: aktiveArbeidsforholdDataset
        }
    ];

    return (
        <div className={props.className}>
            <Hovedknapp className="excel-eksport-knapp" onClick={() => openModal()}>Last ned som excelfil</Hovedknapp>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => closeModal()}
                closeButton={true}
                contentLabel="Excel eksport modal"
                className="eksport-modal"
            >
                <div className="eksport-modal__innhold">
                    <Undertittel className="eksport-modal__overskrift">
                        Last ned opplysninger fra Aa-registret
                    </Undertittel>

                    <Normaltekst className="eksport-modal__ingress">
                        Du har nå mulighet å laste ned alle arbeidsforhold i virksomheten i en Excel-fil.
                    </Normaltekst>

                    <div className="eksport-modal__varsel">
                        <img
                            src={varselikon}
                            alt=""
                            className="varselikon"
                        />
                        <Normaltekst className="varseltekst">Personvern - lagre filen sikkert</Normaltekst>
                    </div>

                    <Normaltekst className="eksport-modal__personvern-info">
                        <div className="tekst">
                            Filen inneholder personopplysninger om ansatte i virksomheten. Sørg for at du lagrer filen
                            sikkert og ta forholdsregler når du sender, lager eller laster opp filen en annen plass.
                        </div>
                        <div>
                            Laster du ned filen er virksomheten din selv ansvarlig for å sikre etterlevelse
                            av personvernreglene.
                        </div>
                    </Normaltekst>

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
                            <ExcelSheet dataSet={aktiveArbeidsforholdMultiDataSet} name="Aktive arbeidsforhold"/>
                            <ExcelSheet dataSet={avsluttedeArbeidsforholdMultiDataSet} name="Avsluttede arbeidsforhold"/>
                        </ExcelFile>
                        <Flatknapp className="avbryt-knapp" onClick={() => closeModal()}>Avbryt</Flatknapp>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ExcelEksport;

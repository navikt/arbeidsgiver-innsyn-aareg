import React, { useContext, useState } from 'react';
import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { loggBrukerklikk } from '../../../utils/amplitudefunksjonerForLogging';
import varselikon from './varselikon.svg';
import './ExcelEksport.css';
import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { FiltrerteOgSorterteArbeidsforholdContext } from '../../Context/FiltrerteOgSorterteArbeidsforholdProvider';
import { StatusFilter } from '../sorteringOgFiltreringsFunksjoner';
import { Organisasjon } from '../../Objekter/OrganisasjonFraAltinn';

const cols = [
    { wch: 35 }, // Navn
    { wch: 14 }, // Fødselsnummer
    { wch: 13 }, // Startdato
    { wch: 13 }, // Sluttdato
    { wch: 40 }, // Yrke
    { wch: 10 }, // Stilling %
    { wch: 100 }, // Varsel
];

const xlsFormat = (a: Arbeidsforhold) => ({
    Navn: a.arbeidstaker.navn,
    Fødselsnummer: a.arbeidstaker.offentligIdent,
    Startdato: a.ansattFom,
    Sluttdato: a.ansattTom ?? '',
    Yrke: `${a.yrkesbeskrivelse} (yrkeskode: ${a.yrke})`,
    'Stilling %': a.stillingsprosent,
    Varsel: a.varsler
        ? a.varsler[0].varslingskodeForklaring + ' (varselkode: ' + a.varsler[0].varslingskode + ')'
        : '',
});

const exportToExcel = (org: Organisasjon, grouped: Record<StatusFilter, Arbeidsforhold[]>) => {
    const dagensDato: Date = new Date();
    const infosideData = [
        {
            'Om dokumentet':
                'Oversikten viser alle aktive og avsluttede arbeidsforhold rapportert etter 01.01.2015 for valgt underenhet.',
        },
        {
            'Om dokumentet':
                'Hvis det er feil i et arbeidsforhold, skal du som arbeidsgiver endre dette gjennom a-meldingen',
        },
    ];
    const aktiveArbeidsforholdDataset = grouped.Aktive.map(xlsFormat);
    const avsluttedeArbeidsforholdDataset = grouped.Avsluttede.map(xlsFormat);

    const workbook = XLSX.utils.book_new();

    const infoSheet = XLSX.utils.json_to_sheet(infosideData);
    infoSheet['!cols'] = [{ wch: 80 }];
    infoSheet['!rows'] = [{ hpt: 40 }, { hpt: 40 }, { hpt: 40 }];
    XLSX.utils.book_append_sheet(workbook, infoSheet, 'Info');

    const aktivSheet = XLSX.utils.json_to_sheet(aktiveArbeidsforholdDataset);
    aktivSheet['!cols'] = cols;
    XLSX.utils.book_append_sheet(workbook, aktivSheet, 'Aktive arbeidsforhold');

    const avsluttedeSheet = XLSX.utils.json_to_sheet(avsluttedeArbeidsforholdDataset);
    avsluttedeSheet['!cols'] = cols;
    XLSX.utils.book_append_sheet(workbook, avsluttedeSheet, 'Avsluttede arbeidsforhold');

    saveAs(
        new Blob(
            [
                XLSX.write(workbook, {
                    bookType: 'xlsx',
                    type: 'array',
                }),
            ],
            {
                type: 'application/octet-stream',
            }
        ),
        `ANSATTFORHOLD_${org.Name}_${org.OrganizationNumber}_${dagensDato.toLocaleDateString()}.xlsx`
    );
};

const ExcelEksport = () => {
    const { grouped, aareg } = useContext(FiltrerteOgSorterteArbeidsforholdContext);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const arbeidsforholdFor = aareg?.arbeidsforholdFor ?? null;

    return arbeidsforholdFor === null ? null : (
        <div className="excel-export">
            <Button
                variant="primary"
                aria-label={'Last ned arbeidsforhold som excelfil'}
                className="excel-eksport-knapp"
                onClick={() => {
                    loggBrukerklikk('Last ned arbeidsforhold som excelfil');
                    setModalIsOpen(true);
                }}
            >
                Last ned som excelfil
            </Button>
            <Modal
                open={modalIsOpen}
                header={{
                    heading: 'Last ned arbeidsforhold fra Aa-registret',
                }}
                onClose={() => setModalIsOpen(false)}
                className="eksport-modal"
            >
                <Modal.Body>
                    <div className="eksport-modal__innhold">
                        <div className="eksport-modal__varsel">
                            <img src={varselikon} alt="" className="varselikon" />
                            <BodyShort className="varseltekst">Personvern</BodyShort>
                        </div>

                        <div className="eksport-modal__personvern-info">
                            <BodyShort className="tekst">
                                Denne filen inneholder personopplysninger. Vær varsom dersom du
                                laster ned eller distribuerer filen videre. Ved nedlasting er du
                                selv ansvarlig for å overholde personvernreglene.
                            </BodyShort>
                        </div>

                        <div className="eksport-modal__knapper">
                            <Button
                                variant="primary"
                                onClick={() => {
                                    loggBrukerklikk('Jeg forstår - Last ned filen');
                                    exportToExcel(arbeidsforholdFor, grouped);
                                    setModalIsOpen(false);
                                }}
                            >
                                Jeg forstår - Last ned filen
                            </Button>
                            <Button
                                variant="tertiary"
                                className="avbryt-knapp"
                                onClick={() => setModalIsOpen(false)}
                            >
                                Avbryt
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ExcelEksport;

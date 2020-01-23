import React, { FunctionComponent } from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';
// @ts-ignore
import ReactExport from 'react-data-export';
import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';
import { filtrerAktiveOgAvsluttede } from '../sorteringOgFiltreringsFunksjoner';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

type ExcelEksportProps = {
    arbeidsforholdListe: Arbeidsforhold[];
    className?: string;
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
        detteArbeidsforholdet.push(a.ansattTom? a.ansattTom : "");
        detteArbeidsforholdet.push(a.yrke);
        detteArbeidsforholdet.push(a.stillingsprosent);
        detteArbeidsforholdet.push(a.varslingskode? a.varslingskodeForklaring + "(varselkode: " + a.varslingskode+")" : "");
        arbeidsforholdDataset.push(detteArbeidsforholdet);
    });
    return arbeidsforholdDataset;
};

const kolonnerAktive = [
    { title: 'Navn', width: { wch: 25 } },
    { title: 'Fødselsnummer', width: { wch: 14 } },
    { title: 'Startdato', width: { wch: 13 } },
    { title: 'Sluttdato', width: { wch: 13 } },
    { title: 'Yrke', width: { wch: 20 } },
    { title: 'Stilling %', width: { wch: 20 } },
    { title: 'Varsel', width: { wch: 13 } },
];
const kolonnerAvsluttede = [
    { title: 'Navn', width: { wch: 25 } },
    { title: 'Fødselsnummer', width: { wch: 14 } },
    { title: 'Startdato', width: { wch: 13 } },
    { title: 'Sluttdato', width: { wch: 13 } },
    { title: 'Yrke', width: { wch: 20 } },
    { title: 'Stilling %', width: { wch: 20 } },
    { title: 'Varsel', width: { wch: 13 } },

];
const infosideData = [
    {
        columns: [
            { title: '', width: { wpx: 500 } }
        ],
        data: [
            [
                {value: "Oversikten viser alle aktive og avsluttede arbeidsforhold rapportert etter 01.01.2015 for valgt underenhet. Hvis det er feil i et arbeidsforhold, skal du som arbeidsgiver endre dette gjennom a-meldingen", style: {font: {sz: "14", bold: true}, alignment:{wrapText:true,vertical:"top"}}},

            ]
        ]
    }
];

const ExcelEksport: FunctionComponent<ExcelEksportProps> = (props: ExcelEksportProps) => {
    const dagensDato: Date = new Date();
    const aktiveArbeidsforhold = filtrerAktiveOgAvsluttede(props.arbeidsforholdListe, true);
    const aktiveArbeidsforholdDataset = convertToDataset(aktiveArbeidsforhold);
    const avsluttedeArbeidsforhold = filtrerAktiveOgAvsluttede(props.arbeidsforholdListe, false);
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
            <ExcelFile
                element={<Hovedknapp>Last Ned</Hovedknapp>}
                filename={
                    'ANSATTFORHOLD_' +
                    props.navnBedrift +
                    '_' +
                    props.orgnrBedrift +
                    '_' +
                    dagensDato.toLocaleDateString()
                }
            >
                <ExcelSheet dataSet={infosideData} name="Info" />
                <ExcelSheet dataSet={aktiveArbeidsforholdMultiDataSet} name="Aktive arbeidsforhold" />
                <ExcelSheet dataSet={avsluttedeArbeidsforholdMultiDataSet} name="Avsluttede arbeidsforhold" />
            </ExcelFile>
        </div>
    );
};

export default ExcelEksport;
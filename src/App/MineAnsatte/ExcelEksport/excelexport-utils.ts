import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';

export const convertToDataset = (arbeidsforhold: Arbeidsforhold[]) => {
    const arbeidsforholdDataset: string[][] = [];

    arbeidsforhold.forEach((a) => {
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

export const kolonner = [
    { title: 'Navn', width: { wch: 25 } },
    { title: 'Fødselsnummer', width: { wch: 14 } },
    { title: 'Startdato', width: { wch: 13 } },
    { title: 'Sluttdato', width: { wch: 13 } },
    { title: 'Yrke', width: { wch: 35 } },
    { title: 'Stilling %', width: { wch: 20 } },
    { title: 'Varsel', width: { wch: 20 } },
];

export const datasett = (arbeidsforholdDataset: string[][]) => [
    {
        columns: kolonner,
        data: arbeidsforholdDataset,
    },
];

export const infosideData = [
    {
        columns: [{ title: '', width: { wpx: 500 } }],
        data: [
            [
                {
                    value:
                        'Oversikten viser alle aktive og avsluttede arbeidsforhold rapportert etter 01.01.2015 for valgt underenhet. Hvis det er feil i et arbeidsforhold, skal du som arbeidsgiver endre dette gjennom a-meldingen',
                    style: { font: { sz: '14', bold: true }, alignment: { wrapText: true, vertical: 'top' } },
                },
            ],
        ],
    },
];

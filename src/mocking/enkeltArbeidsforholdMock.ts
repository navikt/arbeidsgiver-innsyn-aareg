import fetchMock from 'fetch-mock';
const delay = new Promise(res => setTimeout(res, 500));

fetchMock
    .get(
        'begin:https://arbeidsforhold.dev.nav.no/arbeidsforhold/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver',
        delay.then(() => {
            return enkelArbeidsforholdRespons;
        })
    )
    .spy();

const enkelArbeidsforholdRespons = {
    navArbeidsforholdId: 47720602,
    eksternArbeidsforholdId: '1',
    type: 'Ordinært arbeidsforhold',
    sistBekreftet: '2019-12-06T10:46:25',
    arbeidsgiver: { orgnr: '910825518', fnr: null, type: 'Organisasjon', orgnavn: 'MAURA OG KOLBU REGNSKAP' },
    opplysningspliktigarbeidsgiver: {
        orgnr: '810825472',
        fnr: null,
        type: 'Organisasjon',
        orgnavn: 'MALMEFJORDEN OG RIDABU REGNSKAP'
    },
    ansettelsesperiode: { periode: { periodeFra: '2017-12-01', periodeTil: null }, varslingskode: null, sluttaarsak: "Arbeidstaker har sagt opp selv"},
    utenlandsopphold:[{periode:{periodeFra:'2020-03-01',periodeTil:'2020-03-29'},
        rapporteringsperiode:'2020-01',land:'TYSKLAND'}],
    permisjonPermittering: [{periode:{periodeFra:'2020-02-01',periodeTil:'2020-02-29'},type:'Permisjon',prosent:'100 %'}],
    arbeidsavtaler: [],
    antallTimerForTimelonnet: [{antallTimer:'20.0',periode:{periodeFra:'2020-01-06',periodeTil:'2020-01-12'},rapporteringsperiode:'2020-01'},{antallTimer:'37.5',periode:{periodeFra:'2020-01-13',periodeTil:'2020-01-19'},rapporteringsperiode:'2020-01'},{antallTimer:'45.0',periode:{periodeFra:'2020-01-20',periodeTil:'2020-01-26'},rapporteringsperiode:'2020-01'},{antallTimer:'25.0',periode:{periodeFra:'2020-01-27',periodeTil:'2020-01-30'},rapporteringsperiode:'2020-01'}],
    antallTimerPrUke: 37.5,
    arbeidstidsordning: 'Ikke skift',
    sisteStillingsendring: '2020-06-01',
    sisteLoennsendring: null,
    stillingsprosent: 80.0,
    yrke: 'SYKEPLEIER (Yrkeskode: 3231109)',
    fartsomraade: null,
    skipsregister: null,
    ansettelsesform: "fast",
    skipstype: null
};

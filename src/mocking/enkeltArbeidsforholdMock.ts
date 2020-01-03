import fetchMock from 'fetch-mock';
const delay = new Promise(res => setTimeout(res, 500));

fetchMock
    .get(
        'begin:https://arbeidsgiver-q.nav.no/bedriftsoversikt-og-ansatte/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver',
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
    ansettelsesperiode: { periode: { periodeFra: '2017-12-01', periodeTil: null }, varslingskode: null },
    utenlandsopphold: [],
    permisjonPermittering: [],
    arbeidsavtaler: [],
    antallTimerForTimelonnet: [],
    antallTimerPrUke: 37.5,
    arbeidstidsordning: 'Ikke skift',
    sisteStillingsendring: null,
    sisteLoennsendring: null,
    stillingsprosent: 100.0,
    yrke: 'SYKEPLEIER (Yrkeskode: 3231109)',
    fartsomraade: null,
    skipsregister: null,
    skipstype: null
};

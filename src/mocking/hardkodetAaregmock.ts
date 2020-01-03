import fetchMock from 'fetch-mock';
const delay = new Promise(res => setTimeout(res, 500));

fetchMock
    .get(
        'bedriftsoversikt-og-ansatte/api/arbeidsforhold',
        delay.then(() => {
            return OrganisasjonerResponse;
        })
    )
    .spy();
const OrganisasjonerResponse = {
    aktorIDtilArbeidstaker: '1071346840074',
    antall: '5',
    arbeidsforholdoversikter: [
        {
            ansattFom: '2017-12-01',
            ansattTom: null,
            arbeidsgiver: { type: 'Organisasjon' },
            arbeidstaker: {
                navn: 'GUL SEKK',
                type: 'Person',
                aktoerId: '1071346840074',
                offentligIdent: '27127424204'
            },
            innrapportertEtterAOrdningen: 'true',
            navArbeidsforholdId: '47720602',
            opplysningspliktig: { type: 'Organisasjon' },
            permisjonPermitteringsprosent: null,
            sistBekreftet: '2019-12-06T10:46:25',
            stillingsprosent: '100.0',
            type: 'ordinaertArbeidsforhold',
            varslingskode: null,
            yrke: '3231109'
        },
        {
            ansattFom: '2017-12-01',
            ansattTom: null,
            arbeidsgiver: { type: 'Organisasjon' },
            arbeidstaker: {
                navn: 'GUL KAKE',
                type: 'Person',
                aktoerId: '1171206315983',
                offentligIdent: '09067525067'
            },
            innrapportertEtterAOrdningen: 'true',
            navArbeidsforholdId: '47720501',
            opplysningspliktig: { type: 'Organisasjon' },
            permisjonPermitteringsprosent: null,
            sistBekreftet: '2019-12-06T10:46:32',
            stillingsprosent: '100.0',
            type: 'ordinaertArbeidsforhold',
            varslingskode: null,
            yrke: '3231109'
        },
        {
            ansattFom: '2017-12-01',
            ansattTom: null,
            arbeidsgiver: { type: 'Organisasjon' },
            arbeidstaker: {
                navn: 'FORFJAMSET VEPS',
                type: 'Person',
                aktoerId: '1231810853405',
                offentligIdent: '09077729434'
            },
            innrapportertEtterAOrdningen: 'true',
            navArbeidsforholdId: '47720603',
            opplysningspliktig: { type: 'Organisasjon' },
            permisjonPermitteringsprosent: null,
            sistBekreftet: '2019-12-06T10:46:50',
            stillingsprosent: '100.0',
            type: 'ordinaertArbeidsforhold',
            varslingskode: null,
            yrke: '3231109'
        },
        {
            ansattFom: '2017-12-01',
            ansattTom: null,
            arbeidsgiver: { type: 'Organisasjon' },
            arbeidstaker: {
                navn: 'LEALAUS VEPS',
                type: 'Person',
                aktoerId: '1304655821090',
                offentligIdent: '14016027252'
            },
            innrapportertEtterAOrdningen: 'true',
            navArbeidsforholdId: '47720502',
            opplysningspliktig: { type: 'Organisasjon' },
            permisjonPermitteringsprosent: null,
            sistBekreftet: '2019-12-06T10:46:40',
            stillingsprosent: '100.0',
            type: 'ordinaertArbeidsforhold',
            varslingskode: null,
            yrke: '3231109'
        },
        {
            ansattFom: '2015-12-03',
            ansattTom: null,
            arbeidsgiver: { type: 'Organisasjon' },
            arbeidstaker: {
                navn: 'Kunne ikke hente navn',
                type: 'Person',
                aktoerId: '1442495989754',
                offentligIdent: '01088723275'
            },
            innrapportertEtterAOrdningen: 'true',
            navArbeidsforholdId: '47720600',
            opplysningspliktig: { type: 'Organisasjon' },
            permisjonPermitteringsprosent: null,
            sistBekreftet: '2019-12-03T10:57:36',
            stillingsprosent: '100.0',
            type: 'ordinaertArbeidsforhold',
            varslingskode: null,
            yrke: '3431129'
        }
    ],
    startrad: '0',
    totalAntall: '5'
};

import fetchMock from 'fetch-mock';
const delay = new Promise(res => setTimeout(res, 10000));

fetchMock
    .get(
        'arbeidsforhold/api/arbeidsforhold',
        delay.then(() => {
            return OrganisasjonerResponse;
        })
    )
    .spy();
const OrganisasjonerResponse = {
    antall: '13',
    arbeidsforholdoversikter: [
        {
            ansattFom: '2000-01-22',
            ansattTom: null,
            arbeidsgiver: {
                type: 'Organisasjon'
            },
            arbeidstaker: {
                navn: 'OLA NORDMANN',
                type: 'Person',
                aktoerId: '1157442896316',
                offentligIdent: '08078523168'
            },
            innrapportertEtterAOrdningen: 'true',
            navArbeidsforholdId: '49119204',
            opplysningspliktig: {
                type: 'Organisasjon'
            },
            permisjonPermitteringsprosent: null,
            sistBekreftet: '2020-01-22T10:22:36',
            stillingsprosent: '100',
            type: 'ordinaertArbeidsforhold',
            varsler: null,
            yrke: '0017041',
            yrkesbeskrivelse: 'DISPONENT'
        },
        {
            ansattFom: '2016-01-01',
            ansattTom: '2016-01-01',
            arbeidsgiver: {
                type: 'Organisasjon'
            },
            arbeidstaker: {
                navn: 'GRO BRUNDTLAND',
                type: 'Person',
                aktoerId: '1157483674881',
                offentligIdent: '22107627085'
            },
            innrapportertEtterAOrdningen: 'true',
            navArbeidsforholdId: '49119201',
            opplysningspliktig: {
                type: 'Organisasjon'
            },
            permisjonPermitteringsprosent: null,
            sistBekreftet: '2020-01-22T10:28:04',
            stillingsprosent: '0',
            type: 'ordinaertArbeidsforhold',
            varsler: null,
            yrke: '0017041',
            yrkesbeskrivelse: 'DISPONENT'
        },
        {
            ansattFom: '2017-01-01',
            ansattTom: '2019-08-09',
            arbeidsgiver: {
                type: 'Organisasjon'
            },
            arbeidstaker: {
                navn: 'JENS JENSEN',
                type: 'Person',
                aktoerId: '1456663112394',
                offentligIdent: '31087426516'
            },
            innrapportertEtterAOrdningen: 'true',
            navArbeidsforholdId: '49119103',
            opplysningspliktig: {
                type: 'Organisasjon'
            },
            permisjonPermitteringsprosent: null,
            sistBekreftet: '2020-01-22T10:15:58',
            stillingsprosent: '100',
            type: 'ordinaertArbeidsforhold',
            varsler: [
                {
                    varslingskodeForklaring: 'Maskinell sluttdato: Konkurs',
                    entitet: 'ANSETTELSESPERIODE',
                    varslingskode: 'ERKONK'
                },
                {
                    varslingskodeForklaring: 'Maskinell sluttdato: Opphørt i Enhetsregisteret',
                    entitet: 'PERMITTERINGSPERIODE',
                    varslingskode: 'EROPPH'
                }
            ],
            yrke: '5149124',
            yrkesbeskrivelse: 'MYSTERY SHOPPER'
        },
        {
            ansattFom: '2016-01-01',
            ansattTom: '2016-01-01',
            arbeidsgiver: {
                type: 'Organisasjon'
            },
            arbeidstaker: {
                navn: 'KARI FOLKELIG',
                type: 'Person',
                aktoerId: '1493857494038',
                offentligIdent: '09118524109'
            },
            innrapportertEtterAOrdningen: 'true',
            navArbeidsforholdId: '49119102',
            opplysningspliktig: {
                type: 'Organisasjon'
            },
            permisjonPermitteringsprosent: null,
            sistBekreftet: '2020-01-22T10:28:50',
            stillingsprosent: '0',
            type: 'ordinaertArbeidsforhold',
            varsler: null,
            yrke: '0017041',
            yrkesbeskrivelse: 'DISPONENT'
        },
        {
            ansattFom: '2017-01-01',
            ansattTom: '2017-01-01',
            arbeidsgiver: {
                type: 'Organisasjon'
            },
            arbeidstaker: {
                navn: 'HERMANN OLSEN',
                type: 'Person',
                aktoerId: '1510920886509',
                offentligIdent: '31087923897'
            },
            innrapportertEtterAOrdningen: 'true',
            navArbeidsforholdId: '49119202',
            opplysningspliktig: {
                type: 'Organisasjon'
            },
            permisjonPermitteringsprosent: null,
            sistBekreftet: '2020-01-22T10:30:14',
            stillingsprosent: '0',
            type: 'ordinaertArbeidsforhold',
            varsler: null,
            yrke: '5149124',
            yrkesbeskrivelse: 'MYSTERY SHOPPER'
        },
        {
            ansattFom: '1999-06-07',
            ansattTom: '2019-12-30',
            arbeidsgiver: {
                type: 'Organisasjon'
            },
            arbeidstaker: {
                navn: 'OLE JØRGEN HAMMERSBORG HAMMER',
                type: 'Person',
                aktoerId: '1560993039264',
                offentligIdent: '19028023262'
            },
            innrapportertEtterAOrdningen: 'true',
            navArbeidsforholdId: '49119200',
            opplysningspliktig: {
                type: 'Organisasjon'
            },
            permisjonPermitteringsprosent: null,
            sistBekreftet: '2020-01-22T10:03:45',
            stillingsprosent: '100',
            type: 'ordinaertArbeidsforhold',
            varsler: [
                {
                    varslingskodeForklaring: 'Maskinell sluttdato: Ikke bekreftet',
                    entitet: 'ANSETTELSESPERIODE',
                    varslingskode: 'IBARBG'
                }
            ],
            yrke: '4223102',
            yrkesbeskrivelse: 'DROSJESENTRALVAKTSJEF'
        },
        {
            ansattFom: '2017-01-01',
            ansattTom: null,
            arbeidsgiver: {
                type: 'Organisasjon'
            },
            arbeidstaker: {
                navn: 'Ola Normann',
                type: 'Person',
                aktoerId: '1576716475876',
                offentligIdent: '04118124745'
            },
            innrapportertEtterAOrdningen: 'true',
            navArbeidsforholdId: '49119101',
            opplysningspliktig: {
                type: 'Organisasjon'
            },
            permisjonPermitteringsprosent: null,
            sistBekreftet: '2020-01-22T10:09:19',
            stillingsprosent: '100',
            type: 'ordinaertArbeidsforhold',
            varsler: null,
            yrke: '0030220',
            yrkesbeskrivelse: '1. STYRMANN'
        },
        {
            ansattFom: '2018-01-01',
            ansattTom: '2018-01-01',
            arbeidsgiver: {
                type: 'Organisasjon'
            },
            arbeidstaker: {
                navn: 'PER JØRGENSEN HARLEM',
                type: 'Person',
                aktoerId: '1810524547525',
                offentligIdent: '26107924360'
            },
            innrapportertEtterAOrdningen: 'true',
            navArbeidsforholdId: '49119106',
            opplysningspliktig: {
                type: 'Organisasjon'
            },
            permisjonPermitteringsprosent: null,
            sistBekreftet: '2020-01-22T10:32:51',
            stillingsprosent: '0',
            type: 'ordinaertArbeidsforhold',
            varsler: null,
            yrke: '3310101',
            yrkesbeskrivelse: 'ALLMENNLÆRER'
        },
        {
            ansattFom: '2000-01-22',
            ansattTom: null,
            arbeidsgiver: {
                type: 'Organisasjon'
            },
            arbeidstaker: {
                navn: 'TOVE ANNIKEN ANDERSEN',
                type: 'Person',
                aktoerId: '1848399481177',
                offentligIdent: '15016629127'
            },
            innrapportertEtterAOrdningen: 'true',
            navArbeidsforholdId: '49119107',
            opplysningspliktig: {
                type: 'Organisasjon'
            },
            permisjonPermitteringsprosent: null,
            sistBekreftet: '2020-01-22T10:20:55',
            stillingsprosent: '80',
            type: 'ordinaertArbeidsforhold',
            varsler: null,
            yrke: '7435101',
            yrkesbeskrivelse: 'PARYKKMAKER'
        },
        {
            ansattFom: '2000-01-22',
            ansattTom: '2000-01-22',
            arbeidsgiver: {
                type: 'Organisasjon'
            },
            arbeidstaker: {
                navn: 'Ola Normann',
                type: 'Person',
                aktoerId: '1858200169716',
                offentligIdent: '24066125889'
            },
            innrapportertEtterAOrdningen: 'true',
            navArbeidsforholdId: '49119105',
            opplysningspliktig: {
                type: 'Organisasjon'
            },
            permisjonPermitteringsprosent: null,
            sistBekreftet: '2020-01-22T10:31:07',
            stillingsprosent: '0',
            type: 'ordinaertArbeidsforhold',
            varsler: null,
            yrke: '3119140',
            yrkesbeskrivelse: 'SENIOR KONTROLLINGENIØR (ØVRIG TEKNISK VIRKSOMHET)'
        },
        {
            ansattFom: '2000-01-22',
            ansattTom: null,
            arbeidsgiver: {
                type: 'Organisasjon'
            },
            arbeidstaker: {
                navn: 'HELGA RADMILLA GUNDERSTAD',
                type: 'Person',
                aktoerId: '1913689789684',
                offentligIdent: '27106124243'
            },
            innrapportertEtterAOrdningen: 'true',
            navArbeidsforholdId: '49119108',
            opplysningspliktig: {
                type: 'Organisasjon'
            },
            permisjonPermitteringsprosent: null,
            sistBekreftet: '2020-01-22T10:33:34',
            stillingsprosent: '50',
            type: 'ordinaertArbeidsforhold',
            varsler: null,
            yrke: '6129109',
            yrkesbeskrivelse: 'KENNELASSISTENT'
        },
        {
            ansattFom: '2018-12-01',
            ansattTom: '2018-12-01',
            arbeidsgiver: {
                type: 'Organisasjon'
            },
            arbeidstaker: {
                navn: 'FRANK BORGEN JANSSON',
                type: 'Person',
                aktoerId: '1915849924050',
                offentligIdent: '21066027276'
            },
            innrapportertEtterAOrdningen: 'true',
            navArbeidsforholdId: '49119203',
            opplysningspliktig: {
                type: 'Organisasjon'
            },
            permisjonPermitteringsprosent: null,
            sistBekreftet: '2020-01-22T10:25:12',
            stillingsprosent: '0',
            type: 'ordinaertArbeidsforhold',
            varsler: null,
            yrke: '3310101',
            yrkesbeskrivelse: 'ALLMENNLÆRER'
        },
        {
            ansattFom: '2017-01-01',
            ansattTom: '2017-01-01',
            arbeidsgiver: {
                type: 'Organisasjon'
            },
            arbeidstaker: {
                navn: 'Ola Normann',
                type: 'Person',
                aktoerId: '1950228802162',
                offentligIdent: '27108525229'
            },
            innrapportertEtterAOrdningen: 'true',
            navArbeidsforholdId: '49119104',
            opplysningspliktig: {
                type: 'Organisasjon'
            },
            permisjonPermitteringsprosent: null,
            sistBekreftet: '2020-01-22T10:31:56',
            stillingsprosent: '0',
            type: 'ordinaertArbeidsforhold',
            varsler: null,
            yrke: '5149124',
            yrkesbeskrivelse: 'MYSTERY SHOPPER'
        }
    ],
    startrad: '0',
    totalAntall: '13'
};

import { http, HttpResponse } from 'msw';
import { delay, randomInt } from './utils';

export const arbeidsforholdHandlers = [
    http.get(
        '/arbeidsforhold/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver/:id',
        async () => {
            await delay(500);
            return HttpResponse.json({
                navArbeidsforholdId: 47720602,
                eksternArbeidsforholdId: '1',
                type: 'Ordinært arbeidsforhold',
                sistBekreftet: '2019-12-06T10:46:25',
                arbeidsgiver: {
                    orgnr: '910825518',
                    fnr: null,
                    type: 'Organisasjon',
                    orgnavn: 'MAURA OG KOLBU REGNSKAP',
                },
                opplysningspliktigarbeidsgiver: {
                    orgnr: '810825472',
                    fnr: null,
                    type: 'Organisasjon',
                    orgnavn: 'MALMEFJORDEN OG RIDABU REGNSKAP',
                },
                ansettelsesperiode: {
                    periode: { periodeFra: '2017-12-01', periodeTil: null },
                    varslingskode: null,
                    sluttaarsak: 'Arbeidstaker har sagt opp selv',
                },
                utenlandsopphold: [
                    {
                        periode: { periodeFra: '2020-03-01', periodeTil: '2020-03-29' },
                        rapporteringsperiode: '2020-01',
                        land: 'TYSKLAND',
                    },
                ],
                permisjonPermittering: [
                    {
                        periode: { periodeFra: '2020-02-01', periodeTil: '2020-02-29' },
                        type: 'Permisjon',
                        prosent: '100 %',
                    },
                ],
                arbeidsavtaler: [],
                antallTimerForTimelonnet: [
                    {
                        antallTimer: '20.0',
                        periode: { periodeFra: '2020-01-06', periodeTil: '2020-01-12' },
                        rapporteringsperiode: '2020-01',
                    },
                    {
                        antallTimer: '37.5',
                        periode: { periodeFra: '2020-01-13', periodeTil: '2020-01-19' },
                        rapporteringsperiode: '2020-01',
                    },
                    {
                        antallTimer: '45.0',
                        periode: { periodeFra: '2020-01-20', periodeTil: '2020-01-26' },
                        rapporteringsperiode: '2020-01',
                    },
                    {
                        antallTimer: '25.0',
                        periode: { periodeFra: '2020-01-27', periodeTil: '2020-01-30' },
                        rapporteringsperiode: '2020-01',
                    },
                ],
                antallTimerPrUke: 37.5,
                arbeidstidsordning: 'Ikke skift',
                sisteStillingsendring: '2020-06-01',
                sisteLoennsendring: null,
                stillingsprosent: 80.0,
                yrke: 'SYKEPLEIER (Yrkeskode: 3231109)',
                fartsomraade: null,
                skipsregister: null,
                ansettelsesform: 'fast',
                skipstype: null,
            });
        }
    ),
    http.get(
        '/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/antall-arbeidsforhold',
        async ({ request }) => {
            await delay(1000);
            const antall = Number.parseInt(request.headers.get('orgnr') ?? '100') % 1000;
            const missing = randomInt(10) === 0;
            return HttpResponse.json({
                first: '910825518',
                second: missing ? -1 : antall,
            });
        }
    ),
];

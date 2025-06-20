import { delay, http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { fakeName, fnr } from './helpers';
import { Arbeidsforhold } from '../App/Objekter/ArbeidsForhold';

const yrker = [
    'aa dette er et langt yrkesnavn',
    'Systemutvikler',
    'Interasksjonsdesigner',
    'Sjåfør',
    'Togfører',
    'Billettkontrollør',
    'Kokk',
    'Tannlege',
    'Kirurg',
    'Psykolog',
    'Psykiater',
    'Redaktør',
    'Journalist',
    'Skribent',
    'Forfatter',
    'Ekspeditør',
    'Personalansvarlig',
    'Daglig leder',
    'Servitør',
    'Pianist',
    'Lektor',
    'Gymlærer',
    'Konsulent',
    'Produkteier',
    'Generalsekretær',
    'Arkitekt',
    'Slangetemmer',
    'Performer',
];

const varlingskoder = [
    'ERKONK',
    'EROPPH',
    'ERVIRK',
    'IBARBG',
    'IBKAOR',
    'AFIDHI',
    'IBPPAG',
    'NAVEND',
    'PPIDHI',
] as const;
export type VarslingKode = (typeof varlingskoder)[number];
const prosent = ['10', '20', '30', '80', '100'];

const tomtArbeidsForhold = {
    ansattFom: '',
    ansattTom: '',
    arbeidsgiver: {
        type: '',
    },
    arbeidstaker: {
        type: '',
        aktoerId: '',
        offentligIdent: '',
        navn: '',
    },
    innrapportertEtterAOrdningen: '',
    navArbeidsforholdId: '',
    opplysningspliktig: {
        type: '',
    },
    permisjonPermitteringsprosent: '100',
    sistBekreftet: '',
    stillingsprosent: '100',
    type: '',
    varsler: undefined,
    yrke: '',
    yrkesbeskrivelse: '',
};

const randomProsent = () => faker.helpers.arrayElement(prosent);

const tilfeldigDatoITidsintervall = (startdato: Date, sluttdato: Date) =>
    new Date(startdato.getTime() + Math.random() * (sluttdato.getTime() - startdato.getTime()));

const formaterDato = (dato: Date) => {
    const måned = dato.getMonth() + 1;
    const månedSomString = måned < 10 ? '0' + måned.toString() : måned.toString();
    const dag = dato.getDate();
    const dagSomString = dag < 10 ? '0' + dag.toString() : dag.toString();
    return dato.getFullYear() + '-' + månedSomString + '-' + dagSomString;
};

const randomYrke = () => faker.helpers.arrayElement(yrker).toUpperCase();

const varselkodeBeskrivelser: Record<VarslingKode, string> = {
    ERKONK: 'Kontroller sluttdatoen. NAV har satt samme sluttdato som konkursåpningsdato i Konkursregisteret.',
    EROPPH: 'Kontroller sluttdatoen. NAV har satt samme sluttdato som datoen foretaket opphørte i Enhetsregisteret.',
    ERVIRK: 'Kontroller sluttdatoen.  NAV har satt samme sluttdato som datoen da foretaket ble overdratt til en annen juridisk enhet i Enhetsregisteret.',
    IBARBG: 'Kontroller sluttdatoen. Du har ikke bekreftet arbeidsforholdet. NAV har satt sluttdato til siste dato i den kalendermåneden du sist bekreftet arbeidsforholdet.',
    IBKAOR: 'Maskinell sluttdato: Ikke bekreftet i a-ordningen',
    IBPPAG: 'Kontroller sluttdatoen. Du har ikke bekreftet permisjon/permitteringen. NAV har satt sluttdato til siste dato i den kalendermåneden du sist bekreftet opplysningen.',
    AFIDHI: 'NAV har slått sammen dette arbeidsforholdet med et annet da opplysningene er så like at vi tolker det som ett og samme arbeidsforhold. Hvis du tror det er feil, sjekk at du ikke savner et tidligere arbeidsforhold',
    NAVEND: 'NAV har opprettet eller endret arbeidsforholdet',
    PPIDHI: 'NAV har slått sammen denne permitteringen/permisjonen med en annen da opplysningene er så like at vi tolker det som en og samme. Hvis du tror det er feil, sjekk at du ikke savner en permittering eller permisjon på dette arbeidsforholdet.',
};

const randomVarsel = () => {
    const varslingskode = faker.helpers.arrayElement(varlingskoder);
    return {
        entitet: 'ANSETTELSESPERIODE',
        varslingskode: varslingskode,
        varslingskodeForklaring: varselkodeBeskrivelser[varslingskode],
    };
};
const setVarslingskode = () => {
    const skalHaVarslingskode = Math.random() >= 0.8;
    if (skalHaVarslingskode) {
        const varselArray = [];
        varselArray.push(randomVarsel());
        if (Math.random() >= 0.5) {
            varselArray.push(randomVarsel());
        }
        return varselArray;
    }
    return undefined;
};

const lagAnsattForhold = () => {
    const arbeidsforholdStarttidspunkt = tilfeldigDatoITidsintervall(
        new Date(2015, 1, 1),
        new Date()
    );
    const arbeidsforholdSluttidspunkt = tilfeldigDatoITidsintervall(
        arbeidsforholdStarttidspunkt,
        new Date(2022, 1, 1)
    );
    return {
        ...tomtArbeidsForhold,
        ansattFom: formaterDato(arbeidsforholdStarttidspunkt),
        ansattTom: formaterDato(arbeidsforholdSluttidspunkt),
        yrke: faker.string.numeric(5),
        yrkesbeskrivelse: randomYrke(),
        varsler: setVarslingskode(),
        permisjonPermitteringsprosent: randomProsent(),
        stillingsprosent: randomProsent(),
        arbeidstaker: {
            ...tomtArbeidsForhold.arbeidstaker,
            offentligIdent: fnr(),
            navn: fakeName(),
        },
    };
};

const lagAvluttetAnsattForhold = () => {
    const arbeidsforholdStarttidspunkt = tilfeldigDatoITidsintervall(
        new Date(2015, 1, 1),
        new Date()
    );
    const arbeidsforholdSluttidspunkt = tilfeldigDatoITidsintervall(
        arbeidsforholdStarttidspunkt,
        new Date()
    );
    return {
        ...tomtArbeidsForhold,
        ansattFom: formaterDato(arbeidsforholdStarttidspunkt),
        ansattTom: formaterDato(arbeidsforholdSluttidspunkt),
        yrkesbeskrivelse: randomYrke(),
        varsler: setVarslingskode(),
        permisjonPermitteringsprosent: randomProsent(),
        stillingsprosent: randomProsent(),
        arbeidstaker: {
            ...tomtArbeidsForhold.arbeidstaker,
            offentligIdent: fnr(),
            navn: fakeName(),
        },
    };
};

const genererMockingAvArbeidsForhold = (
    antall: number,
    kunAvsluttede: boolean
): Arbeidsforhold[] => {
    const listeMedArbeidsForhold: Arbeidsforhold[] = [];

    for (let i = 0; i < antall; i++) {
        const lagAnsattFunksjon = kunAvsluttede ? lagAvluttetAnsattForhold() : lagAnsattForhold();
        listeMedArbeidsForhold.push(lagAnsattFunksjon);
    }

    return listeMedArbeidsForhold.map((forhold) => {
        return {
            ...forhold,
            navArbeidsforholdId: listeMedArbeidsForhold.indexOf(forhold).toString(),
        };
    });
};

export const aaregHandlers = [
    http.get(
        '/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/arbeidsforhold',
        async ({ request }) => {
            await delay(500);
            return HttpResponse.json({
                antall: '',
                startrad: '',
                totalAntall: '',
                arbeidsforholdoversikter: genererMockingAvArbeidsForhold(
                    Number.parseInt(request.headers.get('orgnr') ?? '100') % 1000,
                    false
                ),
            });
        }
    ),
    http.get(
        '/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/tidligere-arbeidsforhold',
        async ({ request }) => {
            await delay(1000);
            return HttpResponse.json({
                antall: '',
                startrad: '',
                totalAntall: '',
                arbeidsforholdoversikter: genererMockingAvArbeidsForhold(104, false),
            });
        }
    ),
    http.get(
        '/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/tidligere-virksomheter',
        async ({ request }) => {
            await delay(1000);

            return HttpResponse.json([
                {
                    name: 'HASLUM OG HOLTE REGNSKAP',
                    type: 'BEDR',
                    parentOrganizationNumber: '810825472',
                    organizationNumber: '954168395',
                    organizationForm: 'AS',
                    status: 'Active',
                },
                {
                    name: 'HASLUM OG HAUGNES REGNSKAP',
                    type: 'BEDR',
                    parentOrganizationNumber: '810825472',
                    organizationNumber: '954168399',
                    organizationForm: 'AS',
                    status: 'Active',
                },
            ]);
        }
    ),
];

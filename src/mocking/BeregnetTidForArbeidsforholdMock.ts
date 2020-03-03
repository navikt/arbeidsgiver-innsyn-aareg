import fetchMock from 'fetch-mock';
import { hentAntallArbeidsforholdLink } from '../App/lenker';

const delay = new Promise(res => setTimeout(res, 500));

fetchMock
    .get(
        hentAntallArbeidsforholdLink(),
        delay.then(() => {
            return mockObjekt;
        })
    )
    .spy();

const mockObjekt = [
    {
        arbeidsgiver: { organisasjonsnummer: '910825518', type: 'Organisasjon' },
        aktiveArbeidsforhold: 1500,
        inaktiveArbeidsforhold: 200
    },
    {
        arbeidsgiver: { organisasjonsnummer: '910825526', type: 'Organisasjon' },
        aktiveArbeidsforhold: 500,
        inaktiveArbeidsforhold: 4
    }
];

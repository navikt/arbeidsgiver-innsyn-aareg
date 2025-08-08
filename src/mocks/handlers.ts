import { http, HttpResponse } from 'msw';
import { aaregHandlers } from './aaregHandlers';
import { altinnHandlers } from './altinnHandlers';
import { arbeidsforholdHandlers } from './arbeidsforholdHandlers';
import { brukerApiHandlers } from './brukerApiHandlers';

export const handlers = () => [
    http.get('/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/innlogget', () => {
        return HttpResponse.json({});
    }),

    ...brukerApiHandlers,

    ...aaregHandlers,

    ...altinnHandlers,

    ...arbeidsforholdHandlers,
];

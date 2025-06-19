import { graphql, HttpResponse } from 'msw';

export const brukerApiHandlers = [
    graphql.query('hentNotifikasjoner', async ({ query, variables }) => {
        return HttpResponse.json({
            data: {
                notifikasjoner: {
                    feilAltinn: false,
                    feilDigiSyfo: false,
                    notifikasjoner: [],
                },
            },
        });
    }),
];

import { http, HttpResponse, passthrough } from 'msw';
import { handlers } from './handlers';

export const startMSW = async () => {
    const { setupWorker } = await import('msw/browser');
    const worker = setupWorker(
        ...handlers(),
        http.post('/collect', () => HttpResponse.json()),
        http.post('https://amplitude.nav.no/collect-auto', () => HttpResponse.json()),
        http.post('https://amplitude.nav.no/collect', () => HttpResponse.json()),
        http.post('https://umami.nav.no/api/send', () => HttpResponse.json()),
        http.get('*.svg', passthrough),
        http.get('*.js', passthrough),
        http.get('https://dekoratoren.ekstern.dev.nav.no/*', passthrough),
        http.get('https://login.ekstern.dev.nav.no/oauth2/session', () => HttpResponse.json())
    );
    await worker.start({
        serviceWorker: {
            // https://github.com/mswjs/msw/issues/2055
            url: '/arbeidsforhold/mockServiceWorker.js',
        },
    });
};

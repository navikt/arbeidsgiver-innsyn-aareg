import React from 'react';
import { createRoot } from 'react-dom/client';
import environment, { gittMiljo } from './utils/environment';
import '@navikt/ds-css';
import App from './App/App';
import { injectDecoratorClientSide } from '@navikt/nav-dekoratoren-moduler';
import { initializeFaro } from '@grafana/faro-web-sdk';
import { startMSW } from './mocks/msw';

initializeFaro({
    url: gittMiljo({
        prod: 'https://telemetry.nav.no/collect',
        dev: 'https://telemetry.ekstern.dev.nav.no/collect',
        other: '/collect',
    }),
    app: {
        name: 'aareg-innsyn-arbeidsgiver',
        version: environment.GIT_COMMIT,
    },
});

injectDecoratorClientSide({
    env: gittMiljo({
        prod: 'prod',
        other: 'dev',
    }),
    params: {
        context: 'arbeidsgiver',
        redirectToApp: true,
        level: 'Level4',
        logoutWarning: true,
    },
}).catch((e) => {
    console.error('#AG-ARBEIDSFORHOLD: injectDecoratorClientSide feilet', e);
});

const maintainance = gittMiljo({
    prod: false,
    dev: false,
    other: false,
});

const root = createRoot(document.getElementById('app')!);
if (maintainance) {
    root.render(
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <div>
                    <h1>Vi oppdaterer Innsyn i Aa-registeret</h1>
                    <p>Vi utfører vedlikehold på siden. Vi beklager ulempene dette medfører.</p>
                    <p>Vi er tilbake i løpet av kort tid.</p>
                </div>
            </div>
        </>
    );
} else if (import.meta.env.MODE === 'demo') {
    startMSW().then(() =>
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        )
    );
} else {
    root.render(<App />);
}

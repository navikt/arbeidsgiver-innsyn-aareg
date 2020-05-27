import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { init as Sentry } from '@sentry/browser';
import 'unorm/lib/unorm';
import 'whatwg-fetch';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import App from './App/App';

Sentry({
    dsn: 'https://037b93dd39294cddb53ee3d9fad4727c@sentry.gc.nav.no/12',
    release: process.env.GIT_COMMIT_HASH || 'unknown',
    environment: window.location.hostname
});

if (process.env.REACT_APP_MOCK) {
    console.log('==========================================');
    console.log('=============== MED MOCK =================');
    console.log('=== DETTE SKAL DU IKKE SE I PRODUKSJON ===');
    console.log('==========================================');

    require('./mocking/AaregMock');
    require('./mocking/altinnMock');
    require('./mocking/enkeltArbeidsforholdMock');
    require('./mocking/BeregnetTidForArbeidsforholdMock');
}

ReactDOM.render(<App />, document.getElementById('root'));
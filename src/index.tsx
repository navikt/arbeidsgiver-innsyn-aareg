import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';
import {init as Sentry} from '@sentry/browser';
import 'core-js';
import 'unorm/lib/unorm';



Sentry({
    dsn: 'https://037b93dd39294cddb53ee3d9fad4727c@sentry.gc.nav.no/12',
    release: process.env.GIT_COMMIT_HASH || 'unknown',
    environment: window.location.hostname,
});

if (process.env.REACT_APP_MOCK) {
    console.log('========================================');
    console.log('=============== MED MOCK ===============');
    console.log('===DETTE SKAL DU IKKE SE I PRODUKSJON===');
    console.log('========================================');
  require('./mocking/AaregMock');
    require('./mocking/altinnMock');
    require('./mocking/enkeltArbeidsforholdMock');
    //require('./mocking/hardkodetAaregmock');
}

ReactDOM.render(<App />, document.getElementById('root'));
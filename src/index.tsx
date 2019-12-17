import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';
import 'core-js';
import 'unorm/lib/unorm';

if (process.env.REACT_APP_MOCK) {
    console.log('========================================');
    console.log('=============== MED MOCK ===============');
    console.log('===DETTE SKAL DU IKKE SE I PRODUKSJON===');
    console.log('========================================');
    require('./mocking/AaregMock');
    require('./mocking/altinnMock');
    require('./mocking/enkeltArbeidsforholdMock');
}

ReactDOM.render(<App />, document.getElementById('root'));

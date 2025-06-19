import React from 'react';
import './EnkelBanner.css';
import { Heading } from '@navikt/ds-react';

const EnkelBanner = () => {
    return (
        <div className="banner">
            <div className="banner__tekst">
                <Heading size="large">Arbeidsforhold</Heading>
            </div>
        </div>
    );
};

export default EnkelBanner;

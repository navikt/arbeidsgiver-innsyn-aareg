import React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import './EnkelBanner.less';

const EnkelBanner = () => {
    return (
        <div className="banner">
            <div className="banner__tekst">
                <Innholdstittel>Arbeidsforhold</Innholdstittel>
            </div>
        </div>
    );
};

export default EnkelBanner;

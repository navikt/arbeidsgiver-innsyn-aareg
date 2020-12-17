import React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import './LoggInnBanner.less';

const LoggInnBanner = () => {
    return (
        <div className="banner">
            <div className="banner__tekst">
                <Innholdstittel>Arbeidsforhold</Innholdstittel>
            </div>
        </div>
    );
};

export default LoggInnBanner;

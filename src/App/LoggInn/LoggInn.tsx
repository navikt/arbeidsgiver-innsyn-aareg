import React from 'react';
import Lenke from 'nav-frontend-lenker';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Ingress, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import handshake from './handshake.svg';
import { TilgangsStyringInfoTekst } from './TilgangsStyringInfoTekst/TilgangsStyringInfoTekst';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import './Logginn.less';
import EnkelBanner from '../EnkelBanner/EnkelBanner';
import { gittMiljø } from '../../utils/environment';

export const redirectTilLogin = () => {
    const kjørerLokalt = gittMiljø({
        prod: false,
        dev: false,
        labs: false,
        other: true
    });
    if (kjørerLokalt) {
        document.cookie = 'selvbetjening-idtoken=0123456789..*; path=/;';
        window.location.href = '/arbeidsforhold/';
    } else {
        window.location.href = '/arbeidsforhold/redirect-til-login';
    }
};

const LoggInn = () => {
    return (
        <div className="innloggingsside">
            <Brodsmulesti />
            <EnkelBanner />
            <div className="innloggingsside__innhold">
                <div className="innloggingsside__circle">
                    <img src={handshake} className="handtrykkbilde" alt="bilde av håndtrykk" />
                </div>
                <Systemtittel className="innloggingsside__sidetittel">Innsyn i Aa-registeret</Systemtittel>

                <Ingress className="innloggingsside__ingress">
                    Oversikt over alle arbeidsforhold rapportert inn via A-meldingen.
                </Ingress>

                <TilgangsStyringInfoTekst />

                <Hovedknapp className="innloggingsside__loginKnapp" onClick={redirectTilLogin}>
                    Logg inn
                </Hovedknapp>

                <div className="innloggingsside__besok-ditt-nav">
                    <Normaltekst>Ønsker du å se dine tjenester som privatperson?</Normaltekst>
                    <Normaltekst className="logg-inn-lenke">
                        <Lenke href="https://www.nav.no/person/dittnav/">Logg inn på Ditt NAV</Lenke>
                    </Normaltekst>
                </div>
            </div>
        </div>
    );
};

export default LoggInn;

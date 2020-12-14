import React from 'react';
import Lenke from 'nav-frontend-lenker';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Ingress, Normaltekst, Sidetittel } from 'nav-frontend-typografi';
import environment from '../../utils/environment';
import handshake from './handshake.svg';
import { TilgangsStyringInfoTekst } from './TilgangsStyringInfoTekst/TilgangsStyringInfoTekst';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import './Logginn.less';
import LoggInnBanner from './LoggInnBanner/LoggInnBanner';

export const redirectTilLogin = () => {
    if (environment.MILJO === 'prod-sbs' || environment.MILJO === 'dev-sbs' || environment.MILJO === 'labs-gcp') {
        window.location.href = '/arbeidsforhold/redirect-til-login';
    } else {
        document.cookie = 'selvbetjening-idtoken=0123456789..*; path=/;';
        window.location.href = '/arbeidsforhold/';
    }
};

const LoggInn = () => {
    return (
        <div className="innloggingsside">
            <Brodsmulesti />
            <LoggInnBanner />
            <div className="innloggingsside__innhold">
                <div className="innloggingsside__circle">
                    <img src={handshake} className="handtrykkbilde" alt="bilde av håndtrykk" />
                </div>
                <Sidetittel className="innloggingsside__sidetittel">Innsyn i Aa-registeret</Sidetittel>

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

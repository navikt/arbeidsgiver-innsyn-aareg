import React from 'react';
import handshake from './handshake.svg';
import { TilgangsStyringInfoTekst } from './TilgangsStyringInfoTekst/TilgangsStyringInfoTekst';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import './Logginn.css';
import EnkelBanner from '../EnkelBanner/EnkelBanner';
import { gittMiljo } from '../../utils/environment';
import { BodyLong, BodyShort, Button, Heading, Link as Lenke } from '@navikt/ds-react';

export const redirectTilLogin = () => {
    const kjørerLokalt = gittMiljo({
        prod: false,
        dev: false,
        demo: false,
        other: true,
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
                <Heading size="medium" className="innloggingsside__sidetittel">
                    Innsyn i Aa-registeret
                </Heading>

                <BodyLong size="large" className="innloggingsside__ingress">
                    Oversikt over alle arbeidsforhold rapportert inn via A-meldingen.
                </BodyLong>

                <TilgangsStyringInfoTekst />

                <Button
                    variant="primary"
                    size="medium"
                    className="innloggingsside__loginKnapp"
                    onClick={redirectTilLogin}
                >
                    Logg inn
                </Button>

                <div className="innloggingsside__besok-ditt-nav">
                    <BodyShort>Ønsker du å se dine tjenester som privatperson?</BodyShort>
                    <BodyShort className="logg-inn-lenke">
                        <Lenke href="https://www.nav.no/person/dittnav/">
                            Logg inn på Ditt NAV
                        </Lenke>
                    </BodyShort>
                </div>
            </div>
        </div>
    );
};

export default LoggInn;

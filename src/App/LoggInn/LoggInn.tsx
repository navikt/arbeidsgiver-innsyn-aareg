import React, { FunctionComponent } from 'react';

import './Logginn.less';
import Lenke from 'nav-frontend-lenker';
import {Ingress, Normaltekst, Sidetittel} from 'nav-frontend-typografi';
import { TilgangsStyringInfoTekst } from './TilgangsStyringInfoTekst/TilgangsStyringInfoTekst';
import environment from "../../utils/environment";
import {Hovedknapp} from "nav-frontend-knapper";
import handshake from './handshake.svg';
import amplitude from "../../utils/amplitude";


const LoggInn: FunctionComponent = () => {

    const redirectTilLogin = () => {
        amplitude.logEvent("#arbeidsforhold bruker klikket på log-in via forside ");
        if (environment.MILJO === 'prod-sbs' || environment.MILJO === 'dev-sbs') {
            window.location.href = '/arbeidsforhold/redirect-til-login';
        } else {
            document.cookie = 'selvbetjening-idtoken =0123456789..*; path=/;';
            window.location.href = '/arbeidsforhold/';
        }
    };

    return (
        <>
            {
                <div className="innloggingsside">

                    <div className={'innloggingsside__innhold'}>
                        <div className={"innloggingsside__circle"}>
                        <img src={handshake} className={'innloggingsside__handtrykkbilde'} alt="bilde av håndtrykk" />
                        </div>
                        <Sidetittel className={'innloggingsside__sidetittel'}>
                           Innsyn i Aa-registeret
                        </Sidetittel>
                        <Ingress className={"innloggingsside__ingress"}>Oversikt over alle arbeidsforhold rapportert inn via A-meldingen. </Ingress>
                       <div className={'innloggingsside__margintop'} >
                        <TilgangsStyringInfoTekst />
                       </div>
                        <Hovedknapp
                            className={'innloggingsside__loginKnapp'}
                            onClick={redirectTilLogin}
                        >
                            Logg inn
                        </Hovedknapp>

                        <div className="innloggingsside__besok-ditt-nav">
                            <Normaltekst>
                            Ønsker du å se dine tjenester som privatperson? <br />
                            <Lenke href={'https://www.nav.no/person/dittnav/'}>
                                Logg inn på Ditt NAV
                            </Lenke>
                            </Normaltekst>
                        </div>

                    </div>
                </div>
            }
        </>
    );
};

export default LoggInn

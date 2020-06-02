import React from 'react';
import { Element } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import alertikon from './infomation-circle-2.svg';
import { basename } from '../../paths';
import './TilgangsStyringInfoTekst.less';

export const TilgangsStyringInfoTekst = () => {
    return (
        <div className="informasjonsboks">
            <div className="informasjonsboks__innhold">
                <img
                    src={alertikon}
                    alt="ikon for å vise at det kommer informasjon om tilgangsstyring"
                    className="informasjonsboks__ikon"
                />
                <div className="informasjonsboks__tekst">
                    <Element className="informasjonsboks__overskrift">Tildeling av roller foregår i Altinn </Element>
                    <Lenke className="informasjonsboks__lenke" href="https://arbeidsgiver.nav.no/min-side-arbeidsgiver/informasjon-om-tilgangsstyring">
                        Les mer om roller og tilganger
                    </Lenke>
                </div>
            </div>
        </div>
    );
};

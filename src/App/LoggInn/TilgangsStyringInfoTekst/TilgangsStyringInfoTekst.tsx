import React from 'react';
import { Element } from 'nav-frontend-typografi';
import alertikon from './infomation-circle-2.svg';
import Lenke from 'nav-frontend-lenker';
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
                    <Lenke className="informasjonsboks__lenke" href={basename + '/informasjon-om-tilgangsstyring'}>
                        Les mer om roller og tilganger
                    </Lenke>
                </div>
            </div>
        </div>
    );
};

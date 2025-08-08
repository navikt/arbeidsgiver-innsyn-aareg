import React from 'react';
import { Label, Link as Lenke } from '@navikt/ds-react';
import alertikon from './infomation-circle-2.svg';
import './TilgangsStyringInfoTekst.css';

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
                    <Label className="informasjonsboks__overskrift">
                        Tildeling av roller foregår i Altinn{' '}
                    </Label>
                    <Lenke
                        className="informasjonsboks__lenke"
                        href="https://arbeidsgiver.nav.no/min-side-arbeidsgiver/informasjon-om-tilgangsstyring"
                    >
                        Les mer om roller og tilganger
                    </Lenke>
                </div>
            </div>
        </div>
    );
};

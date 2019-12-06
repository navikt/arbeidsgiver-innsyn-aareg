import React, { FunctionComponent } from 'react';
import './TilgangsStyringInfoTekst.less';
import { Element } from 'nav-frontend-typografi';

import Lenke from 'nav-frontend-lenker';
import {basename} from "../../paths";


export const TilgangsStyringInfoTekst: FunctionComponent = () => {
    return (
        <div className={'informasjonsboks'}>
            <div className={'informasjonsboks__tekst'}>
                <Element className={'informasjonsboks__overskrift'}>
                    Tildeling av roller foregår i Altinn{' '}
                </Element>
                <Lenke
                    className={'informasjonsboks__lenke'}
                    href={basename + '/informasjon-om-tilgangsstyring'}
                >
                    Les mer om roller og tilganger.
                </Lenke>
            </div>
        </div>
    );
};

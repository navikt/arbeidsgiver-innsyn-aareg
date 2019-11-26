import React, { FunctionComponent } from 'react';
import { Normaltekst, Systemtittel, Ingress } from 'nav-frontend-typografi';
import './InformasjonOmBedrift.less';
import Lenke from 'nav-frontend-lenker';
import {OrganisasjonFraEnhetsregisteret, tomEnhetsregOrg} from "../../Objekter/OrganisasjonFraEnhetsregisteret";

interface Props {
    underenhet: OrganisasjonFraEnhetsregisteret;
    enhet: OrganisasjonFraEnhetsregisteret;

}

const InformasjonOmBedrift: FunctionComponent<Props> = props => {

    return (
        <>
            <div className="informasjon-om-bedrift">
                {props.underenhet !== tomEnhetsregOrg && (
                    <div className={'informasjon-om-bedrift__tekstomrade'}>
                        <Systemtittel>{props.underenhet.navn}</Systemtittel>
                        <br />
                        {props.underenhet.organisasjonsnummer && (
                            <div className={'informasjon-om-bedrift__infobolk'}>
                                <Normaltekst>Organisasjonsnummer</Normaltekst>
                                <Ingress> {props.underenhet.organisasjonsnummer}</Ingress>
                            </div>
                        )}
                        {props.underenhet.overordnetEnhet && (
                            <div className={'informasjon-om-bedrift__infobolk'}>
                                <Normaltekst>Overordnet enhet</Normaltekst>
                                <Ingress> {props.enhet.navn}</Ingress>
                            </div>
                        )}
                        {props.underenhet.forretningsadresse && (
                            <div className={'informasjon-om-bedrift__infobolk'}>
                                <Normaltekst>Forretningsadresse</Normaltekst>
                                <Ingress> {props.underenhet.forretningsadresse.adresse[0]}</Ingress>
                                <Ingress>
                                    {props.underenhet.forretningsadresse.postnummer +
                                        ' ' +
                                        props.underenhet.forretningsadresse.poststed}
                                </Ingress>
                            </div>
                        )}
                        <div className={'informasjon-om-bedrift__infobolk'}>
                            <Normaltekst className={'informasjon-om-bedrift__naeringskoder'}>
                                Næringskoder
                            </Normaltekst>
                            {props.underenhet.naeringskode1 && (
                                <Ingress>
                                    {props.underenhet.naeringskode1.kode +
                                        '. ' +
                                        props.underenhet.naeringskode1.beskrivelse}
                                </Ingress>
                            )}
                            {props.underenhet.naeringskode2 && (
                                <Ingress>
                                    {props.underenhet.naeringskode2.kode +
                                        '. ' +
                                        props.underenhet.naeringskode2.beskrivelse}
                                </Ingress>
                            )}
                            {props.underenhet.naeringskode3 && (
                                <Ingress>
                                    {props.underenhet.naeringskode3.kode +
                                        '. ' +
                                        props.underenhet.naeringskode3.beskrivelse}
                                </Ingress>
                            )}
                        </div>
                        {props.underenhet.hjemmeside && (
                            <div className={'informasjon-om-bedrift__infobolk'}>
                                <Normaltekst>Hjemmeside</Normaltekst>
                                <Lenke href={props.underenhet.hjemmeside}>{props.underenhet.hjemmeside}</Lenke>
                                <br />
                            </div>
                        )}

                        {props.underenhet.organisasjonsform && (
                            <div className={'informasjon-om-bedrift__infobolk'}>
                                <Normaltekst>Organisasjonsform </Normaltekst>
                                <Ingress>
                                    {props.underenhet.organisasjonsform.beskrivelse +
                                        ' ' +
                                        '(' +
                                        props.underenhet.organisasjonsform.kode +
                                        ')'}
                                </Ingress>
                            </div>
                        )}
                        {props.underenhet.postadresse && (
                            <div className={'informasjon-om-bedrift__infobolk'}>
                                <Normaltekst>Postadresse</Normaltekst>
                                <Ingress>{props.underenhet.postadresse.adresse[0]}</Ingress>
                                <Ingress>
                                    {props.underenhet.postadresse.postnummer +
                                        ' ' +
                                        props.underenhet.postadresse.poststed}
                                </Ingress>
                            </div>
                        )}
                    </div>
                )}
                {props.underenhet === tomEnhetsregOrg && <div> Kunne ikke hente informasjon</div>}
            </div>
        </>
    );
};

export default InformasjonOmBedrift;

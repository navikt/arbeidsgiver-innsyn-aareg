import React, {FunctionComponent, useState} from 'react';
import { Normaltekst, Systemtittel, Ingress } from 'nav-frontend-typografi';
import './InformasjonOmBedrift.less';
import Lenke from 'nav-frontend-lenker';
import {OrganisasjonFraEnhetsregisteret, tomEnhetsregOrg} from "../../Objekter/OrganisasjonFraEnhetsregisteret";

interface Props {
    underenhet: OrganisasjonFraEnhetsregisteret;
    enhet: OrganisasjonFraEnhetsregisteret;

}
const InformasjonOmBedrift: FunctionComponent<Props> = props => {
    const [underenhetEEreg, setUnderenhetEEreg] = useState(props.underenhet);
    const [enhetEEreg, setEnhetEEreg] = useState(props.enhet);

    return (
        <>
            <div className="informasjon-om-bedrift">
                {underenhetEEreg !== tomEnhetsregOrg && (
                    <div className={'informasjon-om-bedrift__tekstomrade'}>
                        <Systemtittel>{underenhetEEreg.navn}</Systemtittel>
                        <br />
                        {underenhetEEreg.organisasjonsnummer && (
                            <div className={'informasjon-om-bedrift__infobolk'}>
                                <Normaltekst>Organisasjonsnummer</Normaltekst>
                                <Ingress> {underenhetEEreg}</Ingress>
                            </div>
                        )}
                        {underenhetEEreg.overordnetEnhet && (
                            <div className={'informasjon-om-bedrift__infobolk'}>

                                <Normaltekst>Overordnet enhet</Normaltekst>
                                <Ingress> {enhetEEreg.navn}</Ingress>
                            </div>
                        )}
                        {underenhetEEreg.forretningsadresse && (
                            <div className={'informasjon-om-bedrift__infobolk'}>
                                <Normaltekst>Forretningsadresse</Normaltekst>
                                <Ingress> {underenhetEEreg.forretningsadresse.adresse[0]}</Ingress>
                                <Ingress>
                                    {underenhetEEreg.forretningsadresse.postnummer +
                                        ' ' +
                                    underenhetEEreg.forretningsadresse.poststed}
                                </Ingress>
                            </div>
                        )}
                        <div className={'informasjon-om-bedrift__infobolk'}>
                            <Normaltekst className={'informasjon-om-bedrift__naeringskoder'}>
                                Næringskoder
                            </Normaltekst>
                            {underenhetEEreg.naeringskode1 && (
                                <Ingress>
                                    {underenhetEEreg.naeringskode1.kode +
                                        '. ' +
                                    underenhetEEreg.naeringskode1.beskrivelse}
                                </Ingress>
                            )}
                            {underenhetEEreg.naeringskode2 && (
                                <Ingress>
                                    {underenhetEEreg.naeringskode2.kode +
                                        '. ' +
                                    underenhetEEreg.naeringskode2.beskrivelse}
                                </Ingress>
                            )}
                            {underenhetEEreg.naeringskode3 && (
                                <Ingress>
                                    {underenhetEEreg.naeringskode3.kode +
                                        '. ' +
                                    underenhetEEreg.naeringskode3.beskrivelse}
                                </Ingress>
                            )}
                        </div>
                        {underenhetEEreg.hjemmeside && (
                            <div className={'informasjon-om-bedrift__infobolk'}>
                                <Normaltekst>Hjemmeside</Normaltekst>
                                <Lenke href={underenhetEEreg.hjemmeside}>{underenhetEEreg.hjemmeside}</Lenke>
                                <br />
                            </div>
                        )}

                        {underenhetEEreg.organisasjonsform && (
                            <div className={'informasjon-om-bedrift__infobolk'}>
                                <Normaltekst>Organisasjonsform </Normaltekst>
                                <Ingress>
                                    {underenhetEEreg.organisasjonsform.beskrivelse +
                                        ' ' +
                                        '(' +
                                    underenhetEEreg.organisasjonsform.kode +
                                        ')'}
                                </Ingress>
                            </div>
                        )}
                        {underenhetEEreg.postadresse && (
                            <div className={'informasjon-om-bedrift__infobolk'}>
                                <Normaltekst>Postadresse</Normaltekst>
                                <Ingress>{underenhetEEreg.postadresse.adresse[0]}</Ingress>
                                <Ingress>
                                    {underenhetEEreg.postadresse.postnummer +
                                        ' ' +
                                    underenhetEEreg.postadresse.poststed}
                                </Ingress>
                            </div>
                        )}
                    </div>
                )}
                {underenhetEEreg === tomEnhetsregOrg && <div> Kunne ikke hente informasjon</div>}
            </div>
        </>
    );
};

export default InformasjonOmBedrift;

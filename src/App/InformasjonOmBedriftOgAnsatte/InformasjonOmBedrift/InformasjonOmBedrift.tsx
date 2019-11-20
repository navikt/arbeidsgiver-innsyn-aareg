import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Normaltekst, Systemtittel, Ingress } from 'nav-frontend-typografi';
import './InformasjonOmBedrift.less';
import Lenke from 'nav-frontend-lenker';

import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import {
    OrganisasjonFraEnhetsregisteret,
    tomEnhetsregOrg,
} from '../../../Objekter/Organisasjoner/OrganisasjonFraEnhetsregisteret';
import { hentOverordnetEnhet, hentUnderenhet } from '../../../api/enhetsregisteretApi';

const InformasjonOmBedrift: FunctionComponent = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [underenhet, setUnderenhet] = useState<OrganisasjonFraEnhetsregisteret>(tomEnhetsregOrg);
    const [overordnetEnhet, setOverordnetEnhet] = useState<OrganisasjonFraEnhetsregisteret>(
        tomEnhetsregOrg
    );
    const orgnr = valgtOrganisasjon.OrganizationNumber;

    useEffect(() => {
        const setEnheter = async () => {
            if (orgnr !== '') {
                setUnderenhet(await hentUnderenhet(orgnr));
                setOverordnetEnhet(await hentOverordnetEnhet(underenhet.overordnetEnhet));
            }
        };
        setEnheter();
    }, [orgnr, underenhet.overordnetEnhet]);

    return (
        <>
            <div className="informasjon-om-bedrift">
                {underenhet !== tomEnhetsregOrg && (
                    <div className={'informasjon-om-bedrift__tekstomrade'}>
                        <Systemtittel>{underenhet.navn}</Systemtittel>
                        <br />
                        {underenhet.organisasjonsnummer && (
                            <div className={'informasjon-om-bedrift__infobolk'}>
                                <Normaltekst>Organisasjonsnummer</Normaltekst>
                                <Ingress> {underenhet.organisasjonsnummer}</Ingress>
                            </div>
                        )}
                        {underenhet.overordnetEnhet && (
                            <div className={'informasjon-om-bedrift__infobolk'}>
                                <Normaltekst>Overordnet enhet</Normaltekst>
                                <Ingress> {overordnetEnhet.navn}</Ingress>
                            </div>
                        )}
                        {underenhet.forretningsadresse && (
                            <div className={'informasjon-om-bedrift__infobolk'}>
                                <Normaltekst>Forretningsadresse</Normaltekst>
                                <Ingress> {underenhet.forretningsadresse.adresse[0]}</Ingress>
                                <Ingress>
                                    {underenhet.forretningsadresse.postnummer +
                                        ' ' +
                                        underenhet.forretningsadresse.poststed}
                                </Ingress>
                            </div>
                        )}
                        <div className={'informasjon-om-bedrift__infobolk'}>
                            <Normaltekst className={'informasjon-om-bedrift__naeringskoder'}>
                                Næringskoder
                            </Normaltekst>
                            {underenhet.naeringskode1 && (
                                <Ingress>
                                    {underenhet.naeringskode1.kode +
                                        '. ' +
                                        underenhet.naeringskode1.beskrivelse}
                                </Ingress>
                            )}
                            {underenhet.naeringskode2 && (
                                <Ingress>
                                    {underenhet.naeringskode2.kode +
                                        '. ' +
                                        underenhet.naeringskode2.beskrivelse}
                                </Ingress>
                            )}
                            {underenhet.naeringskode3 && (
                                <Ingress>
                                    {underenhet.naeringskode3.kode +
                                        '. ' +
                                        underenhet.naeringskode3.beskrivelse}
                                </Ingress>
                            )}
                        </div>
                        {underenhet.hjemmeside && (
                            <div className={'informasjon-om-bedrift__infobolk'}>
                                <Normaltekst>Hjemmeside</Normaltekst>
                                <Lenke href={underenhet.hjemmeside}>{underenhet.hjemmeside}</Lenke>
                                <br />
                            </div>
                        )}

                        {underenhet.organisasjonsform && (
                            <div className={'informasjon-om-bedrift__infobolk'}>
                                <Normaltekst>Organisasjonsform </Normaltekst>
                                <Ingress>
                                    {underenhet.organisasjonsform.beskrivelse +
                                        ' ' +
                                        '(' +
                                        underenhet.organisasjonsform.kode +
                                        ')'}
                                </Ingress>
                            </div>
                        )}
                        {underenhet.postadresse && (
                            <div className={'informasjon-om-bedrift__infobolk'}>
                                <Normaltekst>Postadresse</Normaltekst>
                                <Ingress>{underenhet.postadresse.adresse[0]}</Ingress>
                                <Ingress>
                                    {underenhet.postadresse.postnummer +
                                        ' ' +
                                        underenhet.postadresse.poststed}
                                </Ingress>
                            </div>
                        )}
                    </div>
                )}
                {underenhet === tomEnhetsregOrg && <div> Kunne ikke hente informasjon</div>}
            </div>
        </>
    );
};

export default InformasjonOmBedrift;

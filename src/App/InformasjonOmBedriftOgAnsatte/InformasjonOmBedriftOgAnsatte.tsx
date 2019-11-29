import React, {FunctionComponent, useEffect, useState} from 'react';
import './InformasjonOmBedriftOgAnsatte.less';
import Tabs from 'nav-frontend-tabs';
import { RouteComponentProps } from 'react-router'

import Informasjon from './InformasjonOmBedrift/InformasjonOmBedrift';
import MineAnsatte from './MineAnsatte/MineAnsatte';
import Banner from './HovedBanner/HovedBanner';
import {OrganisasjonFraAltinn} from "../Objekter/OrganisasjonFraAltinn";
import {genererMockingAvArbeidsForhold} from "../../mocking/funksjonerForAlageAAregMock";
import {arbeidsforhold} from "../Objekter/ObjektFraAAreg";
import {tomEnhetsregOrg} from "../Objekter/OrganisasjonFraEnhetsregisteret";
import {hentOverordnetEnhet, hentUnderenhet} from "../../api/AAregApi";

const InformasjonOmBedriftOgAnsatte: FunctionComponent<RouteComponentProps> = () => {
    const [visInfoEllerAnsatte, setVisInfoEllerAnsatte] = useState('informasjon');
    const [listeOverArbeidsForholdFraAareg, setListeOverArbeidsForholdFraAareg] = useState(Array<arbeidsforhold>());
    const [underenhetEEreg, setUnderenhetEEreg] = useState(tomEnhetsregOrg);
    const [enhetEEreg, setEnhetEEreg] = useState(tomEnhetsregOrg);


    useEffect(() => {
        const valgtOrganisasjon: OrganisasjonFraAltinn = {
            Name: 'NAV HAMAR ',
            Type: 'Business',
            OrganizationNumber: '990229023',
            ParentOrganizationNumber: '874652202',
            OrganizationForm: 'BEDR',
            Status: 'Active',
        };
        const listeMedArbeidsForhold = genererMockingAvArbeidsForhold(1000);
        setListeOverArbeidsForholdFraAareg(listeMedArbeidsForhold);
        const setEnheter = async () => {
            if (valgtOrganisasjon.OrganizationNumber !== '') {
                setUnderenhetEEreg(await hentUnderenhet(valgtOrganisasjon.OrganizationNumber));
                setEnhetEEreg(await hentOverordnetEnhet(valgtOrganisasjon.ParentOrganizationNumber));
            }
        };
        setEnheter();

    }, []);

    const setStateForVisning = (index: number) => {
        if (index === 0) {
            setVisInfoEllerAnsatte('informasjon');
        }
        if (index === 1) {
            setVisInfoEllerAnsatte('ansatte');
        }
    };

        return (
            <>
<Banner>
                {' '}
                <div className="bedrift-og-ansatte-tab">
                    <Tabs
                        tabs={[{ label: 'Informasjon om bedrift' }, { label: 'Mine ansatte' }]}
                        onChange={(event: any, index: number) => setStateForVisning(index)}
                        kompakt
                    />
                </div>
                {visInfoEllerAnsatte === 'informasjon' && <Informasjon underenhet={underenhetEEreg} enhet={enhetEEreg}/>}
                {visInfoEllerAnsatte === 'ansatte' && <MineAnsatte listeMedArbeidsForhold={listeOverArbeidsForholdFraAareg} />}
                </Banner>
                </>
        );


};

export default InformasjonOmBedriftOgAnsatte;

import React, {FunctionComponent, useEffect, useState} from 'react';
import './InformasjonOmBedriftOgAnsatte.less';
import Tabs from 'nav-frontend-tabs';
import { RouteComponentProps } from 'react-router'

import Informasjon from './InformasjonOmBedrift/InformasjonOmBedrift';
import MineAnsatte from './MineAnsatte/MineAnsatte';
import { hentArbeidsforholdFraAAreg} from "../../api/AAregApi";
import {OrganisasjonFraAltinn} from "../Objekter/OrganisasjonFraAltinn";



const InformasjonOmBedriftOgAnsatte: FunctionComponent<RouteComponentProps> = () => {
    const [visInfoEllerAnsatte, setVisInfoEllerAnsatte] = useState('informasjon');
    const [listeOverArbeidsForholdFraAareg, setlisteOverArbeidsForholdFraAareg] = useState([]);
    const valgtOrganisasjon: OrganisasjonFraAltinn = {
        Name: 'BALLSTAD OG HAMARØY',
        Type: 'Business',
        OrganizationNumber: '811076732',
        ParentOrganizationNumber: '811076112',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    }

    useEffect(() => {
        if (valgtOrganisasjon) {
            const hentArbeidsforhold = async () =>  {
                let objekt = await hentArbeidsforholdFraAAreg(valgtOrganisasjon.OrganizationNumber);
                if (objekt) {
                     setlisteOverArbeidsForholdFraAareg(objekt);

                }
                };
            hentArbeidsforhold();
        }
    }, [valgtOrganisasjon]);

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

                {' '}
                <div className="bedrift-og-ansatte-tab">
                    <Tabs
                        tabs={[{ label: 'Informasjon om bedrift' }, { label: 'Mine ansatte' }]}
                        onChange={(event: any, index: number) => setStateForVisning(index)}
                        kompakt
                    />
                </div>
                {visInfoEllerAnsatte === 'informasjon' && <Informasjon valgtOrganisasjon={valgtOrganisasjon}/>}
                {visInfoEllerAnsatte === 'ansatte' && <MineAnsatte listeMedArbeidsForhold={listeOverArbeidsForholdFraAareg} />}
                </>
        );


};

export default InformasjonOmBedriftOgAnsatte;

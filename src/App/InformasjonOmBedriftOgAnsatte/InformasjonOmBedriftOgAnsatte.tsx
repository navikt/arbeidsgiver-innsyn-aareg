import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import './InformasjonOmBedriftOgAnsatte.less';
import Tabs from 'nav-frontend-tabs';

import Informasjon from './InformasjonOmBedrift/InformasjonOmBedrift';
import MineAnsatte from './MineAnsatte/MineAnsatte';
import { hentArbeidsforholdFraAAreg} from "../api/AAregApi";
import {OrganisasjonFraAltinn} from "../Objekter/OrganisasjonFraAltinn";

interface Props {
    valgtOrganisasjon: OrganisasjonFraAltinn,
};

const InformasjonOmBedriftOgAnsatte: FunctionComponent<Props> = props => {
    const [visInfoEllerAnsatte, setVisInfoEllerAnsatte] = useState('informasjon');
    const [listeOverArbeidsForholdFraAareg, setlisteOverArbeidsForholdFraAareg] = useState([]);
    useEffect(() => {
        if (props.valgtOrganisasjon) {
            const hentArbeidsforhold = async () =>  {
                let objekt = await hentArbeidsforholdFraAAreg(props.valgtOrganisasjon.OrganizationNumber);
                if (objekt) {
                     setlisteOverArbeidsForholdFraAareg(objekt);

                }
                };
            hentArbeidsforhold();
        }
    }, [props.valgtOrganisasjon]);

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
                {visInfoEllerAnsatte === 'informasjon' && <Informasjon/>}
                {visInfoEllerAnsatte === 'ansatte' && <MineAnsatte listeMedArbeidsForhold={listeOverArbeidsForholdFraAareg} />}
                </>
        );


};

export default InformasjonOmBedriftOgAnsatte;

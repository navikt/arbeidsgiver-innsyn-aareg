import React, { FunctionComponent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';

import './HovedBanner.less';



import {orgTreMock} from "../../../mocking/mockresponsFraAltinn";
import {Organisasjon} from "../../Objekter/OrganisasjonFraAltinn";




const Banner: FunctionComponent<RouteComponentProps> = props => {
    const { history } = props;


   const endreOrganisasjon = (org: Organisasjon) => {
       console.log(org)
   }

    const onOrganisasjonChange = (organisasjon?: Organisasjon) => {
        if (organisasjon) {
            endreOrganisasjon(organisasjon);
        }
    };




    return (
        <Bedriftsmeny
            sidetittel="Min side – arbeidsgiver"
            organisasjonstre={orgTreMock}
            onOrganisasjonChange={onOrganisasjonChange}
            history={history}
        />
    );
};

export default withRouter(Banner);

import React, { FunctionComponent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';

import './HovedBanner.less';
import {Organisasjon} from "@navikt/bedriftsmeny/lib/Organisasjon";

import {JuridiskEnhetMedUnderEnheter} from "../../Objekter/JuridiskEnhetMedUnderEnheter";
import {byggOrganisasjonstre} from "../../byggOrganisasjonsTre";
import {orgTreMock} from "../../../mocking/mockresponsFraAltinn";
import {OrganisasjonFraAltinn} from "../../Objekter/OrganisasjonFraAltinn";



const Banner: FunctionComponent<RouteComponentProps> = props => {
    const { history } = props;
    const orgtre: JuridiskEnhetMedUnderEnheter = byggOrganisasjonstre(OrganisasjonFraAltinn);

   const endreOrganisasjon = (org: OrganisasjonFraAltinn) => {
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

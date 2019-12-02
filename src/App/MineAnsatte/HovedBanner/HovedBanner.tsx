import React, {FunctionComponent, useEffect, useState} from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import './HovedBanner.less';
import {OrganisasjonerRespons} from "../../../mocking/mockresponsFraAltinn";
import {Organisasjon} from "../../Objekter/OrganisasjonFraAltinn";
import {JuridiskEnhetMedUnderEnheterArray} from "../../Objekter/JuridiskEnhetMedUnderenhetArray";
import {byggOrganisasjonstre} from "./byggOrganisasjonsTre";


const Banner: FunctionComponent<RouteComponentProps> = props => {
    const { history } = props;
    const [organisasjonstre, setorganisasjonstre] = useState(
        Array<JuridiskEnhetMedUnderEnheterArray>());

  useEffect(() => {
    const lagOgSettTre = async () => {
      const juridiskeenheterMedBarn: JuridiskEnhetMedUnderEnheterArray[] = await byggOrganisasjonstre(
          OrganisasjonerRespons
      );
      return juridiskeenheterMedBarn
    };
    lagOgSettTre().then(juridiskeenheterMedBarn => setorganisasjonstre(juridiskeenheterMedBarn));
  }, []);

    const endreOrganisasjon = (org: Organisasjon) => {
       console.log(org)
   };

    const onOrganisasjonChange = (organisasjon?: Organisasjon) => {
        if (organisasjon) {
            endreOrganisasjon(organisasjon);
        }
    };

    return (
        <Bedriftsmeny
            sidetittel="Oversikt over bedrift og ansatte"
            organisasjonstre={organisasjonstre}
            onOrganisasjonChange={onOrganisasjonChange}
            history={history}
        />
    );
};

export default withRouter(Banner);

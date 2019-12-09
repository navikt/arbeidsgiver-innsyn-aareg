import React, {FunctionComponent, useEffect, useState} from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import './HovedBanner.less';
import {Organisasjon} from "../../Objekter/OrganisasjonFraAltinn";
import {JuridiskEnhetMedUnderEnheterArray} from "../../Objekter/JuridiskEnhetMedUnderenhetArray";
import {byggOrganisasjonstre} from "./byggOrganisasjonsTre";
import {hentOrganisasjonerFraAltinn} from "../../../api/altinnApi";

interface Props {
    byttOrganisasjon: (org: Organisasjon) => void;
};
const Banner: FunctionComponent<RouteComponentProps & Props> = props => {
    const { history } = props;
    const [organisasjonstre, setorganisasjonstre] = useState(
        Array<JuridiskEnhetMedUnderEnheterArray>());

    useEffect(() => {
      const hentOgSettOrganisasjoner = async () => {
          const organisasjonliste: Organisasjon[] = await hentOrganisasjonerFraAltinn();
          return organisasjonliste;
      };
      const lagOgSettTre = async (organisasjoner: Organisasjon[]) => {
      const juridiskeenheterMedBarn: JuridiskEnhetMedUnderEnheterArray[] = await byggOrganisasjonstre(
          organisasjoner
      );
      return juridiskeenheterMedBarn
    };

      hentOgSettOrganisasjoner().then(organisasjoner => {
          lagOgSettTre(organisasjoner).then(juridiskeenheterMedBarn => setorganisasjonstre(juridiskeenheterMedBarn));
      });
  }, []);

    const endreOrganisasjon = (org: Organisasjon) => {
       props.byttOrganisasjon(org);
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
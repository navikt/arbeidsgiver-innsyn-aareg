import React, {FunctionComponent, useEffect, useState} from 'react';
import './App.css';
import {OrganisasjonFraAltinn} from "./Objekter/OrganisasjonFraAltinn";
import {hentOrganisasjonerFraAltinn} from "./api/altinnApi";
import {JuridiskEnhetMedUnderEnheter} from "./Objekter/JuridiskEnhetMedUnderEnheter";
import {byggOrganisasjonstre} from "./api/byggOrganisasjonstre";
import { withRouter, RouteComponentProps } from 'react-router';
import Bedriftsmeny from "@navikt/bedriftsmeny";

const App: FunctionComponent<RouteComponentProps> = props => {
  const { history } = props;
  const [organisasjonsTre, setOrganisasjonsTre] = useState(Array<JuridiskEnhetMedUnderEnheter >());
  const [valgtOrganisasjon, setValgtOrganisasjon] = useState<OrganisasjonFraAltinn | null>(null);

  useEffect(() => {
    const hentOrganisasjonerOgByggTre = async () => {
      const organisasjonsRespons = await hentOrganisasjonerFraAltinn();
      if (organisasjonsRespons) {
        const bygdOrganisasjonstre = await byggOrganisasjonstre(organisasjonsRespons);
        setOrganisasjonsTre(bygdOrganisasjonstre);
    };
    }
    hentOrganisasjonerOgByggTre();
  }, []);

  return (
    <div className="App">
      <Bedriftsmeny
          sidetittel="Informasjon om bedrift og ansatte"
          organisasjonstre={organisasjonsTre}
          onOrganisasjonChange={setValgtOrganisasjon}
          history={history}
      />
    </div>
  );
}

export default App;

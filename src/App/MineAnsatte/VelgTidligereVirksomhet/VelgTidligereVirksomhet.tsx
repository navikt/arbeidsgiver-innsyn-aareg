import React from 'react';
import {Organisasjon} from "../../Objekter/OrganisasjonFraAltinn";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";

interface Props {
  tidligereOrganisasjoner?: Organisasjon[];
  tidligereVirksomhet: Organisasjon;
  setTidligereVirksomhet?: (virksomhet: Organisasjon) => void;
}


const VelgTidligereVirksomhet = ({ tidligereOrganisasjoner, tidligereVirksomhet, setTidligereVirksomhet}: Props) => {

  const objekter = tidligereOrganisasjoner && tidligereOrganisasjoner.map(virksomhet => {
    return <div onClick={() => setTidligereVirksomhet && setTidligereVirksomhet(virksomhet)}>{virksomhet.Name}</div>
  })

  return (
      <Ekspanderbartpanel tittel={tidligereVirksomhet.Name}>
        {objekter}
      </Ekspanderbartpanel>
  );

};

export default VelgTidligereVirksomhet;
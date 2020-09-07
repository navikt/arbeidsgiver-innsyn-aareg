import React from 'react';
import './VelgTidligereVirksomhet.less';
import {Organisasjon} from "../../Objekter/OrganisasjonFraAltinn";
import {Select} from "nav-frontend-skjema";

interface Props {
  tidligereOrganisasjoner?: Organisasjon[];
  setTidligereVirksomhet: (virksomhet: Organisasjon) => void;
}

const VelgTidligereVirksomhet = ({ tidligereOrganisasjoner, setTidligereVirksomhet}: Props) => {
    const objekter = tidligereOrganisasjoner && tidligereOrganisasjoner.map((virksomhet) => {
    return <option  value={virksomhet.OrganizationNumber} key={virksomhet.OrganizationNumber}
    >{virksomhet.Name}</option>
  })

  return (
      <div className={'mine-ansatte__velg-tidligere-virksomhet'}>
        <Select placeholder={'Velg tidligere virksomhet'} onChange={event => {
          const fullVirksomhet = tidligereOrganisasjoner?.filter(virksomhet => {
            return virksomhet.OrganizationNumber === event.target.value;
          })[0]
          setTidligereVirksomhet(fullVirksomhet!!);
        }} id = {'velg-tidligere-virksomhet' }  >
          {objekter}
        </Select>
      </div>
  );
};

export default VelgTidligereVirksomhet;
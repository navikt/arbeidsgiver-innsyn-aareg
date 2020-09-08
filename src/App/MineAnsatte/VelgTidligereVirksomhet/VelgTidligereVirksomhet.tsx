import React, {useEffect} from 'react';
import './VelgTidligereVirksomhet.less';
import {Organisasjon} from "../../Objekter/OrganisasjonFraAltinn";
import {Select} from "nav-frontend-skjema";
import environment from "../../../utils/environment";
import amplitude from "../../../utils/amplitude";
import {tidligerVirksomheter} from "../../../mocking/mockresponsFraAltinn";

interface Props {
  tidligereOrganisasjoner?: Organisasjon[];
  setTidligereVirksomhet: (virksomhet: Organisasjon) => void;
  tidligereVirksomhet?: Organisasjon;
}

const VelgTidligereVirksomhet = ({ tidligereOrganisasjoner, setTidligereVirksomhet, tidligereVirksomhet}: Props) => {
    const objekter = tidligereOrganisasjoner && tidligereOrganisasjoner.map((virksomhet) => {
    return <option  value={virksomhet.OrganizationNumber} key={virksomhet.OrganizationNumber}
    >{virksomhet.Name}</option>
  })

    useEffect(() => {
        if (!tidligereVirksomhet?.OrganizationNumber.length) {
            setTidligereVirksomhet(tidligereOrganisasjoner!![0])
        }
    }, []);

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
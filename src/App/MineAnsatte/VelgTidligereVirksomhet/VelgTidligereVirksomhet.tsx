import React from 'react';
import './VelgTidligereVirksomhet.less';
import {Organisasjon, tomaAltinnOrganisasjon} from "../../Objekter/OrganisasjonFraAltinn";
import {Select} from "nav-frontend-skjema";
import {RouteComponentProps, withRouter} from "react-router";

interface Props extends RouteComponentProps {
  tidligereVirksomheter?: Organisasjon[];
  setTidligereVirksomhet: (virksomhet: Organisasjon) => void;
  valgtTidligereVirksomhet?: Organisasjon;
}

const VelgTidligereVirksomhet = ({ tidligereVirksomheter, setTidligereVirksomhet, valgtTidligereVirksomhet}: Props) => {
  const currentUrl = new URL(window.location.href);
  const parameterForTidligereVirksomhet = currentUrl.searchParams.get('tidligereVirksomhet');

  if (valgtTidligereVirksomhet === tomaAltinnOrganisasjon && tidligereVirksomheter){
    if (parameterForTidligereVirksomhet) {
      const organisasjon = tidligereVirksomheter.filter(organisasjon => organisasjon.OrganizationNumber === parameterForTidligereVirksomhet);
      if (organisasjon.length) {
        setTidligereVirksomhet(organisasjon[0]);
      }
      else {
        setTidligereVirksomhet(tidligereVirksomheter[0]);
      }
    }
    else {
      setTidligereVirksomhet(tidligereVirksomheter[0]);
    }
  }

    const objekter = tidligereVirksomheter && tidligereVirksomheter.map((virksomhet) => {
      const erValgt = virksomhet.OrganizationNumber === valgtTidligereVirksomhet?.OrganizationNumber;
    return (
      <option title={virksomhet.Name +", " +virksomhet.OrganizationNumber} className={"mine-ansatte__velg-tidligere-virksomhet-option"} selected={erValgt} id={'tidligere-virksomhet'} value={virksomhet.OrganizationNumber} key={virksomhet.OrganizationNumber}
    >{virksomhet.Name +", " +virksomhet.OrganizationNumber}
      </option>
    );
  })

  return (
      <div className={'mine-ansatte__velg-tidligere-virksomhet'}>
        <Select placeholder={'Velg tidligere virksomhet'} onChange={event => {
          const fullVirksomhet = tidligereVirksomheter?.filter(virksomhet => {
            return virksomhet.OrganizationNumber === event.target.value;
          })[0]
          setTidligereVirksomhet(fullVirksomhet!!);
        }} id = {'velg-tidligere-virksomhet' }  >
          {objekter}
        </Select>
      </div>
  );
};

export default withRouter(VelgTidligereVirksomhet);
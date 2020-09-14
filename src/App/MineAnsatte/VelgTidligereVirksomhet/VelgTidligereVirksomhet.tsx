import React from 'react';
import './VelgTidligereVirksomhet.less';
import {Organisasjon, tomaAltinnOrganisasjon} from "../../Objekter/OrganisasjonFraAltinn";
import {Select} from "nav-frontend-skjema";
import {RouteComponentProps, withRouter} from "react-router";
import UnderenhetIkon from "./UnderenhetIkon";

interface Props extends RouteComponentProps {
  tidligereVirksomheter?: Organisasjon[];
  setTidligereVirksomhet: (virksomhet: Organisasjon) => void;
  redirectTilbake: () => void;
  valgtTidligereVirksomhet?: Organisasjon;
}

const VelgTidligereVirksomhet = ({ tidligereVirksomheter, setTidligereVirksomhet, valgtTidligereVirksomhet, redirectTilbake}: Props) => {
  if (tidligereVirksomheter === undefined) {
      redirectTilbake();
  }

  if (valgtTidligereVirksomhet === tomaAltinnOrganisasjon) {
      setTidligereVirksomhet(tidligereVirksomheter!![0]);
    }

    const objekter = tidligereVirksomheter && tidligereVirksomheter.map((virksomhet) => {
            const erValgt = virksomhet.OrganizationNumber === valgtTidligereVirksomhet?.OrganizationNumber;
            return (
                <option title={virksomhet.Name +", " +virksomhet.OrganizationNumber}
                        className={"mine-ansatte__velg-tidligere-virksomhet-option"}
                        selected={erValgt} id={'tidligere-virksomhet'}
                        value={virksomhet.OrganizationNumber}
                        key={virksomhet.OrganizationNumber}>
                    {virksomhet.Name +", " +virksomhet.OrganizationNumber}
                </option>
        );
  })

  return (
      <div className={'mine-ansatte__velg-tidligere-virksomhet'}>
        <Select
            label={<div className={'mine-ansatte__velg-tidligere-virksomhet-label'} > <UnderenhetIkon/> Nedlagt/omstrukturert virksomhet</div>}
            placeholder={'Velg tidligere virksomhet'}
            onChange={event => {
                const fullVirksomhet = tidligereVirksomheter?.filter(virksomhet => {
                return virksomhet.OrganizationNumber === event.target.value;
                 })[0]
                setTidligereVirksomhet(fullVirksomhet!!);
            }}
            id = {'velg-tidligere-virksomhet' }  >
          {objekter}
        </Select>
      </div>
  );
};

export default withRouter(VelgTidligereVirksomhet);
import React, {FunctionComponent, useEffect, useState} from 'react';
import logo from '../logo.svg';
import './App.css';
import {hentArbeidsforhold} from "./api/AAregApi";
import {OrganisasjonFraAltinn} from "./Objekter/OrganisasjonFraAltinn";
import {hentOrganisasjonerFraAltinn} from "./api/altinnApi";

const App: FunctionComponent = () => {
  const [organisasjonsListe, setOrganisasjonsListe] = useState(Array<OrganisasjonFraAltinn>());
  useEffect(() => {
    const hentOrganisasjoner = async () => {
      const organisasjonsRespons = await hentOrganisasjonerFraAltinn();
      const organisasjonsResponsFiltrert = organisasjonsRespons.filter((organisasjon: OrganisasjonFraAltinn) => {
        return organisasjon.OrganizationForm === 'BEDR';
      });
      if (organisasjonsResponsFiltrert) {
        setOrganisasjonsListe(organisasjonsResponsFiltrert);
    };
    }
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

import React from 'react';
import { Normaltekst, Innholdstittel, Undertittel } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Lenke from 'nav-frontend-lenker';
import { Organisasjon } from '../Objekter/OrganisasjonFraAltinn';
import alertikon from '../LoggInn/TilgangsStyringInfoTekst/infomation-circle-2.svg';
import nyfane from './nyfane.svg';
import {beOmTilgangIAltinnLink, linkTilMinSideArbeidsgiver} from '../lenker';
import './IngenTilgangInfo.less';
import Lenkepanel from 'nav-frontend-lenkepanel';

import {SERVICEEDITIONINNSYNAAREGISTERET, SERVICEKODEINNSYNAAREGISTERET} from "../App";

type TilgangsInfoProps = {
    bedrifterMedTilgang: Array<Organisasjon> | null;
    valgtOrganisasjon: Organisasjon;
};

const IngenTilgangInfo = ({ bedrifterMedTilgang, valgtOrganisasjon }: TilgangsInfoProps) => {
    return (
        <div className="ingen-tilgang-info-container">
            <Normaltekst className="brodsmule">
                <Lenke href={linkTilMinSideArbeidsgiver(valgtOrganisasjon.OrganizationNumber)}>
                    Min side – arbeidsgiver
                </Lenke>
                {' / arbeidsforhold /'}
            </Normaltekst>
            <div className="ingen-tilgang">
                <div className="ingen-tilgang-header">
                    <div className="ingen-tilgang-header__innhold">
                        <img
                            src={alertikon}
                            alt="ikon for å vise at det kommer informasjon om tilgangsstyring"
                            className="ingen-tilgang-header__ikon"
                        />
                        <Innholdstittel className="ingen-tilgang-header__overskrift">
                            Du mangler rettigheter i Altinn
                        </Innholdstittel>
                    </div>
                </div>

                <div className="ingen-tilgang-innhold">
                    {bedrifterMedTilgang && bedrifterMedTilgang.length > 0 && (
                        <>
                            <Normaltekst className="ingen-tilgang-innhold__ingress">
                                Du har valgt en virksomhet der du mangler rettigheter for å se arbeidsforhold. Velg en
                                virksomhet der du har tilgang.
                            </Normaltekst>
                           <Lenkepanel tittelProps={"normaltekst"} border href={beOmTilgangIAltinnLink(valgtOrganisasjon.OrganizationNumber,SERVICEKODEINNSYNAAREGISTERET,SERVICEEDITIONINNSYNAAREGISTERET)} >
                                Be om tilgang
                            </Lenkepanel>

                            <Ekspanderbartpanel
                                className="ingen-tilgang-innhold__bedrifter-med-tilgang-panel"
                                tittel="Disse virksomhetene har tilgang"
                                border
                            >
                                <ul className="ingen-tilgang-innhold__panelinnhold">
                                    {bedrifterMedTilgang.map(bedrift => (
                                        <li key={bedrift.OrganizationNumber}>
                                            {bedrift.Name + '(' + bedrift.OrganizationNumber + ')'}
                                        </li>
                                    ))}
                                </ul>
                            </Ekspanderbartpanel>
                        </>
                    )}

                    {(!bedrifterMedTilgang || bedrifterMedTilgang.length === 0) && (
                        <div className="ingen-tilgang-innhold__bedrifter-med-tilgang-panel">
                            <Normaltekst>
                                Det finnes ingen virksomheter der du har rettigheter til å se arbeidsforhold.
                            </Normaltekst>
                        </div>
                    )}

                    <Undertittel id="ingen-tilgang-innhold__panelinnhold-overskrift">
                        Denne enkelttjenesten i Altinn gir deg tilgang
                    </Undertittel>

                    <ul className="ingen-tilgang-innhold__panelinnhold" aria-labelledby="panelinnhold-overskrift">
                        <li>Innsyn i Aa-registeret for arbeidsgivere</li>
                    </ul>

                    <div className="ingen-tilgang-innhold__lenker">
                        <Undertittel
                            id="ingen-tilgang-innhold-lenker-overskrift"
                            className="ingen-tilgang-innhold__lenker-overskrift"
                        >
                            Lenker til mer informasjon
                        </Undertittel>
                        <ul aria-labelledby="ingen-tilgang-innhold-lenker-overskrift">
                            <li>
                                <Lenke href="https://arbeidsgiver.nav.no/min-side-arbeidsgiver/informasjon-om-tilgangsstyring">
                                    Disse Altinn-rettighetene trenger du for å få tilgang til innloggede tjenester fra
                                    NAV
                                </Lenke>
                            </li>
                            <li>
                                <Lenke href="https://www.altinn.no/hjelp/profil/roller-og-rettigheter/">
                                    <span>Les mer om hvordan rettigheter og roller fungerer i Altinn</span>
                                    <img
                                        className="nyfane-ikon"
                                        src={nyfane}
                                        alt="ikon for å beskrive at lenken åpnes i en ny fane"
                                    />
                                </Lenke>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IngenTilgangInfo;
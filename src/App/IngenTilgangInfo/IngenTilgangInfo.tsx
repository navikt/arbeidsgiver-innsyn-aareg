import React, { FunctionComponent, useContext } from 'react';
import { Organisasjon } from '../Objekter/OrganisasjonFraAltinn';
import alertikon from '../LoggInn/TilgangsStyringInfoTekst/infomation-circle-2.svg';
import nyfane from './nyfane.svg';
import altinlogo from './altinn-logo.svg';
import { beOmTilgangIAltinnLink } from '../lenker';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import './IngenTilgangInfo.css';
import {
    SERVICEKODEINNSYNAAREGISTERET,
    SERVICEEDITIONINNSYNAAREGISTERET,
    AltinnorganisasjonerContext,
    AltinnOrganisasjon,
} from '../Context/AltinnorganisasjonerProvider';
import { BodyShort, Heading, LinkPanel, Link as DSLink } from '@navikt/ds-react';
import { Ekspanderbartpanel } from '../GeneriskeKomponenter/Ekspanderbartpanel';

const run = <T extends any>(f: () => T) => f();

interface Props {
    underenhet?: AltinnOrganisasjon;
}

const IngenTilgangInfo: FunctionComponent<Props> = ({ underenhet }) => {
    const altinnorganisasjoner = useContext(AltinnorganisasjonerContext);

    const bedrifterMedTilgang: Organisasjon[] = altinnorganisasjoner.filter(
        (org) => org.tilgang && org.OrganizationForm === 'BEDR'
    );

    return (
        <div className="ingen-tilgang-info-container">
            <Brodsmulesti valgtOrg={underenhet?.OrganizationNumber} />
            <div className="ingen-tilgang">
                <div className="ingen-tilgang-header">
                    <div className="ingen-tilgang-header__innhold">
                        <img
                            src={alertikon}
                            alt="ikon for å vise at det kommer informasjon om tilgangsstyring"
                            className="ingen-tilgang-header__ikon"
                        />
                        <Heading size="large" className="ingen-tilgang-header__overskrift">
                            Du mangler rettigheter i Altinn
                        </Heading>
                    </div>
                </div>

                <div className="ingen-tilgang-innhold">
                    {run(() => {
                        if (altinnorganisasjoner.length === 0) {
                            return (
                                <div className="ingen-tilgang-innhold__bedrifter-med-tilgang-panel">
                                    <BodyShort>
                                        Du har ikke tilgang til noen virksomheter i Altinn.
                                    </BodyShort>
                                </div>
                            );
                        } else if (bedrifterMedTilgang.length === 0) {
                            return (
                                <div className="ingen-tilgang-innhold__bedrifter-med-tilgang-panel">
                                    <BodyShort>
                                        Det finnes ingen virksomheter der du har rettigheter til å
                                        se arbeidsforhold.
                                    </BodyShort>
                                </div>
                            );
                        } else {
                            return (
                                <>
                                    <BodyShort className="ingen-tilgang-innhold__ingress">
                                        Du har valgt en virksomhet der du mangler rettigheter for å
                                        se arbeidsforhold. Velg en virksomhet der du har tilgang.
                                    </BodyShort>
                                    <LinkPanel
                                        border
                                        href={beOmTilgangIAltinnLink(
                                            underenhet?.OrganizationNumber ?? '',
                                            SERVICEKODEINNSYNAAREGISTERET,
                                            SERVICEEDITIONINNSYNAAREGISTERET
                                        )}
                                    >
                                        <div
                                            className={'ingen-tilgang-innhold__be-om-tilgang-boks'}
                                        >
                                            <img src={altinlogo} alt={'altinnlogo'} />
                                            <div
                                                className={
                                                    'ingen-tilgang-innhold__be-om-tilgang-tekst'
                                                }
                                            >
                                                <Heading size="small">Be om tilgang</Heading>
                                                Gå til Altinn for å be om tilgang til denne
                                                tjenesten.
                                            </div>
                                        </div>
                                    </LinkPanel>
                                    <Ekspanderbartpanel
                                        className="ingen-tilgang-innhold__bedrifter-med-tilgang-panel"
                                        tittel="Disse virksomhetene har tilgang"
                                    >
                                        <ul className="ingen-tilgang-innhold__panelinnhold">
                                            {bedrifterMedTilgang.map((bedrift) => (
                                                <li key={bedrift.OrganizationNumber}>
                                                    {bedrift.Name +
                                                        ' (' +
                                                        bedrift.OrganizationNumber +
                                                        ')'}
                                                </li>
                                            ))}
                                        </ul>
                                    </Ekspanderbartpanel>
                                </>
                            );
                        }
                    })}

                    <Heading size="small" id="ingen-tilgang-innhold__panelinnhold-overskrift">
                        Denne enkelttjenesten i Altinn gir deg tilgang
                    </Heading>

                    <ul
                        className="ingen-tilgang-innhold__panelinnhold"
                        aria-labelledby="panelinnhold-overskrift"
                    >
                        <li>Innsyn i Aa-registeret for arbeidsgivere</li>
                    </ul>

                    <div className="ingen-tilgang-innhold__lenker">
                        <Heading
                            size="small"
                            id="ingen-tilgang-innhold-lenker-overskrift"
                            className="ingen-tilgang-innhold__lenker-overskrift"
                        >
                            Lenker til mer informasjon
                        </Heading>
                        <ul aria-labelledby="ingen-tilgang-innhold-lenker-overskrift">
                            <li>
                                <DSLink href="https://arbeidsgiver.nav.no/min-side-arbeidsgiver/informasjon-om-tilgangsstyring">
                                    Disse Altinn-rettighetene trenger du for å få tilgang til
                                    innloggede tjenester fra NAV
                                </DSLink>
                            </li>
                            <li>
                                <DSLink href="https://www.altinn.no/hjelp/profil/roller-og-rettigheter/">
                                    <span>
                                        Les mer om hvordan rettigheter og roller fungerer i Altinn
                                    </span>
                                    <img
                                        className="nyfane-ikon"
                                        src={nyfane}
                                        alt="ikon for å beskrive at lenken åpnes i en ny fane"
                                    />
                                </DSLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IngenTilgangInfo;

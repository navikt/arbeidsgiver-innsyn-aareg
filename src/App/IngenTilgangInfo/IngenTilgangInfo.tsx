import React, { FunctionComponent, useContext } from 'react';
import { Normaltekst, Innholdstittel, Undertittel } from 'nav-frontend-typografi';
import Lenkepanel from 'nav-frontend-lenkepanel';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Lenke from 'nav-frontend-lenker';
import { Organisasjon } from '../Objekter/OrganisasjonFraAltinn';
import alertikon from '../LoggInn/TilgangsStyringInfoTekst/infomation-circle-2.svg';
import nyfane from './nyfane.svg';
import altinlogo from './altinn-logo.svg';
import { beOmTilgangIAltinnLink } from '../lenker';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import './IngenTilgangInfo.less';
import {
    SERVICEKODEINNSYNAAREGISTERET,
    SERVICEEDITIONINNSYNAAREGISTERET,
    AltinnorganisasjonerContext,
    AltinnOrganisasjon,
} from '../AltinnorganisasjonerProvider';

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
                        <Innholdstittel className="ingen-tilgang-header__overskrift">
                            Du mangler rettigheter i Altinn
                        </Innholdstittel>
                    </div>
                </div>

                <div className="ingen-tilgang-innhold">
                    {run(() => {
                        if (altinnorganisasjoner.length === 0) {
                            return (
                                <div className="ingen-tilgang-innhold__bedrifter-med-tilgang-panel">
                                    <Normaltekst>Du har ikke tilgang til noen virksomheter i Altinn.</Normaltekst>
                                </div>
                            );
                        } else if (bedrifterMedTilgang.length === 0) {
                            return (
                                <div className="ingen-tilgang-innhold__bedrifter-med-tilgang-panel">
                                    <Normaltekst>
                                        Det finnes ingen virksomheter der du har rettigheter til å se arbeidsforhold.
                                    </Normaltekst>
                                </div>
                            );
                        } else {
                            return (
                                <>
                                    <Normaltekst className="ingen-tilgang-innhold__ingress">
                                        Du har valgt en virksomhet der du mangler rettigheter for å se arbeidsforhold.
                                        Velg en virksomhet der du har tilgang.
                                    </Normaltekst>
                                    <Lenkepanel
                                        tittelProps={'normaltekst'}
                                        border
                                        href={beOmTilgangIAltinnLink(
                                            underenhet?.OrganizationNumber ?? '',
                                            SERVICEKODEINNSYNAAREGISTERET,
                                            SERVICEEDITIONINNSYNAAREGISTERET
                                        )}
                                    >
                                        <div className={'ingen-tilgang-innhold__be-om-tilgang-boks'}>
                                            <img src={altinlogo} alt={'altinnlogo'} />
                                            <div className={'ingen-tilgang-innhold__be-om-tilgang-tekst'}>
                                                <Undertittel>Be om tilgang</Undertittel>
                                                Gå til Altinn for å be om tilgang til denne tjenesten.
                                            </div>
                                        </div>
                                    </Lenkepanel>
                                    <Ekspanderbartpanel
                                        className="ingen-tilgang-innhold__bedrifter-med-tilgang-panel"
                                        tittel="Disse virksomhetene har tilgang"
                                        border
                                    >
                                        <ul className="ingen-tilgang-innhold__panelinnhold">
                                            {bedrifterMedTilgang.map((bedrift) => (
                                                <li key={bedrift.OrganizationNumber}>
                                                    {bedrift.Name + ' (' + bedrift.OrganizationNumber + ')'}
                                                </li>
                                            ))}
                                        </ul>
                                    </Ekspanderbartpanel>
                                </>
                            );
                        }
                    })}

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

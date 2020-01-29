import React, { FunctionComponent } from 'react';
import { Normaltekst, Innholdstittel, Undertittel, Ingress } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import './IngenTilgangInfo.less';
import alertikon from '../LoggInn/TilgangsStyringInfoTekst/infomation-circle-2.svg';
import { Organisasjon } from '../Objekter/OrganisasjonFraAltinn';
import Lenke from 'nav-frontend-lenker';
import nyfane from './nyfane.svg';

export type TilgangsInfoProps = {
    bedrifterMedTilgang: Array<Organisasjon> | null;
};


const IngenTilgangInfo: FunctionComponent<TilgangsInfoProps> = props => {
    return (
        <div className={'ingen-tilgang-info-container'}>
            <div className={'ingen-tilgang-info '}>
                <div className={'ingen-tilgang-header'}>
                    <img
                        src={alertikon}
                        alt={'ikon for å vise at det kommer informasjon om tilgangsstyring'}
                        className={'informasjonsboks__ikon'}
                    />
                    <Innholdstittel>Du mangler rettigheter i Altinn</Innholdstittel>
                </div>
                <div className={'ingen-tilgang-info-hovedinnhold'}>
                {props.bedrifterMedTilgang && props.bedrifterMedTilgang.length >0 &&
                   <div>
                        <Normaltekst>
                            Du har valgt en virksomhet der du mangler rettigheter for å se arbeidsforhold. Velg en
                            virksomhet der du har tilgang.
                        </Normaltekst>

                        <Ekspanderbartpanel
                            className={'ingen-tilgang-info-hovedinnhold__bedrifter-med-tilgang-panel'}
                            tittel="Disse virksomhetene har tilgang"
                            border
                        >
                            <ul className={'ingen-tilgang-info-hovedinnhold__panelinnhold'}>
                                {props.bedrifterMedTilgang.map(bedrift => (
                                    <li>{bedrift.Name + '(' + bedrift.OrganizationNumber + ')'}</li>
                                ))}
                            </ul>
                        </Ekspanderbartpanel>
                   </div>
                }
                {(!props.bedrifterMedTilgang || props.bedrifterMedTilgang.length === 0)&& (
                    <div   className={'ingen-tilgang-info-hovedinnhold__bedrifter-med-tilgang-panel'}>
                        <Normaltekst>
                            Det finnes ingen virksomheter der du har rettigheter til å se arbeidsforhold.
                        </Normaltekst>
                    </div>
                )}
                        <Undertittel>Denne enkelttjenesten i Altinn gir deg tilgang</Undertittel>
                        <ul className={'ingen-tilgang-info-hovedinnhold__panelinnhold'}>
                            <li>Innsyn i AA-registeret</li>
                        </ul>
                        <Ingress className={'ingen-tilgang-header'}>Lenker til mer informasjon</Ingress>
                        <p>
                            <Lenke href="#">
                                <span>
                                    Disse Altinn-rettighetene trenger du for å få tilgang til innloggede tjenester fra
                                    NAV
                                </span>
                                <img
                                    className={'altinn-container__ikon'}
                                    src={nyfane}
                                    alt="ikon for å beskrive at lenken åpnes i en ny fane"
                                />
                            </Lenke>
                        </p>
                        <p>
                            <Lenke href="#">
                                <span>Les mer om hvordan rettigheter og roller fungerer i Altinn </span>
                            </Lenke>
                        </p>
                    </div>
            </div>
        </div>

    );
};

export default IngenTilgangInfo;

import React, { FunctionComponent, useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import { Organisasjon, tomaAltinnOrganisasjon } from '../../Objekter/OrganisasjonFraAltinn';
import { nullStillSorteringIUrlParametere } from '../urlFunksjoner';
import { OrganisasjonsdetaljerContext } from '../../OrganisasjonsdetaljerProvider';
import { AltinnorganisasjonerContext } from '../../AltinnorganisasjonerProvider';

interface Props extends RouteComponentProps {
    hentOgSetAntallOgArbeidsforhold: (organisasjon: Organisasjon, erTidligereArbeidsforhold: boolean) => void;
    abortTidligereRequests: () => void;
    setEndringIUrlAlert: (endret: string) => void;
}

const Banner: FunctionComponent<Props> = props => {
    const altinnorganisasjoner = useContext(AltinnorganisasjonerContext);
    const { valgtAktivOrganisasjon, setValgtAktivOrganisasjon, setTilgangTilTidligereArbeidsforhold } = useContext(
        OrganisasjonsdetaljerContext
    );

    const { history } = props;
    const naVærendeUrl = new URL(window.location.href);
    const erPåEnkeltArbeidsforhold = naVærendeUrl.href.includes('/enkeltarbeidsforhold');
    const erPåTidligereArbeidsforhold = naVærendeUrl.href.includes('/tidligere-arbeidsforhold');

    const onOrganisasjonChange = (organisasjon?: Organisasjon) => {
        const redirectTilListeVisning = () => {
            naVærendeUrl.searchParams.delete('arbeidsforhold');
            const { search } = naVærendeUrl;
            history.replace({ search: search, pathname: '/' });
        };

        const harTilgang = (orgnr: string): boolean =>
            altinnorganisasjoner.find(org => org.OrganizationNumber === orgnr)?.tilgang === true;

        if (organisasjon) {
            setValgtAktivOrganisasjon(organisasjon);
            setTilgangTilTidligereArbeidsforhold(harTilgang(organisasjon.ParentOrganizationNumber));
            props.abortTidligereRequests();

            if (organisasjon.OrganizationNumber && harTilgang(organisasjon.OrganizationNumber)) {
                props.hentOgSetAntallOgArbeidsforhold(organisasjon, false);
            }

            if (valgtAktivOrganisasjon !== tomaAltinnOrganisasjon) {
                history.replace(nullStillSorteringIUrlParametere());
                erPåEnkeltArbeidsforhold && redirectTilListeVisning();
                erPåTidligereArbeidsforhold && redirectTilListeVisning();
                props.setEndringIUrlAlert(window.location.href);
            }
        }
    };

    const sidetittel = erPåTidligereArbeidsforhold ? 'Tidligere arbeidsforhold' : 'Arbeidsforhold';
    const organisasjonerIBedriftsmenyen = erPåTidligereArbeidsforhold ? [] : altinnorganisasjoner;

    return (
        <div className="hovebanner">
            <Bedriftsmeny
                sidetittel={sidetittel}
                organisasjoner={organisasjonerIBedriftsmenyen}
                onOrganisasjonChange={onOrganisasjonChange}
                history={history}
            />
        </div>
    );
};

export default withRouter(Banner);

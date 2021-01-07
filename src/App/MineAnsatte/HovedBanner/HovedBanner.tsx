import React, { FunctionComponent, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import { Organisasjon, tomaAltinnOrganisasjon } from '../../Objekter/OrganisasjonFraAltinn';
import { nullStillSorteringIUrlParametere } from '../urlFunksjoner';
import { OrganisasjonerOgTilgangerContext } from '../../OrganisasjonerOgTilgangerProvider';

interface Props extends RouteComponentProps {
    hentOgSetAntallOgArbeidsforhold: (organisasjon: Organisasjon, erTidligereArbeidsforhold: boolean) => void;
    abortTidligereRequests: () => void;
    setEndringIUrlAlert: (endret: string) => void;
}

const Banner: FunctionComponent<Props> = props => {
    const { organisasjonerFraAltinnMedTilgang, valgtAktivOrganisasjon, setValgtAktivOrganisasjon, organisasjonerFraAltinn, setTilgangTilTidligereArbeidsforhold } = useContext(OrganisasjonerOgTilgangerContext);

    const { history } = props;
    const naVærendeUrl = new URL(window.location.href);
    const erPåEnkeltArbeidsforhold = naVærendeUrl.href.includes('/enkeltarbeidsforhold');
    const erPåTidligereArbeidsforhold = naVærendeUrl.href.includes('/tidligere-arbeidsforhold');

    const redirectTilListeVisning = () => {
        naVærendeUrl.searchParams.delete('arbeidsforhold');
        const { search } = naVærendeUrl;
        history.replace({ search: search, pathname: '/' });
    };

    const sjekkAtManBytterBedriftIkkeVedRefresh = () => {
        return valgtAktivOrganisasjon !== tomaAltinnOrganisasjon;
    };

    const harTilgang = (orgnr: string): number | undefined => {
        return organisasjonerFraAltinnMedTilgang?.filter(org => org.OrganizationNumber === orgnr).length;
    };

    const onOrganisasjonChange = (organisasjon?: Organisasjon) => {
        if (organisasjon) {
            setValgtAktivOrganisasjon(organisasjon);
            if (harTilgang(organisasjon.ParentOrganizationNumber)) {
                setTilgangTilTidligereArbeidsforhold(true);
            } else {
                setTilgangTilTidligereArbeidsforhold(false);
            }
            props.abortTidligereRequests();

            if (organisasjon.OrganizationNumber && harTilgang(organisasjon.OrganizationNumber)) {
                props.hentOgSetAntallOgArbeidsforhold(organisasjon, false);
            }

            if (sjekkAtManBytterBedriftIkkeVedRefresh()) {
                history.replace(nullStillSorteringIUrlParametere());
                erPåEnkeltArbeidsforhold && redirectTilListeVisning();
                erPåTidligereArbeidsforhold && redirectTilListeVisning();
                props.setEndringIUrlAlert(window.location.href);
            }
        }
    };

    const sidetittel = erPåTidligereArbeidsforhold ? 'Tidligere arbeidsforhold' : 'Arbeidsforhold';
    const organisasjonerIBedriftsmenyen = erPåTidligereArbeidsforhold ? [] : organisasjonerFraAltinn;

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

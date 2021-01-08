import React, { FunctionComponent, useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import { Organisasjon, tomaAltinnOrganisasjon } from '../../Objekter/OrganisasjonFraAltinn';
import { nullStillSorteringIUrlParametere } from '../urlFunksjoner';
import { OrganisasjonsdetaljerContext } from '../../OrganisasjonsdetaljerProvider';
import { AltinnorganisasjonerContext } from '../../AltinnorganisasjonerProvider';

const Banner: FunctionComponent<RouteComponentProps> = props => {
    const altinnorganisasjoner = useContext(AltinnorganisasjonerContext);
    const {
        valgtAktivOrganisasjon,
        setNåværendeUrlString,
        bedriftsvelgerBytterOrganisasjon
    } = useContext(
        OrganisasjonsdetaljerContext
    );

    const { history } = props;
    const naVærendeUrl = new URL(window.location.href);
    const erPåEnkeltArbeidsforhold = naVærendeUrl.href.includes('/enkeltarbeidsforhold');
    const erPåTidligereArbeidsforhold = naVærendeUrl.href.includes('/tidligere-arbeidsforhold');

    const sidetittel = erPåTidligereArbeidsforhold ? 'Tidligere arbeidsforhold' : 'Arbeidsforhold';
    const organisasjonerIBedriftsmenyen = erPåTidligereArbeidsforhold ? [] : altinnorganisasjoner;

    const redirectTilListeVisning = () => {
        naVærendeUrl.searchParams.delete('arbeidsforhold');
        const { search } = naVærendeUrl;
        history.replace({ search: search, pathname: '/' });
    };

    const onOrganisasjonChange = (organisasjon?: Organisasjon) => {
        if (organisasjon) {
            bedriftsvelgerBytterOrganisasjon(organisasjon)

            if (valgtAktivOrganisasjon !== tomaAltinnOrganisasjon) {
                history.replace(nullStillSorteringIUrlParametere());
                erPåEnkeltArbeidsforhold && redirectTilListeVisning();
                erPåTidligereArbeidsforhold && redirectTilListeVisning();
                setNåværendeUrlString(window.location.href);
            }
        }
    }

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

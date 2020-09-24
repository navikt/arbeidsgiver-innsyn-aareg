import React, {FunctionComponent} from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Organisasjon, tomaAltinnOrganisasjon } from '../../Objekter/OrganisasjonFraAltinn';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import './HovedBanner.less';
import {nullStillSorteringIUrlParametere} from "../urlFunksjoner";

interface Props extends RouteComponentProps {
    byttOrganisasjon: (org: Organisasjon) => void;
    organisasjoner: Organisasjon[] | undefined;
    setEndringIUrlAlert: (endret: string) => void;
    valgtAktivOrganisasjon: Organisasjon;
}

const Banner: FunctionComponent<Props> = props => {
    const { history } = props;
    const naVærendeUrl = new URL (window.location.href);
    const erPåEnkeltArbeidsforhold = naVærendeUrl.href.includes('/enkeltarbeidsforhold')
    const erPåTidligereArbeidsforhold = naVærendeUrl.href.includes('/tidligere-arbeidsforhold')

    const redirectTilListeVisning = () => {
        naVærendeUrl.searchParams.delete('arbeidsforhold');
        const { search } = naVærendeUrl;
        history.replace({ search: search, pathname: '/' });
    };

    const sjekkAtManBytterBedriftIkkeVedRefresh = () => {
        return props.valgtAktivOrganisasjon !== tomaAltinnOrganisasjon;
    };

    const onOrganisasjonChange = (organisasjon?: Organisasjon) => {
        if (organisasjon) {
            props.byttOrganisasjon(organisasjon);
            if (sjekkAtManBytterBedriftIkkeVedRefresh()) {
                history.replace(nullStillSorteringIUrlParametere());
                erPåEnkeltArbeidsforhold && redirectTilListeVisning()
                erPåTidligereArbeidsforhold && redirectTilListeVisning();
                props.setEndringIUrlAlert(window.location.href);
            }
        }
    };

    const sidetittel = erPåTidligereArbeidsforhold? 'Tidligere arbeidsforhold' : 'Arbeidsforhold';
    const organisasjonerIBedriftsmenyen = erPåTidligereArbeidsforhold? [] : props.organisasjoner;

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
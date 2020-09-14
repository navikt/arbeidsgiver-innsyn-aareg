import React, {FunctionComponent} from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Organisasjon, tomaAltinnOrganisasjon } from '../../Objekter/OrganisasjonFraAltinn';
import { basename } from '../../paths';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import './HovedBanner.less';
import {nullStillSorteringIUrlParametere} from "../urlFunksjoner";

interface Props extends RouteComponentProps {
    byttOrganisasjon: (org: Organisasjon) => void;
    organisasjoner: Organisasjon[];
    setEndringIUrlAlert: (endret: string) => void;
    valgtAktivOrganisasjon: Organisasjon;
}

const Banner: FunctionComponent<Props> = props => {
    const { history } = props;

    const redirectHvisbrukerErPaaEnkeltArbeidsforholdSide = (organisasjon: Organisasjon) => {
        const url = window.location.href;
        if (url.indexOf('/enkeltarbeidsforhold') >= 0) {
            redirectTilListeVisning(organisasjon);
        }
    };

    const brukerErPaTidligereArbeidsforhold = window.location.href.includes('tidligere-arbeidsforhold');

    const redirectTilListeVisning = (organisasjon: Organisasjon) => {
        window.location.href = basename + '/?bedrift=' + organisasjon.OrganizationNumber;
    };

    const sjekkAtManBytterBedriftIkkeVedRefresh = () => {
        return props.valgtAktivOrganisasjon !== tomaAltinnOrganisasjon;
    };

    const onOrganisasjonChange = (organisasjon?: Organisasjon) => {
        if (organisasjon) {
            props.byttOrganisasjon(organisasjon);
            if (sjekkAtManBytterBedriftIkkeVedRefresh()) {
                history.replace(nullStillSorteringIUrlParametere());
                redirectHvisbrukerErPaaEnkeltArbeidsforholdSide(organisasjon);
                brukerErPaTidligereArbeidsforhold && redirectTilListeVisning(organisasjon);
                props.setEndringIUrlAlert(window.location.href);
            }
        }
    };

    const organisasjoner = brukerErPaTidligereArbeidsforhold? [] : props.organisasjoner;
    const overskrift = brukerErPaTidligereArbeidsforhold? 'Tidligere arbeidsforhold' : 'Arbeidsforhold';

    return (
        <div className="hovebanner">
             <Bedriftsmeny
                    sidetittel={overskrift}
                    organisasjoner={organisasjoner}
                    onOrganisasjonChange={onOrganisasjonChange}
                    history={history}
                />
        </div>
    );
};

export default withRouter(Banner);
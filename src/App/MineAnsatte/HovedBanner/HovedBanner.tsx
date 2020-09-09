import React, { FunctionComponent } from 'react';
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
    valgtOrganisasjon: Organisasjon;
    setEndringIUrlAlert: (endret: string) => void;
    erPaTidligereArbeidsforhold: boolean
}

const Banner: FunctionComponent<Props> = props => {
    const { history } = props;

    const sjekkOmBrukerErPaaEnkeltArbeidsforholdSide = (organisasjon: Organisasjon) => {
        const url = window.location.href;
        if (url.indexOf('/enkeltArbeidsforhold') >= 0) {
            redirectTilListeVisning(organisasjon);
        }
    };

    const brukerErPaTidligereArbeidsforhold = window.location.href.includes('tidligere-arbeidsforhold');

    const redirectTilListeVisning = (organisasjon: Organisasjon) => {
        window.location.href = basename + '/?bedrift=' + organisasjon.OrganizationNumber;
    };


    const sjekkAtManBytterBedriftIkkeVedRefresh = () => {
        return props.valgtOrganisasjon !== tomaAltinnOrganisasjon;
    };

    const onOrganisasjonChange = (organisasjon?: Organisasjon) => {
        if (organisasjon) {
            props.byttOrganisasjon(organisasjon);
            if (sjekkAtManBytterBedriftIkkeVedRefresh()) {
                history.replace(nullStillSorteringIUrlParametere());
                sjekkOmBrukerErPaaEnkeltArbeidsforholdSide(organisasjon);
                props.setEndringIUrlAlert(window.location.href);
            }
            const currentUrl = new URL(window.location.href);
            const { search } = currentUrl;
            history.replace({ search: search, pathname: '/' });
        }
    };

    const overskrift = brukerErPaTidligereArbeidsforhold? 'Tidligere arbeidsforhold' : 'Arbeidsforhold';

    return (
        <div className="hovebanner">
             <Bedriftsmeny
                    sidetittel={overskrift}
                    organisasjoner={props.organisasjoner}
                    onOrganisasjonChange={onOrganisasjonChange}
                    history={history}
                />
            }
        </div>
    );
};

export default withRouter(Banner);

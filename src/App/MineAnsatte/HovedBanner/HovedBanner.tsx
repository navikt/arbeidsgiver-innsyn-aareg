import React, { FunctionComponent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import './HovedBanner.less';
import { Organisasjon } from '../../Objekter/OrganisasjonFraAltinn';
import { JuridiskEnhetMedUnderEnheterArray } from '../../Objekter/JuridiskEnhetMedUnderenhetArray';
import { basename } from '../../paths';

interface Props extends RouteComponentProps {
    byttOrganisasjon: (org: Organisasjon) => void;
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[];
}
const Banner: FunctionComponent<Props> = props => {
    const { history } = props;

    const sjekkOmBrukerErPaaEnkeltArbeidsforholdSide = (organisasjon: Organisasjon) => {
        const url = window.location.href;
        if (url.indexOf('/enkeltarbeidsforhold') >= 0) {
            redirectTilListeVisning(organisasjon);
        }
    };
    const redirectTilListeVisning = (organisasjon: Organisasjon) => {
        window.location.href = basename + '/?bedrift=' + organisasjon.OrganizationNumber;
    };

    const onOrganisasjonChange = (organisasjon?: Organisasjon) => {
        if (organisasjon) {
            sjekkOmBrukerErPaaEnkeltArbeidsforholdSide(organisasjon);
            props.byttOrganisasjon(organisasjon);
        }
    };

    return (
        <div className={'hovebanner'}>
            <Bedriftsmeny
                sidetittel="Arbeidsforhold"
                organisasjonstre={props.organisasjonstre}
                onOrganisasjonChange={onOrganisasjonChange}
                history={history}
            />
        </div>
    );
};

export default withRouter(Banner);

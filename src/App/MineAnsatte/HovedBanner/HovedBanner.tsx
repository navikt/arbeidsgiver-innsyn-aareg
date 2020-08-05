import React, {FunctionComponent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Organisasjon } from '../../Objekter/OrganisasjonFraAltinn';
import { basename } from '../../paths';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import './HovedBanner.less';

interface Props extends RouteComponentProps {
    byttOrganisasjon: (org: Organisasjon) => void;
    organisasjoner: Organisasjon[];
    url: string;
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

    const nullStillUrl = () => {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("side", "1");
        currentUrl.searchParams.set("filter", "Alle");
        currentUrl.searchParams.set("varsler", "false");
        currentUrl.searchParams.set("sok", "");
        currentUrl.searchParams.set("sorter", "0");
        currentUrl.searchParams.set("revers", "false");
        const { search } = currentUrl;
        history.replace(search);
    }
    const currentUrl = new URL(props.url);
    const onOrganisasjonChange = (organisasjon?: Organisasjon) => {
        if (organisasjon) {
            props.byttOrganisasjon(organisasjon);
            if (organisasjon.OrganizationNumber !== currentUrl.searchParams.get("bedrift")) {
                nullStillUrl()
                window.location.reload();
            }
            sjekkOmBrukerErPaaEnkeltArbeidsforholdSide(organisasjon);
        }
    };

    return (
        <div className="hovebanner">
            <Bedriftsmeny
                sidetittel="Arbeidsforhold"
                organisasjoner={props.organisasjoner.sort((a, b) => a.Name.localeCompare(b.Name))}
                onOrganisasjonChange={onOrganisasjonChange}
                history={history}
            />
        </div>
    );
};

export default withRouter(Banner);
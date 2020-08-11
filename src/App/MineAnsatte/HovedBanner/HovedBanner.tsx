import React, {FunctionComponent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import {Organisasjon, tomaAltinnOrganisasjon} from '../../Objekter/OrganisasjonFraAltinn';
import { basename } from '../../paths';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import './HovedBanner.less';

interface Props extends RouteComponentProps {
    byttOrganisasjon: (org: Organisasjon) => void;
    organisasjoner: Organisasjon[];
    url: string;
    valgtOrganisasjon: Organisasjon;
    setEndringAlert: (endret: string) => void
    endringAlert: string;
}

const Banner: FunctionComponent<Props> = props => {
    const { history } = props;


    const sjekkOmBrukerErPaaEnkeltArbeidsforholdSide = (organisasjon: Organisasjon) => {
        const url = window.location.href;
        if (url.indexOf('/enkeltArbeidsforhold') >= 0) {
            redirectTilListeVisning(organisasjon);
        }
    };

    const redirectTilListeVisning = (organisasjon: Organisasjon) => {
        window.location.href = basename + '/?bedrift=' + organisasjon.OrganizationNumber;
    };

    const nullStillUrlParametere = () => {
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

    const sjekkAtManBytterBedriftIkkeVedRefresh = () => {
        return (props.valgtOrganisasjon!== tomaAltinnOrganisasjon);
    }

    const onOrganisasjonChange = (organisasjon?: Organisasjon) => {
        if (organisasjon) {
            props.byttOrganisasjon(organisasjon);
            if (sjekkAtManBytterBedriftIkkeVedRefresh()) {
                nullStillUrlParametere();
                sjekkOmBrukerErPaaEnkeltArbeidsforholdSide(organisasjon);
                props.setEndringAlert(window.location.href);
            }
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
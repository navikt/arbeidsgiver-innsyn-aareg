import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { onBreadcrumbClick, setBreadcrumbs } from '@navikt/nav-dekoratoren-moduler';
import { linkTilMinSideArbeidsgiver } from '../lenker';
import { nullStillSorteringIUrlParametere } from '../MineAnsatte/urlFunksjoner';
import { Organisasjon, tomaAltinnOrganisasjon } from '../Objekter/OrganisasjonFraAltinn';

interface Brodsmule {
    url: string;
    title: string;
    handleInApp: boolean;
}

interface BrodsmuleProps {
    erPaaArbeidsforhold?: boolean;
    erPaaEnkeltArbeidsforhold?: boolean;
    setVisProgressbar?: (bool: boolean) => void;
    hentOgSetAntallOgArbeidsforhold?: (organisasjon: Organisasjon, erTidligereArbeidsforhold: boolean) => void;
    valgtOrg?: Organisasjon;
    brodsmuler: Brodsmule[];
}

const Brodsmulesti = ({
    erPaaArbeidsforhold,
    erPaaEnkeltArbeidsforhold,
    setVisProgressbar,
    hentOgSetAntallOgArbeidsforhold,
    valgtOrg,
    brodsmuler
}: BrodsmuleProps) => {
    const history = useHistory();
    const orgnrDel = valgtOrg?.OrganizationNumber ? `?bedrift=${valgtOrg.OrganizationNumber}` : '';

    onBreadcrumbClick(breadcrumb => {
        if (erPaaArbeidsforhold) {
            if (hentOgSetAntallOgArbeidsforhold)
                hentOgSetAntallOgArbeidsforhold(valgtOrg ?? tomaAltinnOrganisasjon, false);
            const search = nullStillSorteringIUrlParametere();
            history.replace({ search: search, pathname: breadcrumb.url });
        }

        else if (erPaaEnkeltArbeidsforhold) {
            const naVærendeUrl = new URL(window.location.href);
            naVærendeUrl.searchParams.delete('arbeidsforhold');
            const { search } = naVærendeUrl;
            setVisProgressbar && setVisProgressbar(false);
            history.replace({ search: search, pathname: breadcrumb.url });
        }
        else history.push(breadcrumb.url + orgnrDel);
    });

    let defaultBrodsmule = [
        {
            url: linkTilMinSideArbeidsgiver(valgtOrg?.OrganizationNumber || ''),
            title: 'Min side – arbeidsgiver',
            handleInApp: false
        },
        { url: '/', title: 'Arbeidsforhold', handleInApp: true }
    ];

    console.log('defaultBrodsmule', defaultBrodsmule);
    const breadcrumbs = defaultBrodsmule.concat(brodsmuler);
    console.log('breadcrumbs', breadcrumbs);
    setBreadcrumbs(breadcrumbs);

    return <></>;
};

export default Brodsmulesti;

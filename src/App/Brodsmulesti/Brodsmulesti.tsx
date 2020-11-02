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

const Brodsmulesti = ({ erPaaArbeidsforhold, erPaaEnkeltArbeidsforhold, setVisProgressbar, hentOgSetAntallOgArbeidsforhold, valgtOrg, brodsmuler }: BrodsmuleProps) => {
    const history = useHistory();
    const naVærendeUrl = new URL(window.location.href);
    const ERPATIDLIGEREARBEIDSFORHOLD = naVærendeUrl.toString().includes('tidligere-arbeidsforhold');

    onBreadcrumbClick(breadcrumb => {
        if (erPaaArbeidsforhold) {
            if (hentOgSetAntallOgArbeidsforhold) hentOgSetAntallOgArbeidsforhold(valgtOrg ?? tomaAltinnOrganisasjon, false);
            const search = nullStillSorteringIUrlParametere();
            history.replace({ search: search, pathname: breadcrumb.url });
        }

        if (erPaaEnkeltArbeidsforhold) {
            const naVærendeUrl = new URL(window.location.href);
            naVærendeUrl.searchParams.delete('arbeidsforhold');
            const { search } = naVærendeUrl;
            setVisProgressbar && setVisProgressbar(false);
            history.replace({ search: search, pathname: breadcrumb.url });
        }
            history.push(breadcrumb.url);
    });

    let defaultBrodsmule = [
        { url: linkTilMinSideArbeidsgiver(valgtOrg?.OrganizationNumber || ''), title: 'Min side – arbeidsgiver', handleInApp: false },
        { url: '/', title: 'Arbeidsforhold', handleInApp: true },
    ];

    if (ERPATIDLIGEREARBEIDSFORHOLD) defaultBrodsmule.concat([{ url: '/tidligere-arbeidsforhold', title: 'Tidligere arbeidsforhold', handleInApp: true }]);

    const breadcrumbs = defaultBrodsmule.concat(brodsmuler);

    setBreadcrumbs(breadcrumbs);

    return <></>;
};

export default Brodsmulesti;

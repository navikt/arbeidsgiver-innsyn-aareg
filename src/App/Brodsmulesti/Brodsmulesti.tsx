import React from 'react';
import { useHistory } from 'react-router-dom';
import { onBreadcrumbClick, setBreadcrumbs } from '@navikt/nav-dekoratoren-moduler';
import { linkTilArbeidsforhold, linkTilMinSideArbeidsgiver } from '../lenker';

interface Brodsmule {
    url: string;
    title: string;
    handleInApp: boolean;
}

interface BrodsmuleProps {
    valgtOrg?: string;
}

const Brodsmulesti = ({ valgtOrg }: BrodsmuleProps) => {
    const history = useHistory();

    onBreadcrumbClick(breadcrumb => {
        history.push(breadcrumb.url);
    });

    const brodsmuler: Brodsmule[] = [
        {
            url: linkTilMinSideArbeidsgiver(valgtOrg || ''),
            title: 'Min side – arbeidsgiver',
            handleInApp: false
        },
        { url: linkTilArbeidsforhold(valgtOrg || ''), title: 'Arbeidsforhold', handleInApp: true }
    ];

    setBreadcrumbs(brodsmuler);

    return <></>;
};

export default Brodsmulesti;

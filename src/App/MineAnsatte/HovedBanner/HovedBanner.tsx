import React, {FunctionComponent, useEffect, useState} from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import './HovedBanner.less';
import {Organisasjon} from "../../Objekter/OrganisasjonFraAltinn";
import {JuridiskEnhetMedUnderEnheterArray} from "../../Objekter/JuridiskEnhetMedUnderenhetArray";
import {byggOrganisasjonstre} from "./byggOrganisasjonsTre";
import {hentOrganisasjonerFraAltinn} from "../../../api/altinnApi";

interface Props extends RouteComponentProps{
    byttOrganisasjon: (org: Organisasjon) => void;
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[];
};
const Banner: FunctionComponent<Props> = props => {
    const { history } = props;

    const onOrganisasjonChange = (organisasjon?: Organisasjon) => {
        if (organisasjon) {
            props.byttOrganisasjon(organisasjon);
        }
    };

    return (
        <Bedriftsmeny
            sidetittel="Oversikt over bedrift og ansatte"
            organisasjonstre={props.organisasjonstre}
            onOrganisasjonChange={onOrganisasjonChange}
            history={history}
        />
    );
};

export default withRouter(Banner);
import React from 'react';
import { Sortering } from '../../../sorteringOgFiltreringsFunksjoner';
import { Table } from '@navikt/ds-react';

interface Props {
    label: string;
    attributt: Sortering;
}

const Kolonne = (props: Props) => {
    return (
        <Table.ColumnHeader role="columnheader" sortable sortKey={props.attributt}>
            {props.label}
        </Table.ColumnHeader>
    );
};

export default Kolonne;

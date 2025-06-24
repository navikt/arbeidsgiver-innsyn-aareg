import React from 'react';
import Kolonne from './Kolonne/Kolonne';
import { Sortering } from '../../sorteringOgFiltreringsFunksjoner';
import { Table } from '@navikt/ds-react';

const kolonner: [label: string, attributt: Sortering][] = [
    ['Navn', 'NAVN'],
    ['Fødselsnummer', 'FNR'],
    ['Startdato', 'STARTDATO'],
    ['Sluttdato', 'SLUTTDATO'],
    ['Stillingsprosent', 'STILLINGSPROSENT'],
    ['Yrke', 'YRKE'],
    ['Varsling', 'VARSEL'],
];

const KolonnerFullSkjerm = () => {
    return (
        <Table.Header>
            <Table.Row>
                {kolonner.map(([label, attributt]) => (
                    <Kolonne key={attributt} label={label} attributt={attributt} />
                ))}
            </Table.Row>
        </Table.Header>
    );
};

export default KolonnerFullSkjerm;

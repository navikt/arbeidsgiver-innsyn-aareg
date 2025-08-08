import React, { FunctionComponent, useContext, useState } from 'react';
import { Table, SortState } from '@navikt/ds-react';

import KolonnerFullSkjerm from './Kolonner/Kolonner';
import YrkesbeskrivelsePopover from './KolonnerMedTooltip/YrkesbeskrivelsePopover';
import NavnPopover from './KolonnerMedTooltip/NavnPopover';
import VarslingPopover from './KolonnerMedTooltip/VarslingPopover';

import { datoformat } from '../utils';
import { FiltrerteOgSorterteArbeidsforholdContext } from '../../Context/FiltrerteOgSorterteArbeidsforholdProvider';
import { sorterArbeidsforhold, Sortering } from '../sorteringOgFiltreringsFunksjoner';

type ScopedSortState = SortState & { orderBy: Sortering };

const TabellMineAnsatte: FunctionComponent = () => {
    const { currentSelection, count } = useContext(FiltrerteOgSorterteArbeidsforholdContext);
    const [sortState, setSortState] = useState<ScopedSortState>();

    if (count.Alle === 0 || currentSelection.length === 0) return null;

    const handleSort = (orderBy: Sortering) => {
        setSortState((prev) =>
            prev?.orderBy === orderBy
                ? { orderBy, direction: prev.direction === 'ascending' ? 'descending' : 'ascending' }
                : { orderBy, direction: 'ascending' }
        );
    };

    const sorted = sortState
        ? sorterArbeidsforhold(currentSelection, sortState.orderBy, sortState.direction)
        : currentSelection;

    return (
        <Table
            className="mine-ansatte__table"
            style={{ marginBottom: '1rem' }}
            zebraStripes
            sort={sortState}
            onSortChange={(key) => handleSort(key as Sortering)}
        >
            <KolonnerFullSkjerm />
            <Table.Body>
                {sorted.map((af) => (
                    <Table.Row key={af.navArbeidsforholdId}>
                        <Table.HeaderCell scope="row">
                            <NavnPopover arbeidsforhold={af} />
                        </Table.HeaderCell>
                        <Table.DataCell>{af.arbeidstaker.offentligIdent}</Table.DataCell>
                        <Table.DataCell>{datoformat(af.ansattFom)}</Table.DataCell>
                        <Table.DataCell>{datoformat(af.ansattTom)}</Table.DataCell>
                        <Table.DataCell>{`${af.stillingsprosent} %`}</Table.DataCell>
                        <Table.DataCell>
                            <YrkesbeskrivelsePopover tekst={af.yrkesbeskrivelse} />
                        </Table.DataCell>
                        <Table.DataCell>
                            {af.varsler && <VarslingPopover varsler={af.varsler} />}
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export default TabellMineAnsatte;
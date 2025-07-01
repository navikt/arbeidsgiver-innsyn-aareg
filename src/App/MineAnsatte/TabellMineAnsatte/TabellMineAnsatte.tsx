import React, { FunctionComponent, useContext, useState } from 'react';

import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';
import KolonnerFullSkjerm from './Kolonner/Kolonner';
import YrkesbeskrivelsePopover from './KolonnerMedTooltip/YrkesbeskrivelsePopover';
import NavnPopover from './KolonnerMedTooltip/NavnPopover';
import VarslingPopover from './KolonnerMedTooltip/VarslingPopover';
// import './TabellMineAnsatte.css';
import { datoformat } from '../utils';
import { FiltrerteOgSorterteArbeidsforholdContext } from '../../Context/FiltrerteOgSorterteArbeidsforholdProvider';
import { SortState, Table } from '@navikt/ds-react';
import { sorterArbeidsforhold, Sortering } from '../sorteringOgFiltreringsFunksjoner';

type ScopedSortState = SortState & { orderBy: Sortering };

const TabellMineAnsatte: FunctionComponent = () => {
    const { currentSelection, count } = useContext(FiltrerteOgSorterteArbeidsforholdContext);
    if (count.Alle) return null

    const [sortState, setSortState] = useState<ScopedSortState | undefined>();

    const handleSort = (sortKey: Sortering) => {
        setSortState((prev) =>
            prev && prev.orderBy === sortKey && prev.direction === 'descending'
                ? undefined
                : {
                      orderBy: sortKey,
                      direction:
                          prev && prev.orderBy === sortKey && prev.direction === 'ascending'
                              ? 'descending'
                              : 'ascending',
                  }
        );
    };

    const sorted = sortState
        ? sorterArbeidsforhold(currentSelection, sortState.orderBy, sortState.direction)
        : currentSelection;

    return (
        <Table
            className='mine-ansatte__table'
            onSortChange={(sortKey) => handleSort(sortKey as Sortering)}
            sort={sortState}
            style={{ marginBottom: "1rem" }}
            zebraStripes
        >
            <KolonnerFullSkjerm />
            <Table.Body>
                {sorted.map((arbeidsforhold) => (
                    <Table.Row key={arbeidsforhold.navArbeidsforholdId}>
                        <Table.HeaderCell scope="row">
                            <NavnPopover arbeidsforhold={arbeidsforhold} />
                        </Table.HeaderCell>
                        <Table.DataCell>
                            {arbeidsforhold.arbeidstaker.offentligIdent}
                        </Table.DataCell>
                        <Table.DataCell>{datoformat(arbeidsforhold.ansattFom)}</Table.DataCell>
                        <Table.DataCell>{datoformat(arbeidsforhold.ansattTom)}</Table.DataCell>
                        <Table.DataCell>{arbeidsforhold.stillingsprosent + ' %'}</Table.DataCell>
                        <Table.DataCell>
                            <YrkesbeskrivelsePopover tekst={arbeidsforhold.yrkesbeskrivelse} />
                        </Table.DataCell>
                        <Table.DataCell>
                            {arbeidsforhold.varsler && (
                                <VarslingPopover varsler={arbeidsforhold.varsler} />
                            )}
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export default TabellMineAnsatte;

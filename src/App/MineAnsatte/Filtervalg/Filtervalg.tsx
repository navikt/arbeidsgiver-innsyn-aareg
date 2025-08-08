import React, { FunctionComponent, useContext } from 'react';
import './Filtervalg.css';
import { Switch, ToggleGroup } from '@navikt/ds-react';
import { FiltrerteOgSorterteArbeidsforholdContext } from '../../Context/FiltrerteOgSorterteArbeidsforholdProvider';
import { StatusFilter, StatusFilterValues } from '../sorteringOgFiltreringsFunksjoner';

const Filtervalg: FunctionComponent = () => {
    const { count, searchParams, setSearchParams } = useContext(
        FiltrerteOgSorterteArbeidsforholdContext
    );

    return (
        <div className={'togglecontainer'}>
            <ToggleGroup
                defaultValue="Alle"
                value={searchParams.filter}
                onChange={(filter: string) => {
                    setSearchParams({ filter: filter as StatusFilter, side: '1' });
                }}
            >
                {StatusFilterValues.map((filter: StatusFilter) => (
                    <ToggleGroup.Item
                        key={filter}
                        value={filter}
                        label={`${filter} (${count[filter]})`}
                    />
                ))}
            </ToggleGroup>
            <div className="varselKnapp">
                <Switch
                    checked={searchParams.varsler}
                    onChange={(e) =>
                        setSearchParams({
                            varsler: e.target.checked,
                            side: '1',
                        })
                    }
                >
                    Varslinger ({count.MedVarsler})
                </Switch>
            </div>
        </div>
    );
};

export default Filtervalg;

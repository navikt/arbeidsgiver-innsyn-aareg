import React, { FunctionComponent, useContext } from 'react';
import Ansatt from './Ansatt/Ansatt';
import './ListeMineAnsatteForMobil.css';
import { FiltrerteOgSorterteArbeidsforholdContext } from '../../Context/FiltrerteOgSorterteArbeidsforholdProvider';

interface Props {
    className?: string;
}

const ListeMedAnsatteForMobil: FunctionComponent<Props> = (props) => {
    const { currentSelection } = useContext(FiltrerteOgSorterteArbeidsforholdContext);

    return (
        <ul className={props.className}>
            {currentSelection.map((forhold) => (
                <Ansatt key={forhold.navArbeidsforholdId} arbeidsforhold={forhold} />
            ))}
        </ul>
    );
};

export default ListeMedAnsatteForMobil;

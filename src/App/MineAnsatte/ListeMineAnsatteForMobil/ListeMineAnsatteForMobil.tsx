import React, { FunctionComponent } from 'react';
import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';
import Ansatt from './Ansatt/Ansatt';
import './ListeMineAnsatteForMobil.less';

interface Props {
    listeMedArbeidsForhold: Arbeidsforhold[],
    className?: string;
}

const ListeMedAnsatteForMobil: FunctionComponent<Props> = (props) => {
    const rader = props.listeMedArbeidsForhold.map(forhold => (
        <Ansatt
            key={forhold.navArbeidsforholdId}
            arbeidsforhold={forhold}
        />
    ));

    return <ul className={props.className}>{rader}</ul>;
};

export default ListeMedAnsatteForMobil;
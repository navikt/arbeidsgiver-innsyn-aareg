import React, { FunctionComponent } from 'react';
import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';
import Ansatt from './Ansatt/Ansatt';
import './ListeMineAnsatteForMobil.less';

interface Props {
    className?: string;
    listeMedArbeidsForhold: Arbeidsforhold[];
    setValgtArbeidsforhold: (arbeidsforhold: Arbeidsforhold) => void;
    valgtBedrift: string;
}

const ListeMedAnsatteForMobil: FunctionComponent<Props> = (props: Props) => {
    const rader = props.listeMedArbeidsForhold.map(forhold => (
        <Ansatt
            key={forhold.navArbeidsforholdId}
            setValgtArbeidsforhold={props.setValgtArbeidsforhold}
            valgtBedrift={props.valgtBedrift}
            arbeidsforhold={forhold}
        />
    ));

    return <ul className={props.className}>{rader}</ul>;
};

export default ListeMedAnsatteForMobil;

import React, { FunctionComponent } from 'react';
import './ListeMineAnsatteForMobil.less';
import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';
import { Arbeidstaker } from '../../Objekter/Arbeidstaker';
import Ansatt from './Ansatt/Ansatt';

interface Props {
    className?: string;
    listeMedArbeidsForhold: Arbeidsforhold[];
    settValgtArbeidsgiver: (valgtArbeidstaker: Arbeidstaker) => void;
    valgtBedrift: string;
}

const ListeMedAnsatteForMobil: FunctionComponent<Props> = (props: Props) => {
    const rader = props.listeMedArbeidsForhold.map(forhold => (
        <Ansatt
            key={forhold.navArbeidsforholdId}
            settValgtArbeidsgiver={props.settValgtArbeidsgiver}
            valgtBedrift={props.valgtBedrift}
            arbeidsforhold={forhold}
        />
    ));

    return <ul className={props.className}>{rader}</ul>;
};

export default ListeMedAnsatteForMobil;

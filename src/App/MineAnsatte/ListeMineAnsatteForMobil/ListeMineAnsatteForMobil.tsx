import React, { FunctionComponent } from 'react';
import './ListeMineAnsatteForMobil.less';

import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';
import Ansatt from './Ansatt/Ansatt';
import { Arbeidstaker } from '../../Objekter/Arbeidstaker';

interface Props {
    className?: string;
    listeMedArbeidsForhold: Arbeidsforhold[];
    settValgtArbeidsgiver: (valgtArbeidstaker: Arbeidstaker) => void;
    valgtBedrift: string;
}

const ListeMedAnsatteForMobil: FunctionComponent<Props> = (props:Props) => {
    const rader = props.listeMedArbeidsForhold.map(forhold => (
        <Ansatt
            navn={forhold.arbeidstaker.navn}
            fom={forhold.ansattFom}
            tom={forhold.ansattTom? forhold.ansattTom : ""}
            offentligID={forhold.arbeidstaker.offentligIdent}
            yrke={forhold.yrke}
            key={forhold.navArbeidsforholdId}
            settValgtArbeidsgiver={props.settValgtArbeidsgiver}
            valgtBedrift={props.valgtBedrift}
            arbeidsforhold={forhold}
        />
    ));
    return <ul className={props.className}> {rader} </ul>;
};

export default ListeMedAnsatteForMobil;

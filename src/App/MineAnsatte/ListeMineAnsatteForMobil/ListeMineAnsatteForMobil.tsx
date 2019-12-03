import React, { FunctionComponent } from 'react';
import './ListeMineAnsatteForMobil.less';


import {Arbeidsforhold} from "../../Objekter/ArbeidsForhold";
import Ansatt from "./Ansatt/Ansatt";



interface Props {
    className?: string;
    listeMedArbeidsForhold: Arbeidsforhold[];
}

const ListeMedAnsatteForMobil: FunctionComponent<Props> = props => {
    const rader = props.listeMedArbeidsForhold.map(forhold => (
        <Ansatt
            navn={forhold.navn}
            fom={forhold.ansattFom}
            tom={forhold.ansattTom}
            offentligID={forhold.arbeidstaker.offentligIdent}
            yrke={forhold.yrke}
            key = {forhold.navArbeidsforholdId}
        />
    ));

    return <ul className={props.className}> {rader} </ul>;
};

export default ListeMedAnsatteForMobil;

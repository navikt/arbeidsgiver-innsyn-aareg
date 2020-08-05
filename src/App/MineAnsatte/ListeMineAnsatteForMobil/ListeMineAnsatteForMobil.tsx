import React, { FunctionComponent } from 'react';
import { Arbeidsforhold } from '../../Objekter/ArbeidsForhold';
import Ansatt from './Ansatt/Ansatt';
import './ListeMineAnsatteForMobil.less';

interface Props {
    className?: string;
    listeMedArbeidsForhold: Arbeidsforhold[];
    fullListe: Arbeidsforhold[];
    nesteArbeidsforhold?: Arbeidsforhold;
    setValgtOgEtterFolgendeArbeidsforhold: (arbeidsforhold: Arbeidsforhold, nesteArbeidsforhold?: Arbeidsforhold) => void;
    valgtBedrift: string;
}

const ListeMedAnsatteForMobil: FunctionComponent<Props> = (props: Props) => {
    const rader = props.listeMedArbeidsForhold.map(forhold => (
        <Ansatt
            key={forhold.navArbeidsforholdId}
            setValgtOgEtterFolgendeArbeidsforhold={props.setValgtOgEtterFolgendeArbeidsforhold}
            valgtBedrift={props.valgtBedrift}
            arbeidsforhold={forhold}
        />
    ));

    return <ul className={props.className}>{rader}</ul>;
};

export default ListeMedAnsatteForMobil;

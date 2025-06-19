import React, { FunctionComponent } from 'react';
import { Arbeidsforhold } from '../../../Objekter/ArbeidsForhold';
import './EnkeltArbeidsforholdVarselVisning.css';
import { Alert } from '@navikt/ds-react';

interface Props {
    valgtArbeidsforhold: Arbeidsforhold | null;
}

const EnkeltArbeidsforholdVarselVisning: FunctionComponent<Props> = (props: Props) => {
    if (props.valgtArbeidsforhold?.varsler) {
        return (
            <div className="enkelt-arbeidsforhold-varsel-container">
                <Alert variant="warning">
                    <ul className={'enkelt-arbeidsforhold-varsel-liste'}>
                        {props.valgtArbeidsforhold.varsler.map((varsel, i) => (
                            <li key={i} style={{ padding: '0 0 1rem 0' }}>
                                {varsel.varslingskodeForklaring}
                            </li>
                        ))}
                    </ul>
                </Alert>
            </div>
        );
    } else return null;
};

export default EnkeltArbeidsforholdVarselVisning;

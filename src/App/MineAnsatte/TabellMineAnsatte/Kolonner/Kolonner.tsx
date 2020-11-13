import React from 'react';
import Kolonne from './Kolonne/Kolonne';
import { SorteringsAttributt } from '../../MineAnsatte';

interface Props {
    setParameterIUrl: (parameter: string, variabel: string) => void;
}

const KolonnerFullSkjerm = (props: Props) => {
    return (
        <thead>
            <tr>
                <Kolonne
                    setParameterIUrl={props.setParameterIUrl}
                    label="Navn"
                    attributt={SorteringsAttributt.NAVN}
                />
                <Kolonne
                    setParameterIUrl={props.setParameterIUrl}
                    label="Fødselsnummer"
                    attributt={SorteringsAttributt.FNR}
                />
                <Kolonne
                    setParameterIUrl={props.setParameterIUrl}
                    label="Startdato"
                    attributt={SorteringsAttributt.STARTDATO}
                />
                <Kolonne
                    setParameterIUrl={props.setParameterIUrl}
                    label="Sluttdato"
                    attributt={SorteringsAttributt.SLUTTDATO}

                />
                <Kolonne
                    setParameterIUrl={props.setParameterIUrl}
                    label="Stillingsprosent"
                    attributt={SorteringsAttributt.STILLINGSPROSENT}
                />
                <Kolonne
                    setParameterIUrl={props.setParameterIUrl}
                    label="Yrke"
                    attributt={SorteringsAttributt.YRKE}
                />
                <Kolonne
                    setParameterIUrl={props.setParameterIUrl}
                    label="Varsling"
                    attributt={SorteringsAttributt.VARSEL}
                />
            </tr>
        </thead>
    );
};

export default KolonnerFullSkjerm;

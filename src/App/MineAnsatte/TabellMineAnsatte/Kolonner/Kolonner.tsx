import React from 'react';
import Kolonne from './Kolonne/Kolonne';
import { SorteringsAttributt } from '../../MineAnsatte';

const KolonnerFullSkjerm = () => {
    return (
        <thead>
            <tr>
                <Kolonne
                    label="Navn"
                    attributt={SorteringsAttributt.NAVN}
                />
                <Kolonne
                    label="Fødselsnummer"
                    attributt={SorteringsAttributt.FNR}
                />
                <Kolonne
                    label="Startdato"
                    attributt={SorteringsAttributt.STARTDATO}
                />
                <Kolonne
                    label="Sluttdato"
                    attributt={SorteringsAttributt.SLUTTDATO}

                />
                <Kolonne
                    label="Stillingsprosent"
                    attributt={SorteringsAttributt.STILLINGSPROSENT}
                />
                <Kolonne
                    label="Yrke"
                    attributt={SorteringsAttributt.YRKE}
                />
                <Kolonne
                    label="Varsling"
                    attributt={SorteringsAttributt.VARSEL}
                />
            </tr>
        </thead>
    );
};

export default KolonnerFullSkjerm;

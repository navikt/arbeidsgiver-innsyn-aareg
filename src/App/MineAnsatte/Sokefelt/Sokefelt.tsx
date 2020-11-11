import React, {FunctionComponent} from 'react';
import { Input } from 'nav-frontend-skjema';
import Forstorrelsesglass from './Forstørrelsesglass';
import './Sokefelt.less';
import {getVariabelFraUrl} from "../sorteringOgFiltreringsFunksjoner";

interface Props {
    setParameterIUrl: (parameter: string, variabel: string) => void;
}

const Sokefelt: FunctionComponent<Props> = (props: Props) => {
    const søketekstvariabel = getVariabelFraUrl('sok');
    const søkeTekst = søketekstvariabel ? søketekstvariabel : '';

    const onSoketekstChange = (soketekst: string) => {
        props.setParameterIUrl('sok', soketekst);
        props.setParameterIUrl('side', '1');
    };

    return (
        <div className="sokefelt">
            <Input
                className="sokefelt__felt"
                type="search"
                label=""
                value={søkeTekst}
                onChange={(e: any) => onSoketekstChange(e.target.value)}
                placeholder="Søk på navn eller fødselsnummer"
            />
            <div className="sokefelt__ikon">{søkeTekst.length === 0 && <Forstorrelsesglass/>}</div>
        </div>
        )


};

export default Sokefelt;

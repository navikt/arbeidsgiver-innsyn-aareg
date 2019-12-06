import React, { FunctionComponent } from 'react';
import { Input } from 'nav-frontend-skjema';
import Kryss from './Kryss';
import './Sokefelt.less';
import Forstorrelsesglass from "./Forstørrelsesglass";

interface Props {
    soketekst: string;
    onChange: (soketekst: string) => void;
}

const Sokefelt: FunctionComponent<Props> = ({ soketekst, onChange }) => (
    <div className="sokefelt">
        <Input
            className="sokefelt__felt"
            type="search"
            label={''}
            value={soketekst}
            onChange={(e: any) => onChange(e.target.value)}
            placeholder="Søk på navn eller fødselsnummer"
        />
        <div className="sokefelt__ikon">
            {soketekst.length === 0 ? (
                <Forstorrelsesglass />
            ) : (
                <Kryss className="sokefelt__ikon--klikkbart" onClick={() => onChange('')} />
            )}
        </div>
    </div>
);

export default Sokefelt;

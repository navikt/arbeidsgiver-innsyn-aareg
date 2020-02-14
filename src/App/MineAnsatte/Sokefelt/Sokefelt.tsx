import React from 'react';
import { Input } from 'nav-frontend-skjema';
import Forstorrelsesglass from './Forstørrelsesglass';
import './Sokefelt.less';

interface Props {
    soketekst: string;
    onChange: (soketekst: string) => void;
}

const Sokefelt = ({ soketekst, onChange }: Props) => (
    <div className="sokefelt">
        <Input
            className="sokefelt__felt"
            type="search"
            label=""
            value={soketekst}
            onChange={(e: any) => onChange(e.target.value)}
            placeholder="Søk på navn eller fødselsnummer"
        />
        <div className="sokefelt__ikon">{soketekst.length === 0 && <Forstorrelsesglass />}</div>
    </div>
);

export default Sokefelt;

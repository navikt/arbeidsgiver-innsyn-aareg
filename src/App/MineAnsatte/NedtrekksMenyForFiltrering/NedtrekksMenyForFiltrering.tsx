import React, {FunctionComponent} from "react";
import {Button, Menu, MenuItem, Wrapper} from "react-aria-menubutton";
import './NedtrekksMenyForFiltrering.less';

interface Props {
    onFiltrering: (value: any, event: any) => void;
}

const NedtrekksMenyForFiltrering: FunctionComponent<Props> = ({ onFiltrering }) => {
    return (<Wrapper className="wrapper" onSelection={onFiltrering}>
            <Button className="wrapper__button">
                Vis alle
            </Button>
            <Menu className="wrapper">
                <MenuItem className="wrapper__valg" value={'visAlle'}>
                    Alle arbeidsforhold
                </MenuItem>
                <MenuItem className="wrapper__valg" value={'aktive'}>
                    Aktive arbeidsforhold
                </MenuItem>
                <MenuItem className="wrapper__valg" value={'avsluttede'}>
                    Avsluttede arbeidsforhold
                </MenuItem>
            </Menu>
        </Wrapper>



    );
};

export default NedtrekksMenyForFiltrering;
import React, {FunctionComponent, useState} from "react";
import {Button, Menu, MenuItem, Wrapper} from "react-aria-menubutton";
import './NedtrekksMenyForFiltrering.less';
import {NedChevron, OppChevron} from "nav-frontend-chevron";

interface Props {
    onFiltrering: (value: any, event: any) => void;
}

const NedtrekksMenyForFiltrering: FunctionComponent<Props> = ({ onFiltrering }) => {
    const [erApen, setErApen] = useState(false);

    return (<Wrapper className="wrapper" onSelection={onFiltrering} onMenuToggle={({ isOpen }) => {
            setErApen(isOpen);
        }}>
            <Button className="wrapper__button">
                Vis alle
                { !erApen &&
                <NedChevron type={'ned'} />}
                { erApen && <OppChevron/>}
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
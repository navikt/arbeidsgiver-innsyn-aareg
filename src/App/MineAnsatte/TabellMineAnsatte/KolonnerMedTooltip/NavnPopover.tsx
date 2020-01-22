import Popover, {PopoverOrientering} from 'nav-frontend-popover';
import React, {FunctionComponent, useEffect, useState} from 'react';
import {Normaltekst} from "nav-frontend-typografi";
import {Arbeidstaker} from "../../../Objekter/Arbeidstaker";
import {Link} from "react-router-dom";
import {Arbeidsforhold} from "../../../Objekter/ArbeidsForhold";
import {Organisasjon} from "../../../Objekter/OrganisasjonFraAltinn";
import './PopOverStyling.less';

type PopoverProps = {
    tekst: string
    className?: string;
    settValgtArbeidsgiver: (valgtArbeidstaker: Arbeidstaker) => void;
    arbeidsforhold: Arbeidsforhold;
    valgtBedrift: Organisasjon;

}

const NavnPopover: FunctionComponent<PopoverProps> = (props:PopoverProps) => {
    const [anker, setAnker] = useState<HTMLElement | undefined>(undefined);
    const [skalVisePopover, setSkalVisePopover] = useState(true);
    const maxBreddeAvKolonne = 160;

    const oppdaterValgtArbeidsgiver = (fnr: string, navn: string) => {
        const fnrSomheltall: number = parseInt(fnr);
        props.settValgtArbeidsgiver({ fnr: fnrSomheltall, navn: navn });
    };

    useEffect(() => {
        if (anker){
            if (anker.offsetWidth<maxBreddeAvKolonne) {
                setSkalVisePopover(false);}
        }
    }, [anker]);

    return (
            <div className={"pop-over-container"}
                onClick={() =>
                    oppdaterValgtArbeidsgiver(
                        props.arbeidsforhold.arbeidstaker.offentligIdent,
                        props.arbeidsforhold.arbeidstaker.navn
                    )
                }
            >
                <Link className={"pop-over"}
                    to={
                        'enkeltarbeidsforhold/?bedrift=' +
                        props.valgtBedrift +
                        '&arbeidsforhold=' +
                        props.arbeidsforhold.navArbeidsforholdId
                    }
                >
                    <Normaltekst  className={props.className} onMouseEnter={(e: any) => {setAnker(e.currentTarget);
                    }}
                                  onMouseLeave={(e: any) => setAnker(undefined)}>{props.tekst}</Normaltekst>
                    <Popover ankerEl={anker} orientering={PopoverOrientering.Over}>
                        <p  style={{padding: '1rem'}} >{props.tekst} </p> </Popover>

                </Link>
            </div>
    );
};



export default NavnPopover

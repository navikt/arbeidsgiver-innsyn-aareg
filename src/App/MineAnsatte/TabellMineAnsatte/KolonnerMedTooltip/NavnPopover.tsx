import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import { Normaltekst } from 'nav-frontend-typografi';
import { Arbeidsforhold } from '../../../Objekter/ArbeidsForhold';
import { loggBrukerTrykketPaVarsel } from '../../../amplitudefunksjonerForLogging';
import './PopOverStyling.less';

interface Props {
    setValgtArbeidsforhold: (arbeidsforhold: Arbeidsforhold) => void;
    arbeidsforhold: Arbeidsforhold;
    nesteArbeidsforhold?: Arbeidsforhold;
    valgtBedrift: string;
}

const NavnPopover = (props: Props) => {
    const [anker, setAnker] = useState<HTMLElement | undefined>(undefined);
    const [skalVisePopover, setSkalVisePopover] = useState(true);

    const maxBreddeAvKolonne = 158;

    const oppdaterValgtArbeidsforhold = (arbeidsforhold: Arbeidsforhold) => {
        props.setValgtArbeidsforhold(arbeidsforhold);
        if (props.arbeidsforhold.varsler?.length) {
            loggBrukerTrykketPaVarsel();
        }
    };

    useEffect(() => {
        if (anker) {
            if (anker.offsetWidth < maxBreddeAvKolonne) {
                setSkalVisePopover(false);
            }
        }
    }, [anker]);

    const url = window.location.href.toString();
    const indeksqueryStart = url.indexOf('?');
    const sistedelAvUrl = url.substr(indeksqueryStart, url.length);

    return (
        <div className="pop-over-container">
            <Link
                to={`enkeltarbeidsforhold/${sistedelAvUrl}&arbeidsforhold=${props.arbeidsforhold.navArbeidsforholdId}`}
                onClick={() => oppdaterValgtArbeidsforhold(props.arbeidsforhold)}
                className="lenke"
            >
                <Normaltekst
                    className="pop-over"
                    onMouseEnter={(e: any) => {
                        setAnker(e.currentTarget);
                    }}
                    onMouseLeave={(e: any) => setAnker(undefined)}
                >
                    {props.arbeidsforhold.arbeidstaker.navn}
                </Normaltekst>
                {skalVisePopover && (
                    <Popover ankerEl={anker} orientering={PopoverOrientering.Over}>
                        <p style={{ padding: '1rem' }}>{props.arbeidsforhold.arbeidstaker.navn}</p>
                    </Popover>
                )}
            </Link>
        </div>
    );
};

export default NavnPopover;

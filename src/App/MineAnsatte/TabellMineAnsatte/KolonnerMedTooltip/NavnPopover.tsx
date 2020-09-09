import React, {FunctionComponent, useEffect, useState} from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import { Normaltekst } from 'nav-frontend-typografi';
import { Arbeidsforhold } from '../../../Objekter/ArbeidsForhold';
import { loggBrukerTrykketPaVarsel } from '../../../amplitudefunksjonerForLogging';
import './PopOverStyling.less';
import {withRouter} from "react-router";

interface Props extends RouteComponentProps {
    arbeidsforhold: Arbeidsforhold;
}

const NavnPopover: FunctionComponent<Props> = ( {history, arbeidsforhold}) => {
    const [anker, setAnker] = useState<HTMLElement | undefined>(undefined);
    const [skalVisePopover, setSkalVisePopover] = useState(true);

    const maxBreddeAvKolonne = 158;

    const oppdaterValgtArbeidsforhold = (arbeidsforhold: Arbeidsforhold) => {
        const nyUrl = new URL(window.location.href);
        const { search } = nyUrl;
        history.replace({ pathname: '/enkeltArbeidsforhold', search: search });
        if (arbeidsforhold.varsler?.length) {
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
                to={`enkeltarbeidsforhold/${sistedelAvUrl}&arbeidsforhold=${arbeidsforhold.navArbeidsforholdId}`}
                onClick={() => oppdaterValgtArbeidsforhold(arbeidsforhold)}
                className="lenke"
            >
                <Normaltekst
                    className="pop-over"
                    onMouseEnter={(e: any) => {
                        setAnker(e.currentTarget);
                    }}
                    onMouseLeave={(e: any) => setAnker(undefined)}
                >
                    {arbeidsforhold.arbeidstaker.navn}
                </Normaltekst>
                {skalVisePopover && (
                    <Popover ankerEl={anker} orientering={PopoverOrientering.Over}>
                        <p style={{ padding: '1rem' }}>{arbeidsforhold.arbeidstaker.navn}</p>
                    </Popover>
                )}
            </Link>
        </div>
    );
};

export default withRouter(NavnPopover)

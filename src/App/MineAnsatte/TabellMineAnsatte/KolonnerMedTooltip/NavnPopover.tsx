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

    const naVærendeUrl = new URL(window.location.href);
    const ERPATIDLIGEREARBEIDSFORHOLD = naVærendeUrl.toString().includes('tidligere-arbeidsforhold')

    const maxBreddeAvKolonne = 140;

    const oppdaterValgtArbeidsforhold = (arbeidsforhold: Arbeidsforhold) => {
        const { search } = naVærendeUrl;
        const redirectPath = ERPATIDLIGEREARBEIDSFORHOLD ? '/tidligere-arbeidsforhold/enkeltArbeidsforhold' : '/enkeltArbeidsforhold'
        history.replace({ pathname: redirectPath, search: search });
        if (arbeidsforhold.varsler?.length) {
            loggBrukerTrykketPaVarsel();
        }
    };

    let lowerCaseNavn = arbeidsforhold.arbeidstaker.navn[0]

    for (let i = 1; i < arbeidsforhold.arbeidstaker.navn.length ; i++) {
        if (lowerCaseNavn[i-1] === ' ') {
            lowerCaseNavn += arbeidsforhold.arbeidstaker.navn[i]
        }
        else {
            lowerCaseNavn += arbeidsforhold.arbeidstaker.navn[i].toLowerCase()
        }
    }

    useEffect(() => {
        if (anker) {
            if (anker.offsetWidth < maxBreddeAvKolonne) {
                setSkalVisePopover(false);
            }
        }
    }, [anker]);

    const spørringdelAvUrl = naVærendeUrl.search;

    return (
        <div className="pop-over-container">
            <Link
                aria-label={`Gå til detaljevisning over arbeidsforhold til ${lowerCaseNavn}`}
                to={`enkeltarbeidsforhold/${spørringdelAvUrl}&arbeidsforhold=${arbeidsforhold.navArbeidsforholdId}`}
                onClick={() => oppdaterValgtArbeidsforhold(arbeidsforhold)}
                className="lenke"
            >
                <Normaltekst
                    className="pop-over__navn"
                    onMouseEnter={(e: any) => {
                        setAnker(e.currentTarget);
                    }}
                    onMouseLeave={(e: any) => setAnker(undefined)}
                >
                    {lowerCaseNavn}
                </Normaltekst>
                {skalVisePopover && (
                    <Popover ankerEl={anker} orientering={PopoverOrientering.Over}>
                        <p style={{ padding: '1rem' }}>{lowerCaseNavn}</p>
                    </Popover>
                )}
            </Link>
        </div>
    );
};

export default withRouter(NavnPopover)

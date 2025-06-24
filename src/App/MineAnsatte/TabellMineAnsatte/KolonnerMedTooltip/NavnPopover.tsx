import React, { FunctionComponent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Arbeidsforhold } from '../../../Objekter/ArbeidsForhold';
import { loggBrukerklikk } from '../../../../utils/amplitudefunksjonerForLogging';
import './PopOverStyling.css';
import { useReplace } from '../../../../utils/UrlManipulation';
import { BodyShort, Popover } from '@navikt/ds-react';

interface Props {
    arbeidsforhold: Arbeidsforhold;
}

const NavnPopover: FunctionComponent<Props> = ({ arbeidsforhold }) => {
    const [anker, setAnker] = useState<HTMLSelectElement | null>(null);
    const [skalVisePopover, setSkalVisePopover] = useState(true);
    const replace = useReplace();

    const naVærendeUrl = new URL(window.location.href);
    const ERPATIDLIGEREARBEIDSFORHOLD = naVærendeUrl
        .toString()
        .includes('tidligere-arbeidsforhold');

    const maxBreddeAvKolonne = 140;

    const oppdaterValgtArbeidsforhold = (arbeidsforhold: Arbeidsforhold) => {
        const { search } = naVærendeUrl;
        const redirectPath = ERPATIDLIGEREARBEIDSFORHOLD
            ? '/tidligere-arbeidsforhold/enkeltArbeidsforhold'
            : '/enkeltArbeidsforhold';
        replace({ pathname: redirectPath, search: search });
        loggBrukerklikk('arbeidsforhol');
    };

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
                aria-label={`Gå til detaljvisning over arbeidsforhold til ${arbeidsforhold.arbeidstaker.navn}`}
                to={`enkeltarbeidsforhold/${spørringdelAvUrl}&arbeidsforhold=${arbeidsforhold.navArbeidsforholdId}`}
                onClick={() => oppdaterValgtArbeidsforhold(arbeidsforhold)}
                className="lenke"
            >
                <BodyShort
                    className="pop-over__navn"
                    onMouseEnter={(e: any) => {
                        setAnker(e.currentTarget);
                    }}
                    onMouseLeave={(e: any) => setAnker(null)}
                >
                    {arbeidsforhold.arbeidstaker.navn.toLowerCase()}
                </BodyShort>
                <Popover
                    open={skalVisePopover}
                    onClose={() => null}
                    anchorEl={anker}
                    placement="top"
                >
                    <p style={{ padding: '1rem' }}>{arbeidsforhold.arbeidstaker.navn}</p>
                </Popover>
            </Link>
        </div>
    );
};

export default NavnPopover;

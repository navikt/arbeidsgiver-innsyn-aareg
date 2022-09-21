import React, { FunctionComponent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import { Normaltekst } from 'nav-frontend-typografi';
import { Arbeidsforhold } from '../../../Objekter/ArbeidsForhold';
import { loggBrukerklikk } from '../../../../utils/amplitudefunksjonerForLogging';
import './PopOverStyling.less';
import { useReplace } from '../../../../utils/UrlManipulation';

interface Props {
    arbeidsforhold: Arbeidsforhold;
}

const NavnPopover: FunctionComponent<Props> = ({ arbeidsforhold }) => {
    const [anker, setAnker] = useState<HTMLElement | undefined>(undefined);
    const [skalVisePopover, setSkalVisePopover] = useState(true);
    const replace = useReplace();

    const naVærendeUrl = new URL(window.location.href);
    const ERPATIDLIGEREARBEIDSFORHOLD = naVærendeUrl.toString().includes('tidligere-arbeidsforhold');

    const maxBreddeAvKolonne = 140;

    const oppdaterValgtArbeidsforhold = (arbeidsforhold: Arbeidsforhold) => {
        const { search } = naVærendeUrl;
        const redirectPath = ERPATIDLIGEREARBEIDSFORHOLD
            ? '/tidligere-arbeidsforhold/enkeltArbeidsforhold'
            : '/enkeltArbeidsforhold';
        replace({ pathname: redirectPath, search: search });
        arbeidsforhold.varsler?.length ? loggBrukerklikk('arbeidsforhol', ) : loggBrukerklikk('arbeidsforhol');
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
        <div className='pop-over-container'>
            <Link
                aria-label={`Gå til detaljvisning over arbeidsforhold til ${arbeidsforhold.arbeidstaker.navn}`}
                to={`enkeltarbeidsforhold/${spørringdelAvUrl}&arbeidsforhold=${arbeidsforhold.navArbeidsforholdId}`}
                onClick={() => oppdaterValgtArbeidsforhold(arbeidsforhold)}
                className='lenke'
            >
                <Normaltekst
                    className='pop-over__navn'
                    onMouseEnter={(e: any) => {
                        setAnker(e.currentTarget);
                    }}
                    onMouseLeave={(e: any) => setAnker(undefined)}
                >
                    {arbeidsforhold.arbeidstaker.navn.toLowerCase()}
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

export default NavnPopover;

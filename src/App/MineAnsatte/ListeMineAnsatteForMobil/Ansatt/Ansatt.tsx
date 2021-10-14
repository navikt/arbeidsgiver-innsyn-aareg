import React, { FunctionComponent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Arbeidsforhold } from '../../../Objekter/ArbeidsForhold';
import AttributtVisning from './AttributtVisning/AttributtVisning';
import { loggBrukerTrykketPaVarsel } from '../../../../utils/amplitudefunksjonerForLogging';
import './Ansatt.less';
import { datoformat } from '../../utils';

interface Props {
    arbeidsforhold: Arbeidsforhold;
}

const Ansatt: FunctionComponent<Props> = ({ arbeidsforhold }) => {
    const history = useHistory();
    const naVærendeUrl = new URL(window.location.href);
    const ERPATIDLIGEREARBEIDSFORHOLD = naVærendeUrl.toString().includes('tidligere-arbeidsforhold');

    const oppdaterValgtArbeidsforhold = (arbeidsforhold: Arbeidsforhold) => {
        const { search } = naVærendeUrl;
        const redirectPath = ERPATIDLIGEREARBEIDSFORHOLD
            ? '/tidligere-arbeidsforhold/enkeltarbeidsforhold'
            : '/enkeltarbeidsforhold';
        history.replace({ pathname: redirectPath, search: search });
        if (arbeidsforhold.varsler?.length) {
            loggBrukerTrykketPaVarsel();
        }
    };

    const spørringdelAvUrl = naVærendeUrl.search;

    return (
        <li className="arbeidsforhold" aria-label={'liste med informasjon om enkelt arbeidsforhold'}>
            <ul className="arbeidsforhold__liste" aria-label={`Arbeidsfohold til ${arbeidsforhold.arbeidstaker.navn}`}>
                <li className="attributt">
                    <div className="attributt__navn">Navn</div>
                    <div className="attributt__verdi">
                        <Link
                            to={`enkeltarbeidsforhold/${spørringdelAvUrl}&arbeidsforhold=${arbeidsforhold.navArbeidsforholdId}`}
                            onClick={() => oppdaterValgtArbeidsforhold(arbeidsforhold)}
                            className="lenke"
                            aria-label={`Gå til detaljvisning over arbeidsforhold til ${arbeidsforhold.arbeidstaker.navn}`}
                        >
                            {arbeidsforhold.arbeidstaker.navn}
                        </Link>
                    </div>
                </li>
                <AttributtVisning
                    attributt="Offentlig Ident"
                    attributtVerdi={arbeidsforhold.arbeidstaker.offentligIdent}
                />
                <AttributtVisning attributt="Startet" attributtVerdi={datoformat(arbeidsforhold.ansattFom)} />
                <AttributtVisning attributt="Slutter" attributtVerdi={datoformat(arbeidsforhold.ansattTom)} />
                <AttributtVisning attributt="Stillingsprosent %" attributtVerdi={arbeidsforhold.stillingsprosent} />
                <AttributtVisning attributt="Yrke" attributtVerdi={arbeidsforhold.yrkesbeskrivelse} />
                {arbeidsforhold.varsler && (
                    <AttributtVisning
                        attributt="Varsling"
                        attributtVerdi={arbeidsforhold.varsler[0].varslingskodeForklaring}
                    />
                )}
            </ul>
        </li>
    );
};

export default Ansatt;

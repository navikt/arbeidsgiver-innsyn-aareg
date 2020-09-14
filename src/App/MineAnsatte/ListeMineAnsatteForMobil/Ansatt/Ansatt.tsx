import React, { FunctionComponent } from 'react';
import {Link, RouteComponentProps, withRouter} from 'react-router-dom';
import { Arbeidsforhold } from '../../../Objekter/ArbeidsForhold';
import AttributtVisning from './AttributtVisning/AttributtVisning';
import { loggBrukerTrykketPaVarsel } from '../../../amplitudefunksjonerForLogging';
import './Ansatt.less';

interface Props extends RouteComponentProps{
    arbeidsforhold: Arbeidsforhold;
}

const Ansatt: FunctionComponent<Props> = ( {history, arbeidsforhold}) => {
    const naVærendeUrl = new URL(window.location.href);
    const ERPATIDLIGEREARBEIDSFORHOLD = naVærendeUrl.toString().includes('tidligere-arbeidsforhold')

    const oppdaterValgtArbeidsforhold = (arbeidsforhold: Arbeidsforhold) => {
        const nyUrl = new URL(window.location.href);
        const { search } = nyUrl;
        const redirectPath = ERPATIDLIGEREARBEIDSFORHOLD ? '/tidligere-arbeidsforhold/enkeltArbeidsforhold' : '/enkeltArbeidsforhold'
        history.replace({ pathname: redirectPath, search: search });
        if (arbeidsforhold.varsler?.length) {
            loggBrukerTrykketPaVarsel();
        }
    };

    const url = window.location.href.toString();
    const indeksqueryStart = url.indexOf('?');
    const sistedelAvUrl = url.substr(indeksqueryStart, url.length);

    return (
        <li className="arbeidsforhold">
            <ul className="arbeidsforhold__liste" aria-label="Ansatt detaljer">
                <li className="attributt">
                    <div className="attributt__navn">Navn</div>
                    <div className="attributt__verdi">
                        <Link
                            to={`enkeltarbeidsforhold/${sistedelAvUrl}&arbeidsforhold=${arbeidsforhold.navArbeidsforholdId}`}
                            onClick={() => oppdaterValgtArbeidsforhold(arbeidsforhold)}
                            className="lenke"
                            aria-label={'Navn: ' + arbeidsforhold.arbeidstaker.navn}
                        >
                            {arbeidsforhold.arbeidstaker.navn}
                        </Link>
                    </div>
                </li>
                <AttributtVisning
                    attributt="Offentlig Ident"
                    attributtVerdi={arbeidsforhold.arbeidstaker.offentligIdent}
                />
                <AttributtVisning attributt="Startet" attributtVerdi={arbeidsforhold.ansattFom} />
                <AttributtVisning attributt="Slutter" attributtVerdi={arbeidsforhold.ansattTom} />
                <AttributtVisning
                    attributt="Stillingsprosent %"
                    attributtVerdi={arbeidsforhold.stillingsprosent}
                />
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

export default withRouter(Ansatt);
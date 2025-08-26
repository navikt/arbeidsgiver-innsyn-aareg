import { FunctionComponent, MouseEventHandler } from 'react';
import Lenkepanel, { LenkepanelProps } from 'nav-frontend-lenkepanel';
import { useLocation } from 'react-router-dom';
import { loggNavigasjon } from '../../utils/amplitudefunksjonerForLogging';

interface Props extends LenkepanelProps {
    loggLenketekst: string;
}

export const LenkepanelMedLogging: FunctionComponent<Props> = props => {
    const {onClick, loggLenketekst, ...rest} = props;
    const {pathname} = useLocation()

    const onClickLog: MouseEventHandler<HTMLAnchorElement> = event => {
        loggNavigasjon(props.href, loggLenketekst, pathname);
        onClick?.(event);
    };

    return <Lenkepanel onClick={onClickLog} {...rest} />;
};
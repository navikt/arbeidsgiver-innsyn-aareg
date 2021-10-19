import { FunctionComponent, MouseEventHandler } from 'react';
import Lenke, {Props as LenkeProps} from 'nav-frontend-lenker';
import { useLocation } from 'react-router-dom';
import { loggNavigasjon } from '../../utils/amplitudefunksjonerForLogging';

export interface Props extends LenkeProps {
    loggLenketekst: string;
}

export const LenkeMedLogging: FunctionComponent<Props> = props => {
    const {onClick, loggLenketekst, ...rest} = props;
    const {pathname} = useLocation()

    const onClickLog: MouseEventHandler<HTMLAnchorElement> = event => {
        loggNavigasjon(props.href, loggLenketekst, pathname);
        onClick?.(event);
    };

    return <Lenke onClick={onClickLog} {...rest} />;
};
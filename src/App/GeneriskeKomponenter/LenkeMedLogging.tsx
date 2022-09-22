import React, { FunctionComponent, MouseEventHandler } from 'react';
import Lenke, {Props as LenkeProps} from 'nav-frontend-lenker';
import { Link, LinkProps, useLocation } from 'react-router-dom';
import { loggNavigasjon } from '../../utils/amplitudefunksjonerForLogging';

export interface Props {
    href: string;
    loggLenketekst: string;
    className: string;
    children: React.ReactNode;
}

export const LenkeMedLogging: FunctionComponent<Props> = props => {
    const {children, loggLenketekst, href, className} = props;
    const {pathname} = useLocation()

    const onClickLog: MouseEventHandler<HTMLAnchorElement> = () => {
        loggNavigasjon(props.href, loggLenketekst, pathname);
    };

    return <Link className={`lenke ${className}`} onClick={onClickLog} to={href}>
        {children}
    </Link>;
};
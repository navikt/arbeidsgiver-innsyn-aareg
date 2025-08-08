import { FunctionComponent, MouseEventHandler } from 'react';
import { useLocation } from 'react-router-dom';
import { loggNavigasjon } from '../../utils/amplitudefunksjonerForLogging';
import { LinkPanel, LinkPanelProps } from '@navikt/ds-react';

interface Props extends LinkPanelProps {
    loggLenketekst: string;
}

export const LenkepanelMedLogging: FunctionComponent<Props> = (props) => {
    const { onClick, loggLenketekst, ...rest } = props;
    const { pathname } = useLocation();

    const onClickLog: MouseEventHandler<HTMLAnchorElement> = (event) => {
        loggNavigasjon(props.href, loggLenketekst, pathname);
        onClick?.(event);
    };

    return <LinkPanel onClick={onClickLog} {...rest} />;
};

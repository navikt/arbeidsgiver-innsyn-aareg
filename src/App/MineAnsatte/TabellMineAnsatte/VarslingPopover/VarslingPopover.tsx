import Popover from 'nav-frontend-popover';
import React, {FunctionComponent, useState} from 'react';

type PopoverProps = {
    anker: HTMLElement|undefined;
    Tekst: string

}

const VarslingPopover: FunctionComponent<PopoverProps> = (props:PopoverProps) => {
    const [anker,setAnker] = useState<HTMLElement|undefined>(props.anker);
    return (
        <div>
            <Popover ankerEl={anker} onRequestClose={() => setAnker (undefined)}>
                <p style={{ padding: '1rem' }}>Dette er en popover.</p>
            </Popover>
        </div>
    );
};

export default VarslingPopover

import React, { FunctionComponent, useContext } from "react";
import './VelgTidligereVirksomhet.less';
import { Select } from 'nav-frontend-skjema';
import UnderenhetIkon from './UnderenhetIkon';
import { BedriftsmenyContext } from '../../BedriftsmenyProvider';
import { useSearchParameters } from '../../../utils/UrlManipulation';
import { defaultFilterParams } from '../urlFunksjoner';

const VelgTidligereVirksomhet: FunctionComponent = () => {
    const { tidligereUnderenheter } = useContext(BedriftsmenyContext);
    const { getSearchParameter, setSearchParameter } = useSearchParameters();

    const setTidligereVirksomhet = (orgnr: string) => {
        const params = defaultFilterParams();
        setSearchParameter({...params, tidligereVirksomhet: orgnr});
    };

    const underenheter = tidligereUnderenheter === 'laster' ? [] : tidligereUnderenheter;
    const tidligereVirksomhet = getSearchParameter('tidligereVirksomhet');

    return (
        <div className={'mine-ansatte__velg-tidligere-virksomhet'}>
            <Select
                label={
                    <div className={'mine-ansatte__velg-tidligere-virksomhet-label'}>
                        {' '}
                        <UnderenhetIkon /> Nedlagt/omstrukturert virksomhet
                    </div>
                }
                defaultValue={tidligereVirksomhet ?? ''}
                placeholder={'Velg tidligere virksomhet'}
                onChange={event => setTidligereVirksomhet(event.target.value)}
                id={'velg-tidligere-virksomhet'}
            >
                <option
                    title="Velg virksomhet"
                    className={'mine-ansatte__velg-tidligere-virksomhet-option'}
                    id={'tidligere-virksomhet'}
                    value=""
                    key="ingen-valgt"
                >
                    Velg virksomhet
                </option>
                {underenheter.map(virksomhet => (
                    <option
                        title={virksomhet.Name + ', ' + virksomhet.OrganizationNumber}
                        className={'mine-ansatte__velg-tidligere-virksomhet-option'}
                        id={'tidligere-virksomhet'}
                        value={virksomhet.OrganizationNumber}
                        key={virksomhet.OrganizationNumber}
                    >
                        {virksomhet.Name + ', ' + virksomhet.OrganizationNumber}
                    </option>
                ))}
            </Select>
        </div>
    );
};

export default VelgTidligereVirksomhet;

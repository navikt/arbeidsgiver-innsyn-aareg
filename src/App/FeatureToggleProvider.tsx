import React, { createContext, useEffect, useState } from 'react';
import {hentFeatureToggles} from "../api/unleashApi";


export enum Feature {
    visHistorikk = 'innsynaareg.vishistorikk',
    tillatPrint = 'innsynaareg.tillatPrint'
}

export const alleFeatures = Object.values(Feature);

export interface FeatureToggles {
    [toggles: string]: boolean;
}

export const FeatureToggleContext = createContext<FeatureToggles>({});

export const FeatureToggleProvider = (props: any) => {
    const [featureToggles, setFeatureToggles] = useState<FeatureToggles>({});

    const hentToggles = () => {
        hentFeatureToggles().then(toggles=> setFeatureToggles(toggles)).catch( e => {
            setFeatureToggles(Object.assign({}, ...alleFeatures.map((feature) => ({[feature]: false}))))
    })};

    useEffect(() => {
        hentToggles();
    }, []);

    return (
        <FeatureToggleContext.Provider value={featureToggles}>
            {props.children}
        </FeatureToggleContext.Provider>
    );
};

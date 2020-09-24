import { createContext } from 'react';

export interface OccupationsContext {
    occupations: string[];
};

const initialOccupations: OccupationsContext = {
    occupations: []
};

export const occupationsContext = createContext<OccupationsContext>(initialOccupations);
export const ClinicalDetailsDataContextProvider = occupationsContext.Provider;

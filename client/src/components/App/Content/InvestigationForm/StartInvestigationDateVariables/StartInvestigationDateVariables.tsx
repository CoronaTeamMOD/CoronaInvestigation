import { createContext } from 'react';

export interface StartInvestigationDateVariables {
    symptomsStartDate: Date | undefined;
    exposureDate: Date | undefined;
    hasSymptoms: boolean;
    endInvestigationDate: Date | undefined;
    setSymptomsStartDate: React.Dispatch<React.SetStateAction<Date | undefined>> | undefined;
    setExposureDate: React.Dispatch<React.SetStateAction<Date | undefined>> | undefined;
    setHasSymptoms: React.Dispatch<React.SetStateAction<boolean>> | undefined;
    setEndInvestigationDate: React.Dispatch<React.SetStateAction<Date | undefined>> | undefined;
}

export const intialStartInvestigationDateVariables: StartInvestigationDateVariables = {
    symptomsStartDate: undefined,
    exposureDate: undefined,
    hasSymptoms: false,
    endInvestigationDate: undefined,
    setSymptomsStartDate: undefined,
    setExposureDate: undefined,
    setHasSymptoms: undefined,
    setEndInvestigationDate: undefined
};

const startInvestigationDateVariables = createContext<StartInvestigationDateVariables>(intialStartInvestigationDateVariables)
export const StartInvestigationDateVariablesProvider = startInvestigationDateVariables.Provider;
export const StartInvestigationDateVariablesConsumer = startInvestigationDateVariables.Consumer;
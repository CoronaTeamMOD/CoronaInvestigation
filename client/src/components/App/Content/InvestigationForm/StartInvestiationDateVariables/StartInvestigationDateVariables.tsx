import { createContext } from 'react';

import StartInvestiationDateVariables from 'models/StartInvestigationDateVariables'

interface EmptyStartInvestigationDateVariables {
    symptomsStartDate: undefined;
    exposureDate: undefined;
    setSymptomsStartDate: undefined;
    setExposureDate: undefined;
};

const intialStartInvestigationDateVariables: EmptyStartInvestigationDateVariables = {
    symptomsStartDate: undefined,
    exposureDate: undefined,
    setSymptomsStartDate: undefined,
    setExposureDate: undefined
};

export const startInvestigationDateVariables = createContext<StartInvestiationDateVariables | EmptyStartInvestigationDateVariables>(intialStartInvestigationDateVariables)
export const StartInvestigationDateVariablesProvider = startInvestigationDateVariables.Provider;
export const StartInvestigationDateVariablesConsumer = startInvestigationDateVariables.Consumer;

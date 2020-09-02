import { createContext } from 'react';

import Address, { initAddress } from 'models/Address';

export interface InteractionEventVariables {
    locationType?: string;
    startTime?: string;
    endTime?: string;
    externalizationApproval: boolean;
    investigationId?: number;
    locationName?: string;
    locationAddress?: Address;
    trainLine?: string,
    busLine?: string,
    airline?: string;
    flightNumber?: string;
    busCompany?: string;
    grade?: string;
    boardingStation?: string;
    boardingCountry?: string;
    boardingCity?: string;
    endStation?: string;
    endCountry?: string;
    endCity?: string;
    buisnessContactName?: string;
    buisnessContactNumber?: string;
    hospitalDepartment?: string;
    setLocationType?: React.Dispatch<React.SetStateAction<string>>;
    setStartTime?: React.Dispatch<React.SetStateAction<string | undefined>>;
    setEndTime?: React.Dispatch<React.SetStateAction<string | undefined>>;
    setExternalizationApproval?: React.Dispatch<React.SetStateAction<boolean>>;
    setInvestigationId?: React.Dispatch<React.SetStateAction<number | undefined>>;
    setLocationName?: React.Dispatch<React.SetStateAction<string | undefined>>;
    setLocationAddress?: React.Dispatch<React.SetStateAction<Address>>;
    setTrainLine?: React.Dispatch<React.SetStateAction<string | undefined>>;
    setBusLine?: React.Dispatch<React.SetStateAction<string | undefined>>;
    setBusCompany?: React.Dispatch<React.SetStateAction<string | undefined>>;
    setAirline?: React.Dispatch<React.SetStateAction<string | undefined>>;
    setFlightNumber?: React.Dispatch<React.SetStateAction<string | undefined>>;
    setGrade?: React.Dispatch<React.SetStateAction<string | undefined >>;
    setBoardingStation?: React.Dispatch<React.SetStateAction<string | undefined>>;
    setBoardingCountry?: React.Dispatch<React.SetStateAction<string | undefined>>;
    setBoardingCity?: React.Dispatch<React.SetStateAction<string | undefined>>;
    setEndStation?: React.Dispatch<React.SetStateAction<string | undefined>>;
    setEndCountry?: React.Dispatch<React.SetStateAction<string | undefined>>;
    setEndCity?: React.Dispatch<React.SetStateAction<string | undefined>>;
    setBuisnessContactName?: React.Dispatch<React.SetStateAction<string | undefined>>;
    setBuisnessContactNumber?: React.Dispatch<React.SetStateAction<string | undefined>>;
    setHospitalDepartment?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const intialInteractionEventVariables: InteractionEventVariables = {
    locationType: '',
    locationAddress: initAddress,
    startTime: undefined,
    endTime: undefined,
    externalizationApproval: false,
};

const interactionEventVariables = createContext<InteractionEventVariables>(intialInteractionEventVariables)
export const InteractionEventVariablesProvider = interactionEventVariables.Provider;
export const InteractionEventVariablesConsumer = interactionEventVariables.Consumer;
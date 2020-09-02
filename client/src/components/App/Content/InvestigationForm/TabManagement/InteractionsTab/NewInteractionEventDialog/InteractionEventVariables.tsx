import { createContext } from 'react';
import Address, { initAddress } from 'models/InteractionEventPlacesVariables/Address';

export interface InteractionEventVariables {
    locationType: string;
    startTime: string | undefined;
    endTime: string | undefined;
    externalizationApproval: boolean;
    // privateHouseVariables: AddressVariables;
    // officeVariables: AddressVariables;
    // schoolVariables: SchoolVariables;
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
    setLocationType?: React.Dispatch<React.SetStateAction<string>> | undefined;
    setStartTime?: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
    setEndTime?: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
    setExternalizationApproval?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
    // setPrivateHouseVariables: React.Dispatch<React.SetStateAction<AddressVariables>> | undefined;
    // setOfficeVariables: React.Dispatch<React.SetStateAction<AddressVariables>> | undefined;
    // setSchoolVariables: React.Dispatch<React.SetStateAction<SchoolVariables>> | undefined;
    setInvestigationId?: React.Dispatch<React.SetStateAction<number | undefined>> | undefined;
    setLocationName?: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
    setLocationAddress?: React.Dispatch<React.SetStateAction<Address>> | undefined;
    setTrainLine?: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
    setBusLine?: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
    setBusCompany?: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
    setAirline?: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
    setFlightNumber?: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
    setGrade?: React.Dispatch<React.SetStateAction<string | undefined >> | undefined;
    setBoardingStation?: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
    setBoardingCountry?: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
    setBoardingCity?: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
    setEndStation?: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
    setEndCountry?: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
    setEndCity?: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
    setBuisnessContactName?: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
    setBuisnessContactNumber?: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
    setHospitalDepartment?: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
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
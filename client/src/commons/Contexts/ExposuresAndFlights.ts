import { createContext } from 'react';

import FlightData from 'models/FlightData';
import ExposureData from 'models/ExposureData';
import BorderCheckpointData from 'models/BorderCheckpointData';

export type Exposure = ExposureData & BorderCheckpointData & FlightData;

export type ExposureAndFlightsDetails = {
    exposures: Exposure[],
    exposuresToDelete: (number | null)[],
    wereConfirmedExposures: boolean,
    wereFlights: boolean,
    wasInVacation: boolean | undefined,
    wasInEvent: boolean | undefined,
    borderCheckpointData?: BorderCheckpointData,
};

export interface ExposureAndFlightsDetailsAndSet {
    exposureAndFlightsData: ExposureAndFlightsDetails,
    setExposureDataAndFlights: React.Dispatch<React.SetStateAction<ExposureAndFlightsDetails>>
};

export const fieldsNames = {
    wasConfirmedExposure: 'wasConfirmedExposure',
    wereConfirmedExposuresDesc: 'wereConfirmedExposuresDesc',
    exposureSource: 'exposureSource',
    date: 'exposureDate',
    address: 'exposureAddress',
    placeType: 'exposurePlaceType',
    placeSubType: 'exposurePlaceSubType',
    wasAbroad: 'wasAbroad',
    destinationCountry: 'flightDestinationCountry',
    destinationCity: 'flightDestinationCity',
    destinationAirport: 'flightDestinationAirport',
    originCountry: 'flightOriginCountry',
    originCity: 'flightOriginCity',
    originAirport: 'flightOriginAirport',
    flightStartDate: 'flightStartDate',
    flightEndDate: 'flightEndDate',
    airline: 'airline',
    flightNumber: 'flightNum',
    wereConfirmedExposures: 'wereConfirmedExposures',
    wereFlights: 'wereFlights',
    wasInVacation: 'wasInVacation',
    wasInEvent: 'wasInEvent',
    exposures: 'exposures',
    isExposurePersonKnown: 'isExposurePersonKnown',
    borderCheckpoint: 'borderCheckpoint',
    borderCheckpointType: 'borderCheckpointType',
    arrivalDateToIsrael: 'arrivalDateToIsrael',
    arrivalTimeToIsrael: 'arrivalTimeToIsrael',
    flightSeatNum: 'flightSeatNum',
    otherFlightNum: 'otherFlightNum',
    lastDestinationCountry: 'lastDestinationCountry',
    otherAirline: 'otherAirline',
    borderCheckpointData:'borderCheckpointData',
    flights:'flights',
    exposureDetails: 'exposureDetails',
};

export const initialExposuresAndFlightsData: ExposureAndFlightsDetails = {
    exposures: [],
    exposuresToDelete: [],
    wereConfirmedExposures: false,
    wereFlights: false,
    wasInVacation: undefined,
    wasInEvent: undefined,
    borderCheckpointData: undefined,
};

// export const initialExposureOrFlight: Exposure = {
//     id: null,
//     wasConfirmedExposure: false,
//     exposureSource: null,
//     exposureDate: null,
//     exposureAddress: null,
//     exposurePlaceType: null,
//     exposurePlaceSubType: null,
//     wasAbroad: false,
//     flightDestinationCountry: null,
//     flightDestinationCity: null,
//     flightDestinationAirport: null,
//     flightOriginCountry: null,
//     flightOriginCity: null,
//     flightOriginAirport: null,
//     flightStartDate: null,
//     flightEndDate: null,
//     airline: null,
//     flightNum: null,
//     isExposurePersonKnown: undefined,
//     borderCheckpoint: undefined,
//     borderCheckpointType: undefined,
//     arrivalDateToIsrael: undefined,
//     arrivalTimeToIsrael: undefined,
//     flightSeatNum: undefined,
//     otherFlightNum: undefined,
//     lastDestinationCountry: undefined,
//     otherAirline: undefined
// };

// export const isConfirmedExposureInvalid = (exposure: Exposure) =>
//     !(exposure.exposureSource) &&
//     (!exposure.exposureAddress || !exposure.exposureAddress.place_id)

export const isFlightInvalid = (exposure: Exposure) =>
    /*  
     *  NOTE: This is a plaster!, see ticket 1085 for more details
     *  issue seem to stem from the cursed function 🤢 handleChangeExposureDataAndFlightsField 🤢
     *  is seems that when origin flight country is changed it sometimes erases the origin airport
     *  - vice versa, same for destination.
     *  the solution is to refactor the function to not use this function and instead rely on methods.getValues() 
     */

    // !exposure.flightOriginAirport ||
    // !exposure.flightOriginCountry ||
    // !exposure.flightDestinationAirport ||
    // !exposure.flightDestinationCountry ||
    !exposure.flightStartDate ||
    !exposure.flightEndDate ||
    !exposure.flightNum

const initialContextValues: ExposureAndFlightsDetailsAndSet = {
    exposureAndFlightsData: initialExposuresAndFlightsData,
    setExposureDataAndFlights: () => {}
};

export const exposureAndFlightsContext = createContext<ExposureAndFlightsDetailsAndSet>(initialContextValues);
export const ExposureAndFlightsContextProvider = exposureAndFlightsContext.Provider;
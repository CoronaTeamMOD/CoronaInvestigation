import { createContext } from 'react';

import FlightData from 'models/FlightData';
import ExposureData from 'models/ExposureData';

export type Exposure = ExposureData & FlightData;

export type ExposureAndFlightsDetails = {
    exposures: Exposure[],
    exposuresToDelete: (number | null)[],
    wereConfirmedExposures: boolean,
    wereFlights: boolean,
    wasInEilat: boolean,
    wasInDeadSea: boolean,
}

export interface ExposureAndFlightsDetailsAndSet {
    exposureAndFlightsData: ExposureAndFlightsDetails,
    setExposureDataAndFlights: React.Dispatch<React.SetStateAction<ExposureAndFlightsDetails>>
};

export const fieldsNames = {
    wasConfirmedExposure: 'wasConfirmedExposure',
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
    wasInEilat: 'wasInEilat',
    wasInDeadSea: 'wasInDeadSea',
};

export const initialExposuresAndFlightsData: ExposureAndFlightsDetails = {
    exposures: [],
    exposuresToDelete: [],
    wereConfirmedExposures: false,
    wereFlights: false,
    wasInEilat: false,
    wasInDeadSea: false,
};

export const initialExposureOrFlight: Exposure = {
    id: null,
    wasConfirmedExposure: false,
    exposureSource: null,
    exposureDate: null,
    exposureAddress: null,
    exposurePlaceType: null,
    exposurePlaceSubType: null,
    wasAbroad: false,
    flightDestinationCountry: null,
    flightDestinationCity: null,
    flightDestinationAirport: null,
    flightOriginCountry: null,
    flightOriginCity: null,
    flightOriginAirport: null,
    flightStartDate: null,
    flightEndDate: null,
    airline: null,
    flightNum: null,
};

export const isConfirmedExposureInvalid = (exposure: Exposure) =>
    !(exposure.exposureSource) &&
    (!exposure.exposureAddress || !exposure.exposureAddress.place_id)

export const isFlightInvalid = (exposure: Exposure) =>
    !exposure.flightDestinationCity || 
    !exposure.flightDestinationCountry || 
    !exposure.flightOriginCity || 
    !exposure.flightOriginCountry

const initialContextValues: ExposureAndFlightsDetailsAndSet = {
    exposureAndFlightsData: initialExposuresAndFlightsData,
    setExposureDataAndFlights: () => {}
};

export const exposureAndFlightsContext = createContext<ExposureAndFlightsDetailsAndSet>(initialContextValues);
export const ExposureAndFlightsContextProvider = exposureAndFlightsContext.Provider;

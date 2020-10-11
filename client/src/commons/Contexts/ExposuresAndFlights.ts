import { createContext } from 'react';

import ExposureData from 'models/ExposureData';
import FlightData from 'models/FlightData';

export type Exposure = ExposureData & FlightData;

export type ExposureAndFlightsDetails = {
    exposures: Exposure[],
    exposuresToDelete: (number | null)[],
    wereConfirmedExposures: boolean,
    wereFlights: boolean,
}

export interface ExposureAndFlightsDetailsAndSet {
    exposureAndFlightsData: ExposureAndFlightsDetails,
    setExposureDataAndFlights: React.Dispatch<React.SetStateAction<ExposureAndFlightsDetails>>
};

export const fieldsNames = {
    wasConfirmedExposure: 'wasConfirmedExposure',
    firstName: 'exposureFirstName',
    lastName: 'exposureLastName',
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
};

export const initialExposuresAndFlightsData: ExposureAndFlightsDetails = {
    exposures: [],
    exposuresToDelete: [],
    wereConfirmedExposures: false,
    wereFlights: false,
};

export const initialExposureOrFlight: Exposure = {
    id: null,
    wasConfirmedExposure: false,
    exposureFirstName: null,
    exposureLastName: null,
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
    flightNum: null
};

export const isConfirmedExposureInvalid = (exposure: Exposure) =>
    !(exposure.exposureFirstName && exposure.exposureLastName ) &&
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

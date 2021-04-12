import { createContext } from 'react';

import FlightData from 'models/FlightData';
import ExposureData from 'models/ExposureData';

export type Exposure = ExposureData & FlightData;

export type ExposureAndFlightsDetails = {
    exposures: Exposure[],
    exposuresToDelete: (number | null)[],
    wereConfirmedExposures: boolean,
    wereFlights: boolean,
    wasInVacation: boolean | undefined,
    wasInEvent: boolean | undefined
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
};

export const initialExposuresAndFlightsData: ExposureAndFlightsDetails = {
    exposures: [],
    exposuresToDelete: [],
    wereConfirmedExposures: false,
    wereFlights: false,
    wasInVacation: undefined,
    wasInEvent: undefined,
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
    !exposure.flightOriginAirport || 
    !exposure.flightOriginCountry ||
    !exposure.flightDestinationAirport ||
    !exposure.flightDestinationCountry || 
    !exposure.flightStartDate ||
    !exposure.flightEndDate ||
    !exposure.flightNum

const initialContextValues: ExposureAndFlightsDetailsAndSet = {
    exposureAndFlightsData: initialExposuresAndFlightsData,
    setExposureDataAndFlights: () => {}
};

export const exposureAndFlightsContext = createContext<ExposureAndFlightsDetailsAndSet>(initialContextValues);
export const ExposureAndFlightsContextProvider = exposureAndFlightsContext.Provider;
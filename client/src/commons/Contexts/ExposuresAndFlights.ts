import { createContext } from 'react';

import ExposureFlightData from 'models/ExposureFlightData';
import ExposureResortData from 'models/ExposureResortData';
import ConfirmedExposureData from 'models/ConfirmedExposureData';

export type Exposure = ConfirmedExposureData & ExposureFlightData & ExposureResortData;

export type ExposureAndFlightsDetails = {
    exposures: Exposure[],
    exposuresToDelete: (number | null)[],
    wereConfirmedExposures: boolean,
    wereFlights: boolean,
    wasInResort: boolean,
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
    wasInResort: 'wasInResort',
    resortLocation: 'resortLocation',
};

export const initialExposuresAndFlightsData: ExposureAndFlightsDetails = {
    exposures: [],
    exposuresToDelete: [],
    wereConfirmedExposures: false,
    wereFlights: false,
    wasInResort: false,
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
    wasInResort: false,
    resortLocation: null,
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

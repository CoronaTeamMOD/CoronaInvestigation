import { createContext } from 'react';
import ExposureData from 'models/ExposureData';
import FlightData from 'models/FlightData';

export type ExposureAndFlightsDetails = ExposureData & FlightData;

export interface ExposureAndFlightsDetailsAndSet {
    exposureAndFlightsData: ExposureAndFlightsDetails,
    setExposureDataAndFlights: React.Dispatch<React.SetStateAction<ExposureAndFlightsDetails>>
};

export const fieldsNames = {
    wasConfirmedExposure: "wasConfirmedExposure",
    firstName: "exposureFirstName",
    lastName: "exposureLastName",
    date: "exposureDate",
    address: "exposureAddress",
    placeType: "exposurePlaceType",
    placeSubType: "exposurePlaceSubType",
    wasAbroad: "wasAbroad",
    destinationCountry: "flightDestinationCountry",
    destinationCity: "flightDestinationCity",
    destinationAirport: "flightDestinationAirport",
    originCountry: "flightOriginCountry",
    originCity: "flightOriginCity",
    originAirport: "flightOriginAirport",
    flightStartDate: "flightStartDate",
    flightEndDate: "flightEndDate",
    airline: "airline",
    flightNumber: "flightNum",
};
  
export const initialExposuresAndFlightsData: ExposureAndFlightsDetails = {
  id: null,
  wasConfirmedExposure: false,
  exposureFirstName: '',
  exposureLastName: '',
  exposureDate: undefined,
  exposureAddress: null, 
  exposurePlaceType: null,
  exposurePlaceSubType : null,
  wasAbroad: false,
  flightDestinationCountry: null,
  flightDestinationCity: '',
  flightDestinationAirport: '',
  flightOriginCountry: null,
  flightOriginCity: '',
  flightOriginAirport: '',
  flightStartDate: undefined,
  flightEndDate: undefined,
  airline: '',
  flightNum: ''
};

const initialContextValues: ExposureAndFlightsDetailsAndSet = {
    exposureAndFlightsData: initialExposuresAndFlightsData,
    setExposureDataAndFlights: () => {}
};

export const exposureAndFlightsContext = createContext<ExposureAndFlightsDetailsAndSet>(initialContextValues);
export const ExposureAndFlightsContextProvider = exposureAndFlightsContext.Provider;
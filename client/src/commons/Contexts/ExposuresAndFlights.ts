import { createContext } from 'react';

import ExposureData from "models/ExposureData";
import FlightData from "models/FlightData";

type FormData = ExposureData & FlightData;

type contentDataType = {[A in keyof FormData]: FormData[A] | undefined};
export interface ExposureDetails {
    exposureData: contentDataType,
    setExposureData: {[A in keyof FormData] : React.Dispatch<React.SetStateAction<(FormData[A]| undefined)>>}
};

export const initialExposuresAndFlightsData: FormData = {
    placeType: {id:0,name:''},
    exposureLocation: '',
    exposingPersonFirstName: '',
    exposingPersonLastName: '',
    exposureDate: new Date(),
    toAirport: '',
    fromAirport: '',
    airline: '',
    departureDate: new Date(),
    arrivalDate: new Date(),
    flightNumber: '',
};

const initialContextValues: ExposureDetails = {
    exposureData: initialExposuresAndFlightsData,
    // @ts-ignore
    setExposureData: () => {}
};


export const exposuresContext = createContext<ExposureDetails>(initialContextValues);
export const exposuresContextConsumer = exposuresContext.Consumer;
export const ExposuresContextProvider = exposuresContext.Provider;
import {GeocodeResponse, GoogleApiPlace} from '../commons/LocationInputField/LocationInput';
import CovidPatient from './CovidPatient';
import BorderCheckpointData from 'models/BorderCheckpointData';
import BorderCheckpoint from './BorderCheckpoint';
import Country from './Country';
import KeyValuePair from './KeyValuePair';
import ExposureActionFlag from './enums/ExposureActionFlags';

// interface ExposureData {
//     id: number | null,
//     wasConfirmedExposure: boolean,
//     exposureDate: Date | null;
//     exposureAddress: GoogleApiPlace | GeocodeResponse | null;
//     exposurePlaceType: string | null;
//     exposurePlaceSubType: number | null;
//     exposureSource: CovidPatient | null;
//     isExposurePersonKnown: boolean | undefined;
// }

export interface ExposureData {
    id?: number,
    investigationId?: number,
    wasAbroad?: boolean,
    wasConfirmedExposure?: boolean,
    wasInEvent?: boolean,
    wasInVacation?:boolean,
    borderCheckpointType?: number,
    arrivalDateToIsrael?: Date,
    arrivalTimeToIsrael?: string,
    lastDestinationCountry?: Country,
    wereConfirmedExposuresDesc?:string,
    borderCheckpoint?: BorderCheckpoint,
    flights:Flight[],
    exposureDetails:ExposureDetails[]
    creationSource?: number
};

export interface Flight {
    id?: number,
    flightOriginCountry?: Country,
    flightDestinationCountry?: Country,
    flightDestinationAirport?: string,
    flightOriginAirport?: string,
    airline?: KeyValuePair,
    flightNum?: string,
    otherFlightNum?: string,
    flightStartDate?: Date,
    flightEndDate?: Date,
    otherAirline?: string,
    flightSeatNum?: string,
    actionFlag?: ExposureActionFlag,
}

export  interface ExposureDetails {
    id?: number,
    exposureDate?: Date,
    exposureAddress?: GoogleApiPlace | GeocodeResponse | null,//string,
    exposurePlaceSubType?: number,
    exposurePlaceType?: string,   
    isExposurePersonKnown: boolean | undefined,
    exposureSource: CovidPatient | null,
    actionFlag?: ExposureActionFlag,
}

interface ExposurePerson {
    fullName: string;
    identityNumber: string;
    primaryPhone: string;
    epidemiologyNumber: number;
    age: number; 
    address: string;
}


export const initialFlight: Flight = {
    //flightDestinationCountry: CountryCodes.DEFAULT_COUNTRY,
    actionFlag: ExposureActionFlag.INSERT,
    flightOriginAirport:undefined,
    flightDestinationAirport:undefined
}


export default ExposureData;

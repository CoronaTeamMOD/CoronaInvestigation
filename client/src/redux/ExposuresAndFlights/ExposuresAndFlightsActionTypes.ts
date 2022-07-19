import { ExposureData, Flight } from "models/ExposureData";


export const GET_EXPOSURE_DATA_PENDING = 'GET_EXPOSURE_DATA_PENDING';
export const GET_EXPOSURE_DATA_SUCCESS = 'GET_EXPOSURE_DATA_SUCCESS';
export const GET_EXPOSURE_DATA_ERROR = 'GET_EXPOSURE_DATA_ERROR';
export const RESET_EXPOSURE_DATA = 'RESET_EXPOSURE_DATA';
export const SET_EXPOSURE_DATA = 'SET_EXPOSURE_DATA';
export const SET_FLIGHT_DATA = 'SET_FLIGHT_DATA';
export const ADD_NEW_FLIGHT = 'ADD_NEW_FLIGHT';
export const REMOVE_FLIGHT = 'REMOVE_FLIGHT';

export type ValueOf<T> = T[keyof T];
interface GetExposureDataPending {
    type: typeof GET_EXPOSURE_DATA_PENDING
}

interface GetExposureDataSuccess {
    type: typeof GET_EXPOSURE_DATA_SUCCESS,
    payload: {
        exposureData: ExposureData | null
    }
}

interface GetExposureDataError {
    type: typeof GET_EXPOSURE_DATA_ERROR,
    error: any
}

interface SetExposureData {
    type: typeof SET_EXPOSURE_DATA,
    payload: {
        propertyName: keyof ExposureData,
        value: ValueOf<ExposureData>
    }
}

interface SetFlightData {
    type: typeof SET_FLIGHT_DATA,
    payload: {   
        index: number,
        propertyName: keyof Flight,
        value: ValueOf<Flight>,
        id: number |null
    }
}


interface ResetExposureData {
    type: typeof RESET_EXPOSURE_DATA,
}

interface AddNewFlight {
    type: typeof ADD_NEW_FLIGHT,
    payload: {
        flight: Flight
    }
}

interface RemoveFlight {
    type: typeof REMOVE_FLIGHT,
    payload: {   
        index: number,
        id: number |null
    }
}


export type ExposureAndFlightActions = GetExposureDataPending | GetExposureDataSuccess | GetExposureDataError |
    SetExposureData | SetFlightData | ResetExposureData | AddNewFlight | RemoveFlight;
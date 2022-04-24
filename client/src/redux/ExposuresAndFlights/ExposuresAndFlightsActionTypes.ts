import ExposureAndFlightData from "models/ExposureAndFlightData";

export const SET_EXPOSURE_AND_FLIGHT_DATA = 'SET_EXPOSURE_AND_FLIGHT_DATA';

interface SetExposureAndFlightData {
    type: typeof SET_EXPOSURE_AND_FLIGHT_DATA,
    payload: {
        exposuresAndFlights: ExposureAndFlightData
    }
}

export type ExposureAndFlightActions = SetExposureAndFlightData;
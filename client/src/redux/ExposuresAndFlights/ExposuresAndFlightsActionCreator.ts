import ExposureAndFlightData from "models/ExposureAndFlightData";
import * as actionTypes from './ExposuresAndFlightsActionTypes';

export const setExposureAnfFlightData = (exposuresAndFlights: ExposureAndFlightData) => {
    return {
        type: actionTypes.SET_EXPOSURE_AND_FLIGHT_DATA,
        payload: { exposuresAndFlights }
    };
}

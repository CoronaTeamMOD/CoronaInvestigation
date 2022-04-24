import ExposureAndFlightData from "models/ExposureAndFlightData";
import * as Actions from './ExposuresAndFlightsActionTypes';

const initialState: ExposureAndFlightData = {
    borderCheckpoint: null,
    flights: [],
    investigationId: -1
};

const exposuresAndFlightsReducer = (state = initialState, action: Actions.ExposureAndFlightActions) => {
    switch (action.type) {
        case Actions.SET_EXPOSURE_AND_FLIGHT_DATA: {
            return action.payload.exposuresAndFlights;
        }
        default: return state;
    }
}

export default exposuresAndFlightsReducer;
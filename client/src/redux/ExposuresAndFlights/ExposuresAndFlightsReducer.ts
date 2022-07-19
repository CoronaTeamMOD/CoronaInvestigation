import FlightsForm from "components/App/Content/InvestigationForm/TabManagement/ExposuresAndFlights/Forms/FlightsForm/FlightsForm";
import CountryCodes from "models/enums/CountryCodes";
import ExposureActionFlag from "models/enums/ExposureActionFlags";
import ExposureAndFlightData from "models/ExposureAndFlightData";
import { ExposureData, Flight } from "models/ExposureData";
import FlightData from "models/FlightData";
import { Action } from "rxjs/internal/scheduler/Action";
import { getExposureData } from "./ExposuresAndFlightsActionCreator";
import * as Actions from './ExposuresAndFlightsActionTypes';

export interface ExposureState {
    exposureData: ExposureData | null;
    pending: boolean;
    error: any;
}

const initialExposure: ExposureData = {
    id: undefined,
    investigationId: undefined,
    wasAbroad: false,
    wasConfirmedExposure: false,
    wasInEvent: undefined,
    wasInVacation: undefined,
    borderCheckpointType: undefined,
    arrivalDateToIsrael: undefined,
    arrivalTimeToIsrael: '',
    lastDestinationCountry: undefined,
    wereConfirmedExposuresDesc: '',
    borderCheckpoint: undefined,
    flights: [],
    exposureDetails: [],
    creationSource: undefined,
}



const initialState: ExposureState = {
    exposureData: null,
    pending: false,
    error: null
};


const exposuresAndFlightsReducer = (state = initialState, action: Actions.ExposureAndFlightActions) => {
    switch (action.type) {
        case Actions.GET_EXPOSURE_DATA_PENDING:
            return {
                ...state,
                pending: true
            }
        case Actions.GET_EXPOSURE_DATA_SUCCESS:
            return {
                ...state,
                pending: false,
                exposureData: action.payload.exposureData ? action.payload.exposureData : initialExposure
            }
        case Actions.GET_EXPOSURE_DATA_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        case Actions.RESET_EXPOSURE_DATA:
            return {
                ...state,
                exposureData: null
            }
        case Actions.SET_FLIGHT_DATA:
            if (state.exposureData && state.exposureData.flights) {
                return {
                    ...state,
                    exposureData: {
                        ...state.exposureData,
                        flights: state.exposureData.flights.map((flight, index) => {
                            if ((!flight.id && index == action.payload.index) || flight.id == action.payload.id) {
                                flight = {
                                    ...flight,
                                    [action.payload.propertyName]: action.payload.value
                                }
                            }
                            return flight;
                        })
                    }
                }
            }
            else return state;
        case Actions.ADD_NEW_FLIGHT:
            if (state.exposureData) {
                return {
                    ...state,
                    exposureData: {
                        ...state.exposureData,
                        flights: state.exposureData?.flights ? [...state.exposureData?.flights, action.payload.flight] : [action.payload.flight]
                    }
                }

            }
            else return state;
        case Actions.SET_EXPOSURE_DATA:
            if (state.exposureData) {
                return {
                    ...state,
                    exposureData: { ...state.exposureData, [action.payload.propertyName]: action.payload.value }
                };
            }
            else return state;
        case Actions.REMOVE_FLIGHT:
            if (state.exposureData && state.exposureData.flights && state.exposureData.flights.length > 0) {
                if (action.payload.id) {
                    return {
                        ...state,
                        exposureData: {
                            ...state.exposureData,
                            flights: state.exposureData.flights.map((flight, index) => {
                                if (flight.id == action.payload.id) {
                                    flight = {
                                        ...flight,
                                        actionFlag: ExposureActionFlag.DELETE
                                    }
                                }

                                return flight;
                            })
                        }
                    }
                }
                else if (action.payload.index) {
                    return {
                        ...state,
                        exposureData: {
                            ...state.exposureData,
                            flights: [
                                ...state.exposureData.flights.slice(0, action.payload.index),
                                ...state.exposureData.flights.slice(action.payload.index + 1)
                            ]

                        }
                    }
                }
            }
            else return state;

        default: return state;
    }
}

export default exposuresAndFlightsReducer;
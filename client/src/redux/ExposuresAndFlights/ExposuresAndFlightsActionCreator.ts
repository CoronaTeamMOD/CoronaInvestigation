import { fetchExposureData } from "httpClient/exposure";
import ExposureAndFlightData from "models/ExposureAndFlightData";
import { ExposureData, Flight } from "models/ExposureData";
import FlightData from "models/FlightData";
import { ThunkAction } from "redux-thunk";
import { setIsLoading } from "redux/IsLoading/isLoadingActionCreators";
import * as actionTypes from './ExposuresAndFlightsActionTypes';
import { ValueOf } from "./ExposuresAndFlightsActionTypes";
import { ExposureState } from "./ExposuresAndFlightsReducer";



export const getExposureData = (): ThunkAction<void, ExposureState, unknown, actionTypes.ExposureAndFlightActions> => async dispatch => {
  dispatch({
    type: actionTypes.GET_EXPOSURE_DATA_PENDING
  });

  try {
    setIsLoading(true);
    const exposureData = await fetchExposureData();
      dispatch({
        type: actionTypes.GET_EXPOSURE_DATA_SUCCESS,
        payload: {
          exposureData: exposureData
        }
      });
  }
  catch (err) {
    dispatch({
      type: actionTypes.GET_EXPOSURE_DATA_ERROR,
      error: err
    });
    setIsLoading(false);
  }
}

export const resetExposureData = () => {
  return {
    type: actionTypes.RESET_EXPOSURE_DATA
  };
}

export const setExposureData = (propertyName: keyof ExposureData, value: ValueOf<ExposureData>) => {
  return {
    type: actionTypes.SET_EXPOSURE_DATA,
    payload: { propertyName, value }
  };
}

export const setFlightData = (propertyName: keyof Flight, value: ValueOf<Flight>, index : number, id :number | null  =null) => {
  return {
    type: actionTypes.SET_FLIGHT_DATA,
    payload: { index, propertyName, value, id }
  };
}

export const addNewFlight = ( flight : Flight) => {
  return {
    type: actionTypes.ADD_NEW_FLIGHT,
    payload: { flight }
  };
}

export const removeFlight = (index : number, id :number | null  = null) => {
  return {
    type: actionTypes.REMOVE_FLIGHT,
    payload: { index, id }
  };
}

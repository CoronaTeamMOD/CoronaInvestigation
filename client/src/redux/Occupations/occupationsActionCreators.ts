import {store} from '../store';
import * as actionTypes from './occupationsActionTypes';

export const setOccupations = (occupations: string[]): void => {
    store.dispatch({
        type: actionTypes.SET_OCCUPATIONS,
        payload: {occupations}
    })
}
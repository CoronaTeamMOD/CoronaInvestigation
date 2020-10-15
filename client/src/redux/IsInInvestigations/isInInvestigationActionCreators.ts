import {store} from '../store';
import * as actionTypes from './isInInvestigationActionTypes';

export const setIsInInvestigation = (isInInvestigation: boolean): void => {
    store.dispatch({
        type: actionTypes.SET_IS_IN_INVESTIGATION,
        payload: {isInInvestigation}
    })
}
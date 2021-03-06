import User from 'models/User';
import UserType from 'models/UserType';

import {store} from '../store';
import * as actionTypes from './userActionTypes';

export const setUser = (user: User): void => {
    store.dispatch({
        type: actionTypes.SET_USER,
        payload: {user}
    })
};

export const setIsActive = (isActive: boolean) => {
    store.dispatch({
        type: actionTypes.SET_IS_ACTIVE,
        payload: {isActive}
    });
};

export const setInvestigationGroup = (districtId: number, countyDisplayName: string) => {
    store.dispatch({
        type: actionTypes.SET_INVESTIGATION_GROUP,
        payload: {districtId, countyDisplayName}
    });
};

export const setDisplayedCounty = (county: number) => {
    store.dispatch({
        type: actionTypes.SET_DISPLAYED_COUNTY,
        payload: {county}
    });
};

export const setDisplayedDistrict = (district: number) => {
    store.dispatch({
        type: actionTypes.SET_DISPLAYED_DISTRICT,
        payload: {district}
    });
};

export const setUserTypes = (userTypes: UserType): void => {
    store.dispatch({
        type: actionTypes.SET_USER_TYPES,
        payload: {userTypes}
    })
};

export const setDisplayedUserType = (userType: number): void => {
    store.dispatch({
        type: actionTypes.SET_DISPLAYED_USER_TYPE,
        payload: {userType}
    })
};
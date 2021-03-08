import User from 'models/User';
import UserType from 'models/UserType';
import UserTypeCodes from 'models/enums/UserTypeCodes';

import * as Actions from './userActionTypes';

export interface UserState {
    data: User;
    isLoggedIn: boolean;
    displayedCounty: number;
    displayedDistrict: number;
    userTypes: UserType[];
};

export const initialUserState: UserState = {
    data: {
        id: '1',
        userName: 'XXXXXX',
        investigationGroup: -1,
        isActive: false,
        isDeveloper: false,
        phoneNumber: '',
        serialNumber: -1,
        activeInvestigationsCount: 0,
        newInvestigationsCount: 0,
        pauseInvestigationsCount: 0,
        languages: [],
        userType: UserTypeCodes.NOT_LOGGED_IN,
        sourceOrganization: '',
        deskName: '',
        deskname: '',
        authorityName: '',
        countyByInvestigationGroup: {
            districtId: -1,
            displayName: ''
        },
        authorityByAuthorityId: {
            authorityName: ''
        }
    },
    isLoggedIn: false,
    displayedCounty: -1,
    displayedDistrict: -1,
    userTypes: []
};

const userReducer = (state = initialUserState, action: Actions.UserAction): UserState => {
    switch (action.type) {
        case Actions.SET_USER: return {
            ...state,
            data: action.payload.user,
            isLoggedIn: true,
            displayedCounty: action.payload.user.investigationGroup
        };
        case Actions.SET_IS_ACTIVE: return {
            ...state,
            data: { ...state.data, isActive: action.payload.isActive }
        };
        case Actions.SET_DISPLAYED_COUNTY: return {
            ...state,
            displayedCounty: action.payload.county
        };
        case Actions.SET_DISPLAYED_DISTRICT: return {
            ...state,
            displayedDistrict: action.payload.district
        };
        case Actions.SET_USER_TYPES: return {
            ...state,
            userTypes: action.payload.userTypes
        };
        case Actions.SET_DISPLAYED_USER_TYPE: return {
            ...state,
            data: { ...state.data, userType: action.payload.userType }
        };
        default: return state;
    }
};

export default userReducer;
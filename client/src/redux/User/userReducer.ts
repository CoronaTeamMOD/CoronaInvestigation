import User from 'models/User';
import UserType from 'models/enums/UserType';

import * as Actions from './userActionTypes';

export interface UserState {
    data: User;
    isLoggedIn: boolean;
    displayedCounty: number;
}

export const initialUserState: UserState = {
    data: {
        id: '1',
        userName: 'XXXXXX',
        investigationGroup: -1,
        isActive: false,
        phoneNumber: '',
        serialNumber: -1,
        activeInvestigationsCount: 0,
        newInvestigationsCount: 0,
        pauseInvestigationsCount: 0,
        languages: [],
        userType: UserType.NOT_LOGGED_IN,
        sourceOrganization: '',
        deskName: '',
        countyByInvestigationGroup: {
            districtId: -1,
            displayName: ''
        }
    },
    isLoggedIn: false,
    displayedCounty: -1
}

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
        default: return state;
    }
}

export default userReducer;

import User from 'models/User';
import userType from 'models/enums/UserType';

import * as Actions from './userActionTypes';

export interface UserState {
    data: User;
    isLoggedIn: boolean;
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
        userType: userType.INVESTIGATOR,
        sourceOrganization: '',
        deskName: '',
        countyByInvestigationGroup: {
            districtId: -1
        }
    },
    isLoggedIn: false
}

const userReducer = (state = initialUserState, action: Actions.UserAction): UserState => {
    switch (action.type) {
        case Actions.SET_USER: return {
            ...state,
            data: action.payload.user,
            isLoggedIn: true
        };
        case Actions.SET_IS_ACTIVE: return {
            ...state,
            data: { ...state.data, isActive: action.payload.isActive }
        };
        default: return state;
    }
}

export default userReducer;

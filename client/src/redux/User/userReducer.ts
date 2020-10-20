import User from 'models/User';
import userType from 'models/enums/UserType';

import * as Actions from './userActionTypes';

export const initialUserState: User = {
    id: '1',
    userName: 'XXXXXX',
    token: 'demo token',
    investigationGroup: -1,
    isActive: false,
    phoneNumber: '',
    serialNumber: -1,
    activeInvestigationsCount: 0,
    newInvestigationsCount: 0,
    userType: userType.INVESTIGATOR,
}

const userReducer = (state = initialUserState, action: Actions.UserAction): User => {
    switch (action.type) {
        case Actions.SET_USER: return { ...state, ...action.payload.user }
        case Actions.SET_TOKEN: return { ...state, token: action.payload }
        default: return state;
    }
}

export default userReducer;

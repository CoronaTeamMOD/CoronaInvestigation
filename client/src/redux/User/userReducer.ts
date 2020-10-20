import User from 'models/User';

import * as Actions from './userActionTypes';

export const initialUserState: User = {
    id: '1',
    userName: 'XXXXXX',
    token: 'demo token',
    isAdmin: false,
    investigationGroup: -1,
    isActive: false,
    phoneNumber: '',
    serialNumber: -1,
    activeInvestigationsCount: 0,
    newInvestigationsCount: 0
}

const userReducer = (state = initialUserState, action: Actions.UserAction): User => {
    switch (action.type) {
        case Actions.SET_USER: return { ...state, ...action.payload.user }
        case Actions.SET_TOKEN: return { ...state, token: action.payload }
        default: return state;
    }
}

export default userReducer;

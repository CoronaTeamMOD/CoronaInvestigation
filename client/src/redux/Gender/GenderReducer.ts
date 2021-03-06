import Gender from 'models/enums/Gender';

import * as Actions from './GenderActionTypes';

const initialState: string = Gender.FEMALE;

const genderReducer = (state = initialState, action: Actions.GenderAction) : string => {
    switch (action.type) {
        case Actions.SET_GENDER: return action.payload.gender

        default: return state;
    }
}

export default genderReducer;

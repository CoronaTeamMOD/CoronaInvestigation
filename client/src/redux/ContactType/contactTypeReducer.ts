import ContactType from 'models/ContactType';

import * as Actions from './contactTypeActionTypes';

const initialState: Map<number, ContactType> = new Map();

const conatactTypeReducer = (state = initialState, action: Actions.contactTypeAction) : Map<number, ContactType> => {
    switch (action.type) {
        case Actions.SET_CONTACT_TYPES: {
            return action.payload.contactTypes
        }
          
        default:  return state;
    }
}

export default conatactTypeReducer;

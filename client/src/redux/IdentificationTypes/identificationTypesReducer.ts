import IdentificationType from 'models/IdentificationType';

import * as Actions from './identificationTypesActionTypes';

const initialState: IdentificationType[] = [];

const identificationTypesReducer = (state = initialState, action: Actions.identificationTypesAction): IdentificationType[] => {
    switch (action.type) {
        case Actions.SET_IDENTIFICATION_TYPES: return action.payload.identificationTypes;
        default: return state;
    };
};

export default identificationTypesReducer;
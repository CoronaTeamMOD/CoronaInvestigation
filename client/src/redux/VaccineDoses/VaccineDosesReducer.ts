import KeyValuePair from 'models/KeyValuePair';
import * as Actions from './VaccineDosesActionTypes';

const initialState: KeyValuePair[] = [];

const vaccineDosesReducer = (state = initialState, action: Actions.VaccineDosesActionTypes) => {
    switch (action.type) {
        case Actions.SET_VACCINE_DOSES:
            return action.payload.vaccineDoses;
        default:
            return state;
    };
};

export default vaccineDosesReducer;
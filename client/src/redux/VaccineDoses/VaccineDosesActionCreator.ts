import KeyValuePair from 'models/KeyValuePair';
import * as actionTypes from './VaccineDosesActionTypes';

export const SetVaccineDoses = (vaccineDoses: KeyValuePair[]) => {
    return {
        type: actionTypes.SET_VACCINE_DOSES,
        payload: { vaccineDoses }
    };
}

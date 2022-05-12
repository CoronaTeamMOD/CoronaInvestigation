import KeyValuePair from 'models/KeyValuePair';

export const SET_VACCINE_DOSES = 'SET_VACCINE_DOSES';

interface SetVaccineDoses {
    type: typeof SET_VACCINE_DOSES,
    payload: { vaccineDoses: KeyValuePair[] }
}

export type VaccineDosesActionTypes = SetVaccineDoses;

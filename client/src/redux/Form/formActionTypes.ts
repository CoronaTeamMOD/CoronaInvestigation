export const SET_FORM_STATE = 'SET_FORM_STATE';

interface setFormState {
    type: typeof SET_FORM_STATE,
    payload: {id : number, isValid: boolean}
}

export type formAction = setFormState; 
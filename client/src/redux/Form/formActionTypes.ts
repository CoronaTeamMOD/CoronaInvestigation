export const SET_FORM_STATE = 'SET_FORM_STATE';

interface SetFormState {
    type: typeof SET_FORM_STATE,
    payload: {investigationId : number, tabId : number, isValid: boolean}
}

export type formAction = SetFormState;
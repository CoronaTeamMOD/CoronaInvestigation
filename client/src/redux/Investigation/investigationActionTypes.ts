export const SET_CANT_REACH_INVESTIGATED = 'SET_CANT_REACH_INVESTIGATED';
export const SET_INVESTIGATED_PATIENT_ID = 'SET_INVESTIGATED_PATIENT_ID';


interface SetCantReachInvestigated {
    type: typeof SET_CANT_REACH_INVESTIGATED,
    payload: {cantReachInvestigated: boolean}
}

interface SetInvestigatedPatientId {
    type: typeof SET_INVESTIGATED_PATIENT_ID,
    payload: {investigatedPatientId: number}
}

export type InvestigationAction =  SetCantReachInvestigated | SetInvestigatedPatientId;

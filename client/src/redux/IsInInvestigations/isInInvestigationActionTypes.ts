export const SET_IS_IN_INVESTIGATION = 'SET_IS_IN_INVESTIGATION';

interface SetIsInInvestigation {
    type: typeof SET_IS_IN_INVESTIGATION,
    payload: { isInInvestigation: boolean }
}

export type IsInInvestigationAction = SetIsInInvestigation;

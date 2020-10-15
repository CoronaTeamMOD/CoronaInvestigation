import * as Actions from './isInInvestigationActionTypes';

const initialState: boolean = false

const isInInvestigationReducer = (state = initialState, action: Actions.IsInInvestigationAction): boolean => {
    switch (action.type) {
        case Actions.SET_IS_IN_INVESTIGATION: return action.payload.isInInvestigation

        default: return state;
    }
}

export default isInInvestigationReducer;

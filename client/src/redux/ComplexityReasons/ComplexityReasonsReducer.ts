import ComplexityReason from 'models/ComplexityReason';
import * as Actions from './ComplexityReasonsActionTypes';

const initialState: ComplexityReason[] = [];

const complexityReasonsReducer = (state = initialState, action: Actions.complexityReasonsAction) => {
    switch (action.type) {
        case Actions.SET_COMPLEXITY_REASONS:
            return action.payload.complexityReasons;
        default:
            return state;
    };
};

export default complexityReasonsReducer;
import * as Actions from './complexReasonsActionTypes';

const initialState: (number|null)[] = []

const complexReasonsReducer = (state = initialState, action: Actions.ComplexReasonsAction): (number|null)[] => {
    switch (action.type) {
        case Actions.SET_COMPLEX_REASONS: return action.payload.complexReasons

        default: return state;
    }
}

export default complexReasonsReducer;
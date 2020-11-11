import * as Actions from './statusesActionTypes';

const initialState: string[] = []

const statusesReducer = (state = initialState, action: Actions.StatusesAction): string[] => {
    switch (action.type) {
        case Actions.SET_STATUSES: return action.payload.statuses

        default: return state;
    }
}

export default statusesReducer;

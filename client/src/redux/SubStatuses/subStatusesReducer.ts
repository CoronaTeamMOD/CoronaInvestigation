import * as Actions from './subStatusesActionTypes';

const initialState: string[] = []

const subStatusesReducer = (state = initialState, action: Actions.SubStatusesAction): string[] => {
    switch (action.type) {
        case Actions.SET_SUB_STATUSES: return action.payload.subStatuses

        default: return state;
    }
}

export default subStatusesReducer;
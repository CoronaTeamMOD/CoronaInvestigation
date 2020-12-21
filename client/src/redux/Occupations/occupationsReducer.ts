import * as Actions from './occupationsActionTypes';

const initialState: string[] = [];

const occupationsReducer = (state = initialState, action: Actions.occupationsAction): string[] => {
    switch (action.type) {
        case Actions.SET_OCCUPATIONS: return action.payload.occupations

        default: return state;
    }
}

export default occupationsReducer;

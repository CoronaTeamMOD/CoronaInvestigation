import BorderCheckpoint from 'models/BorderCheckpoint';
import * as Actions from './BorderCheckpointsActionTypes';

const initialState: BorderCheckpoint[] = [];

const borderCheckpointsReducer = (state = initialState, action: Actions.BorderCheckpointsAction) => {
    switch (action.type) {
        case Actions.SET_BORDER_CHECKPOINTS:
            return action.payload.borderCheckpoints;
        default:
            return state;
    };
};

export default borderCheckpointsReducer;
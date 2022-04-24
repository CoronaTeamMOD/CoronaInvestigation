import BorderCheckpoint from 'models/BorderCheckpoint';
import * as actionTypes from './BorderCheckpointsActionTypes';

export const SetBorderCheckpoints = (borderCheckpoints: BorderCheckpoint[]) => {
    return {
        type: actionTypes.SET_BORDER_CHECKPOINTS,
        payload: { borderCheckpoints }
    };
}

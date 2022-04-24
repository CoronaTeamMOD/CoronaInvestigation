import KeyValuePair from 'models/KeyValuePair';
import * as actionTypes from './BorderCheckpointTypesActionTypes';

export const SetBorderCheckpointTypes = (borderCheckpointTypes: KeyValuePair[]) => {
    return {
        type: actionTypes.SET_BORDER_CHECKPOINT_TYPES,
        payload: { borderCheckpointTypes }
    };
}

import KeyValuePair from 'models/KeyValuePair';

export const SET_BORDER_CHECKPOINT_TYPES = 'SET_BORDER_CHECKPOINT_TYPES';

interface SetBorderCheckpointTypes {
    type: typeof SET_BORDER_CHECKPOINT_TYPES,
    payload: { borderCheckpointTypes: KeyValuePair[] }
}

export type BorderCheckpointTypesAction = SetBorderCheckpointTypes;

import BorderCheckpoint from "models/BorderCheckpoint";

export const SET_BORDER_CHECKPOINTS = 'SET_BORDER_CHECKPOINT';

interface SetBorderCheckpoints {
    type: typeof SET_BORDER_CHECKPOINTS,
    payload: { borderCheckpoints: BorderCheckpoint[] }
}

export type BorderCheckpointsAction = SetBorderCheckpoints;
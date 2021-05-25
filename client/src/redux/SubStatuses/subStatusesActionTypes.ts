import SubStatus from 'models/SubStatus';

export const SET_SUB_STATUSES = 'SET_SUB_STATUSES';

interface SetSubStatuses {
    type: typeof SET_SUB_STATUSES,
    payload: { subStatuses: SubStatus[] }
};

export type SubStatusesAction = SetSubStatuses;
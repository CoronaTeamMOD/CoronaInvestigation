export const SET_SUB_STATUSES = 'SET_SUB_STATUSES';

interface SetSubStatuses {
    type: typeof SET_SUB_STATUSES,
    payload: { subStatuses: string[] }
}

export type SubStatusesAction = SetSubStatuses;

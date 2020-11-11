export const SET_STATUSES = 'SET_STATUSES';

interface SetStatuses {
    type: typeof SET_STATUSES,
    payload: { statuses: string[] }
}

export type StatusesAction = SetStatuses;

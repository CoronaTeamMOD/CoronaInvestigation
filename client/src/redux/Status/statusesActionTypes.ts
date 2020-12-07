import InvestigationMainStatus from 'models/InvestigationMainStatus';

export const SET_STATUSES = 'SET_STATUSES';

interface SetStatuses {
    type: typeof SET_STATUSES,
    payload: { statuses: InvestigationMainStatus[] }
}

export type StatusesAction = SetStatuses;

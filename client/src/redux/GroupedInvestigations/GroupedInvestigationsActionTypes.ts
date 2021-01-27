import ConnectedInvestigationContact from 'models/GroupedInvestigationContacts/ConnectedInvestigationContact';

export const SET_GROUP_ID = 'SET_GROUP_ID';
export const SET_GROUPED_INVESTIGATIONS = 'SET_GROUPED_INVESTIGATIONS';
interface SetGroupId {
    type: typeof SET_GROUP_ID,
    payload: string
}

interface SetGroupedInvestigations {
    type: typeof SET_GROUPED_INVESTIGATIONS,
    payload: ConnectedInvestigationContact
}

export type GroupedInvestigationsAction = SetGroupId | SetGroupedInvestigations;

import KeyValuePair from 'models/KeyValuePair';

export const SET_INVESTIGATOR_REFERENCE_STATUSES = 'SET_INVESTIGATOR_REFERENCE_STATUSES';


interface SetInvestigatorReferenceStatuses {
    type: typeof SET_INVESTIGATOR_REFERENCE_STATUSES,
    payload: { investigatorReferenceStatuses: KeyValuePair[] }
}

export type InvestigatorReferenceStatusesAction = SetInvestigatorReferenceStatuses;


import KeyValuePair from 'models/KeyValuePair';
import * as actionTypes from './investigatorReferenceStatusesActionTypes';


export const setInvestigatorReferenceStatuses = (investigatorReferenceStatuses: KeyValuePair[]) => {
    return {
        type: actionTypes.SET_INVESTIGATOR_REFERENCE_STATUSES,
        payload: { investigatorReferenceStatuses }
    };
}

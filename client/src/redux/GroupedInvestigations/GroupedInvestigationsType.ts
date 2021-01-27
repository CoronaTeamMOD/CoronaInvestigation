import ConnectedInvestigationContact from 'models/GroupedInvestigationContacts/ConnectedInvestigationContact';

interface GroupedInvestigationReducerType {
    groupId : string | null,
    investigations : ConnectedInvestigationContact
}

export const initialState ={
    groupId : null,
    investigations : {
        investigationGroupReasonByReason: {
            displayName : "טוען..."
        },
        investigationsByGroupId: {
            nodes : []
        }
    }
};

export default GroupedInvestigationReducerType
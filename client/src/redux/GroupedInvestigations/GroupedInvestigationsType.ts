import ConnectedInvestigationContact from 'models/GroupedInvestigationContacts/ConnectedInvestigationContact';

interface GroupedInvestigationReducerType {
    groupId : string,
    investigations : ConnectedInvestigationContact
}

export const initialState : GroupedInvestigationReducerType ={
    groupId : '',
    investigations : {
        investigationGroupReasonByReason: {
            id: -1,
            displayName : 'טוען...'
        },
        investigationsByGroupId: {
            nodes : []
        }
    }
};

export default GroupedInvestigationReducerType
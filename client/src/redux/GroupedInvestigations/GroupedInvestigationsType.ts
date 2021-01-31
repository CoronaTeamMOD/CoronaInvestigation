import ConnectedInvestigationContact from 'models/GroupedInvestigationContacts/ConnectedInvestigationContact';

interface GroupedInvestigationReducerType {
    groupId : string,
    investigations : ConnectedInvestigationContact
}

export const initialState : GroupedInvestigationReducerType ={
    groupId : '',
    investigations : {
        investigationGroupReasonByReason: {
            displayName : 'טוען...'
        },
        investigationsByGroupId: {
            nodes : []
        }
    }
};

export default GroupedInvestigationReducerType
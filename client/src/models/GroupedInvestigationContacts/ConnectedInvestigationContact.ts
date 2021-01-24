import ConnectedInvestigation from './ConnectedInvestigation';

type ConnectedInvestigationContact = {
    otherReason?: string;
    investigationGroupReasonByReason: {
        displayName : string;
    }
    investigationsByGroupId: {
        nodes : ConnectedInvestigation[]
    }
}

export default ConnectedInvestigationContact;
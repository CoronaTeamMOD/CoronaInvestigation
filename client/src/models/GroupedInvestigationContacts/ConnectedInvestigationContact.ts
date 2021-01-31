import ConnectedInvestigation from './ConnectedInvestigation';

type ConnectedInvestigationContact = {
    otherReason?: string;
    investigationGroupReasonByReason: {
        id: number;
        displayName : string;
    }
    investigationsByGroupId: {
        nodes : ConnectedInvestigation[]
    }
}

export default ConnectedInvestigationContact;
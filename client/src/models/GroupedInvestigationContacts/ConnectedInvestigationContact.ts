import ConnectedInvestigation from './ConnectedInvestigation';

type ConnectedInvestigationContact = {
    investigationGroupReasonByReason: {
        displayName : string;
    }
    investigationsByGroupId: {
        nodes : ConnectedInvestigation[]
    }
}

export default ConnectedInvestigationContact;
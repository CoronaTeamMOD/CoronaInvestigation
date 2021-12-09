export interface InvesitgationInfoStatistics {
    inProcessInvestigations: number;
    newInvestigations: number;
    unallocatedInvestigations: number;
    transferRequestInvestigations: number;
    unusualInProgressInvestigations: number;
    unusualCompletedNoContactInvestigations: number;
    waitingForDetailsInvestigations: number;
    unallocatedDeskInvestigations:number;
    incompletedBotInvestigations:number;
};
interface InvesitgationStatistics extends InvesitgationInfoStatistics {
    allInvestigations: number;
};

export default InvesitgationStatistics;
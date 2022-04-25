export interface InvesitgationInfoStatistics {
    inProcessInvestigations: number;
    newInvestigations: number;
    unallocatedInvestigations: number;
    transferRequestInvestigations: number;
    unusualInProgressInvestigations: number;
    waitingForDetailsInvestigations: number;
    unallocatedDeskInvestigations:number;
};
interface InvesitgationStatistics extends InvesitgationInfoStatistics {
    allInvestigations: number;
};

export default InvesitgationStatistics;
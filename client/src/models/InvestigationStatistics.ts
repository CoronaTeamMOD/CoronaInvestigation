export interface InvesitgationInfoStatistics {
    inProcessInvestigations: number;
    newInvestigations: number;
    unassignedInvestigations: number;
    inactiveInvestigations: number;
    unallocatedInvestigations: number;
    transferRequestInvestigations: number;
}
interface InvesitgationStatistics extends InvesitgationInfoStatistics {
    allInvestigations: number;
    unusualInProgressInvestigations: number;
    unusualCompletedNoContactInvestigations: number;
    waitingForDetailsInvestigations: number;
}

export default InvesitgationStatistics;
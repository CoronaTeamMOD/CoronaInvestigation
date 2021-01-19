export interface InvesitgationInfoStatistics {
    inProcessInvestigations: number;
    newInvestigations: number;
    unassignedInvestigations: number;
    inactiveInvestigations: number;
}
interface InvesitgationStatistics extends InvesitgationInfoStatistics {
    allInvestigations: number;
    unallocatedInvestigations: number;
    unusualInProgressInvestigations: number;
    unusualCompletedNoContactInvestigations: number;
}

export default InvesitgationStatistics;
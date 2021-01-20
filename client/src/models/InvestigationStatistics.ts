export interface InvesitgationInfoStatistics {
    inProcessInvestigations: number;
    newInvestigations: number;
    unassignedInvestigations: number;
    inactiveInvestigations: number;
}
interface InvesitgationStatistics extends InvesitgationInfoStatistics {
    allInvestigations: number;
    unallocatedInvestigations: number;
    transferRequestInvestigations: number;
    waitingForDetailsInvestigations: number;
}

export default InvesitgationStatistics;
import InvestigationChart from 'models/InvestigationChart';
import FilterRulesDescription from 'models/enums/FilterRulesDescription';
import { InvesitgationInfoStatistics } from 'models/InvestigationStatistics';

const PRIMARY = '#1F78B4';
const SECONDARY = 'grey';
const DANGER = '#F95959';
const SUCCESS = '#33A02C';

export const convertorsToGraph: { [T in keyof InvesitgationInfoStatistics]: Omit<InvestigationChart, 'value'> } = {
    newInvestigations: {
        id: FilterRulesDescription.NEW,
        color: SECONDARY
    },
    inProcessInvestigations: {
        id: FilterRulesDescription.IN_PROCESS,
        color: SECONDARY,
    },
    unusualCompletedNoContactInvestigations: {
        id: FilterRulesDescription.UNUSUAL_COMPLETED_NO_CONTACT,
        color: SUCCESS,
        space: 1
    },
    unallocatedInvestigations: {
        id: FilterRulesDescription.UNALLOCATED,
        color: DANGER,
        secondary: SECONDARY
    },
    transferRequestInvestigations: {
        id: FilterRulesDescription.TRANSFER_REQUEST,
        color: DANGER,
        secondary: SECONDARY
    },
    waitingForDetailsInvestigations: {
        id: FilterRulesDescription.WAITING_FOR_DETAILS,
        color: DANGER,
        secondary: SECONDARY
    },
    unusualInProgressInvestigations: {
        id: FilterRulesDescription.UNUSUAL_IN_PROCESS,
        color: DANGER,
        secondary: SECONDARY
    },
};
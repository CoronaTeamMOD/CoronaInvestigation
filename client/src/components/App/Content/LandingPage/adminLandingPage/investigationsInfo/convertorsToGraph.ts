
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
        color: PRIMARY
    },
    inProcessInvestigations: {
        id: FilterRulesDescription.IN_PROCESS,
        color: SECONDARY,
        space: 2
    },
    unallocatedInvestigations: {
        id: FilterRulesDescription.UNALLOCATED,
        color: DANGER
    },
    transferRequestInvestigations: {
        id: FilterRulesDescription.TRANSFER_REQUEST,
        color: DANGER
    },
    waitingForDetailsInvestigations: {
        id: FilterRulesDescription.WAITING_FOR_DETAILS,
        color: DANGER
    },
    unusualInProgressInvestigations: {
        id: FilterRulesDescription.UNUSUAL_IN_PROCESS,
        color: DANGER
    },
    unusualCompletedNoContactInvestigations: {
        id: FilterRulesDescription.UNUSUAL_COMPLETED_NO_CONTACT,
        color: SUCCESS
    },
};
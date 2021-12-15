import FilterRulesDescription from 'models/enums/FilterRulesDescription';
import InvestigationSubStatusCodes from 'models/enums/InvestigationSubStatusCodes'
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';

const FOUR_HOURS_IN_MS = 4 * 60 * 60 * 1000;
const statusToFilterConvertor = {
    [FilterRulesDescription.NEW]: {
        statusFilter: [InvestigationMainStatusCodes.NEW]
    },
    [FilterRulesDescription.IN_PROCESS]: {
        statusFilter: [InvestigationMainStatusCodes.IN_PROCESS]
    },
    [FilterRulesDescription.UNALLOCATED]: {
        statusFilter: [InvestigationMainStatusCodes.NEW,InvestigationMainStatusCodes.IN_PROCESS],
        inactiveUserFilter: true,
        unassignedUserFilter: true
    },
    [FilterRulesDescription.TRANSFER_REQUEST]: {
        subStatusFilter: [InvestigationSubStatusCodes.TRANSFER_REQUEST]
    },
    [FilterRulesDescription.WAITING_FOR_DETAILS]: {
        subStatusFilter: [InvestigationSubStatusCodes.WAITING_FOR_DETAILS]
    },
    [FilterRulesDescription.UNUSUAL_IN_PROCESS]: {
        statusFilter: [InvestigationMainStatusCodes.IN_PROCESS],
        updateDateFilter: new Date(Date.now() - FOUR_HOURS_IN_MS).toUTCString()
    },
    [FilterRulesDescription.UNUSUAL_COMPLETED_NO_CONTACT]: {
        statusFilter: [InvestigationMainStatusCodes.DONE],
        nonContactFilter: true
    },
    [FilterRulesDescription.UNALLOCATED_DESK]: {
        statusFilter: [InvestigationMainStatusCodes.NEW,InvestigationMainStatusCodes.IN_PROCESS],
        unallocatedDeskFilter:true
    },
    [FilterRulesDescription.INCOMPLETED_BOT_INVESTIGATIONS]: {
        incompletedBotInvestigationFilter:true
    },
}

export default statusToFilterConvertor;
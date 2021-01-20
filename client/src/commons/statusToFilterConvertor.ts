import FilterRulesDescription from 'models/enums/FilterRulesDescription';
import InvestigationSubStatusCodes from 'models/enums/InvestigationSubStatusCodes'
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';

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
    [FilterRulesDescription.UNASSIGNED]: {
        unassignedUserFilter: true
    },
    [FilterRulesDescription.INACTIVE]: {
        inactiveUserFilter: true,
        unassignedUserFilter: false
    },
    [FilterRulesDescription.UNUSUAL_IN_PROCESS]: {
        statusFilter: [InvestigationMainStatusCodes.IN_PROCESS],
        updateDateFilter: new Date(Date.now() - (4 * 60 * 60 * 1000)).toUTCString(),
        subStatusFilter: [InvestigationSubStatusCodes.TRANSFER_REQUEST,
                          InvestigationSubStatusCodes.WAITING_FOR_DETAILS,
                          InvestigationSubStatusCodes.WAITING_FOR_RESPONSE]
    },
    [FilterRulesDescription.UNUSUAL_COMPLETED_NO_CONTACT]: {
        statusFilter: [InvestigationMainStatusCodes.DONE],
        nonContactFilter: true
    },
}

export default statusToFilterConvertor;
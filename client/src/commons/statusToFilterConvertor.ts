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
}

export default statusToFilterConvertor;
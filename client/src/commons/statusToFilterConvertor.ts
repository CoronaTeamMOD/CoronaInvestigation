import FilterRulesDescription from 'models/enums/FilterRulesDescription';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';

const statusToFilterConvertor = {
    [FilterRulesDescription.NEW]: {
        statusFilter: [InvestigationMainStatusCodes.NEW]
    },
    [FilterRulesDescription.IN_PROCESS]: {
        statusFilter: [InvestigationMainStatusCodes.IN_PROCESS]
    },
    [FilterRulesDescription.UNALLOCATED]: {
        inactiveUserFilter: true,
        unassignedUserFilter: true
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
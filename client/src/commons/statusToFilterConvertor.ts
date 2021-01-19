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
        statusFilter: [InvestigationMainStatusCodes.NEW,InvestigationMainStatusCodes.IN_PROCESS],
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
    [FilterRulesDescription.UNUSUAL_IN_PROCESS]: {
        statusFilter: [InvestigationMainStatusCodes.IN_PROCESS],
        updateDateFilter: new Date(Date.now() - (4 * 60 * 60 * 1000)).toUTCString()
    },
}

export default statusToFilterConvertor;
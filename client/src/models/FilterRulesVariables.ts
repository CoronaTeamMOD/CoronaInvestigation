import { TimeRange } from './TimeRange';

interface FilterRulesVariables {
    deskFilter?: number[],
    statusFilter?: number[],
    unassignedUserFilter?: boolean,
    inactiveUserFilter?: boolean,
    searchQuery?: string,
    timeRangeFilter?: TimeRange,
    updateDateFilter?: string,
}

export default FilterRulesVariables;
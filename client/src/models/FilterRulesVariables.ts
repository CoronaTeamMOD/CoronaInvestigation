import { TimeRange } from './TimeRange';

interface FilterRulesVariables {
    deskFilter?: number[],
    statusFilter?: number[],
    unassignedUserFilter?: boolean,
    inactiveUserFilter?: boolean,
    searchQuery?: string,
    timeRangeFilter?: TimeRange,
}

export default FilterRulesVariables;
import { TimeRange } from './TimeRange';

interface FilterRulesVariables {
    deskFilter?: number[],
    statusFilter?: number[],
    subStatusFilter?: string[],
    unassignedUserFilter?: boolean,
    inactiveUserFilter?: boolean,
    searchQuery?: string,
    timeRangeFilter?: TimeRange,
    updateDateFilter?: string,
    nonContactFilter?: boolean,
    incompletedBotInvestigationFilter?:boolean,
}

export default FilterRulesVariables;
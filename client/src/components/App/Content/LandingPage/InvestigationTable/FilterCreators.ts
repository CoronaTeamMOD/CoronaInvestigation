import { TimeRange } from 'models/TimeRange';
import FilterRulesVariables from 'models/FilterRulesVariables';
import InvestigationsFilterByFields from 'models/enums/InvestigationsFilterByFields';

const unassignedUserName = 'לא משויך';
const numericRegex: RegExp = /^([\d]+)$/;

const filterCreators: { [T in InvestigationsFilterByFields]: ((values: any) => Exclude<any, void>) } = {
    [InvestigationsFilterByFields.STATUS]: (values: string[]) => {
        return values.length > 0 ?
            { investigationStatus: { in: values } }
            :
            {};
    },
    [InvestigationsFilterByFields.DESK_ID]: (deskIds: number[]) => {
        if (deskIds.includes(-1)) {
            return {
                or: [
                    { deskId: { in: deskIds.filter(deskId => deskId !== -1) } },
                    { deskId: { isNull: true } }
                ]
            }
        }

        return deskIds.length > 0 ?
            { deskId: { in: deskIds } }
            :
            {};
    },
    [InvestigationsFilterByFields.NUMERIC_PROPERTIES]: (values: string) => {
        return Boolean(values) ?
            {
                or: [
                    { epidemiologyNumber: { equalTo: Number(values) } },
                    { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { primaryPhone: { includes: values } } } },
                    { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { identityNumber: { includes: values } } } }
                ]
            } :
            {}
    },
    [InvestigationsFilterByFields.APLHA_NUMERIC_PROPERTIES]: (values: string) => {
        return Boolean(values) ?
            {
                or: [
                    { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { fullName: { includes: values } } } },
                    { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { identityNumber: { includes: values } } } }
                ]
            } :
            {}
    },
    [InvestigationsFilterByFields.UNASSIGNED_USER]: (isFilterOn: boolean) => {
        return isFilterOn ?
            { userName: {equalTo: unassignedUserName} }
            :
            {};
    },
    [InvestigationsFilterByFields.INACTIVE_USER]: (isFilterOn: boolean) => {
        return isFilterOn ?
            { 
                isActive: {equalTo: false},
                userName: {notEqualTo:unassignedUserName}
            }
            :
            {};
    },
    [InvestigationsFilterByFields.UNALLOCATED_USER]: (isFilterOn: boolean) => {
        return isFilterOn ?
            {
                or: [
                    {isActive: {equalTo: false}},
                    {userName: {equalTo:unassignedUserName}}
                ]
            }
            :
            {};
    },
    [InvestigationsFilterByFields.TIME_RANGE]: (timeRangeFilter: TimeRange) => {
        if (timeRangeFilter.id === 10) {
            return {};
        } else if (timeRangeFilter) {
            return { creationDate: { greaterThanOrEqualTo: timeRangeFilter.startDate, lessThanOrEqualTo: timeRangeFilter.endDate }} 
        } else {
            return {}
        }
    },
};

export const buildFilterRules = (filterRulesVariables: FilterRulesVariables) => {

    const { deskFilter, statusFilter, unassignedUserFilter, inactiveUserFilter, searchQuery, timeRangeFilter } = filterRulesVariables;

    const searchQueryFilter = searchQuery ? numericRegex.test(searchQuery) ? filterCreators.NUMERIC_PROPERTIES(searchQuery) : filterCreators.APLHA_NUMERIC_PROPERTIES(searchQuery) : {};

    const userByCreator = (unassignedUserFilter && inactiveUserFilter) ?
        filterCreators.UNALLOCATED_USER(unassignedUserFilter && inactiveUserFilter)
        : {
            ...filterCreators.UNASSIGNED_USER(unassignedUserFilter),
            ...filterCreators.INACTIVE_USER(inactiveUserFilter),
        }

    return {
        ...filterCreators.DESK_ID(deskFilter),
        ...filterCreators.STATUS(statusFilter),
        userByCreator,
        ...searchQueryFilter,
        ...filterCreators.TIME_RANGE(timeRangeFilter),
    }
}

export default filterCreators;

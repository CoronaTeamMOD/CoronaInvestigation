import { TimeRange } from 'models/TimeRange';
import FilterRulesVariables from 'models/FilterRulesVariables';
import InvestigationsFilterByFields from 'models/enums/InvestigationsFilterByFields';

const unassignedUserName = 'לא משויך';
const phoneAndIdentityNumberRegex = /^([\d]+)$/;
const fullNameRegex = /^[\u0590-\u05fe\s]*$/;

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
    [InvestigationsFilterByFields.FULL_NAME]: (values: string) => {
        return Boolean(values) ?
            { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { fullName: { includes: values } } } } :
            {};
    },
    [InvestigationsFilterByFields.NUMERIC_PROPERTIES]: (values: string) => {
        return Boolean(values) ?
            {
                or: [
                    { epidemiologyNumber: { equalTo: Number(values) } },
                    { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { primaryPhone: { includes: values } } } }
                ]
            } :
            {}
    },
    [InvestigationsFilterByFields.IDENTITY_NUMBER]: (values: string) => {
        return Boolean(values) ?
            {
                or: [
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

    const searchQueryFilter = searchQuery ? phoneAndIdentityNumberRegex.test(searchQuery) ? filterCreators.NUMERIC_PROPERTIES(searchQuery) : fullNameRegex.test(searchQuery) ? filterCreators.FULL_NAME(searchQuery) : filterCreators.IDENTITY_NUMBER(searchQuery) : {};

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
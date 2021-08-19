import { TimeRange } from 'models/TimeRange';
import { NUMERIC_REGEX } from 'commons/Regex/Regex';
import InvestigationsFilterByFields from 'models/enums/InvestigationsFilterByFields';

import { allTimeRangeId } from '../adminLandingPage/useAdminLandingPage';

const unassignedUserName = 'לא משויך';

export const filterCreators: { [T in InvestigationsFilterByFields]: ((values: any) => Exclude<any, void>) } = {
    [InvestigationsFilterByFields.STATUS]: (values: string[]) => {
        return values.length > 0 ?
            { [InvestigationsFilterByFields.STATUS]: { investigationStatus: { in: values } } }
            :
            { [InvestigationsFilterByFields.STATUS]: null }
    },
    [InvestigationsFilterByFields.SUB_STATUS]: (values: string[]) => {
        return values.length > 0 ?
            { [InvestigationsFilterByFields.SUB_STATUS]: { investigationSubStatus: { in: values } } }
            :
            { [InvestigationsFilterByFields.SUB_STATUS]: null }
    },
    [InvestigationsFilterByFields.DESK_ID]: (deskIds: (number | null)[]) => {
        if (deskIds.includes(null)) {
            return {
                [InvestigationsFilterByFields.DESK_ID]: {
                    or: [
                        { deskId: { in: deskIds.filter(deskId => deskId !== null) } },
                        { deskId: { isNull: true } }
                    ]
                }
            }
        }

        return deskIds.length > 0 ?
            { [InvestigationsFilterByFields.DESK_ID]: { deskId: { in: deskIds } } }
            :
            { [InvestigationsFilterByFields.DESK_ID]: null };
    },
    [InvestigationsFilterByFields.SEARCH_BAR]: (value: string) => {
        return Boolean(value) ?
            NUMERIC_REGEX.test(value) ?
                {
                    [InvestigationsFilterByFields.SEARCH_BAR]: {
                        or: [
                            { epidemiologyNumber: { equalTo: Number(value) } },
                            { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { primaryPhone: { includes: value } } } },
                            { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { identityNumber: { includes: value } } } }
                        ]
                    }
                }
                :
                {
                    [InvestigationsFilterByFields.SEARCH_BAR]: {
                        investigatedPatientByInvestigatedPatientId: {
                            covidPatientByCovidPatient: { fullName: { includes: value } }
                        }
                    }
                }
            :
            { [InvestigationsFilterByFields.SEARCH_BAR]: null }
    },
    [InvestigationsFilterByFields.UNASSIGNED_USER]: (isFilterOn: boolean) => {
        return isFilterOn ?
            {
                [InvestigationsFilterByFields.UNASSIGNED_USER]: {
                    userByCreator: { userName: { equalTo: unassignedUserName } }
                }
            }
            :
            { [InvestigationsFilterByFields.UNASSIGNED_USER]: null };
    },
    [InvestigationsFilterByFields.INACTIVE_USER]: (isFilterOn: boolean) => {
        return isFilterOn ?
            {
                [InvestigationsFilterByFields.INACTIVE_USER]: {
                    userByCreator: {
                        isActive: { equalTo: false },
                        userName: { notEqualTo: unassignedUserName }
                    }
                }
            }
            :
            { [InvestigationsFilterByFields.INACTIVE_USER]: null };
    },
    [InvestigationsFilterByFields.UNALLOCATED_USER]: (isFilterOn: boolean) => {
        return isFilterOn ?
            {
                [InvestigationsFilterByFields.UNALLOCATED_USER]: {
                    userByCreator: {
                        or: [
                            { isActive: { equalTo: false } },
                            { userName: { equalTo: unassignedUserName } }
                        ]
                    }
                }
            }
            :
            { [InvestigationsFilterByFields.UNALLOCATED_USER]: null };
    },
    [InvestigationsFilterByFields.TIME_RANGE]: (timeRangeFilter: TimeRange) => {
        if (!allTimeRangeId.includes(timeRangeFilter.id)) {
            return {
                [InvestigationsFilterByFields.TIME_RANGE]: {
                    creationDate: {
                        greaterThanOrEqualTo: timeRangeFilter.startDate,
                        lessThanOrEqualTo: timeRangeFilter.endDate
                    }
                }
            };
        } else {
            return { [InvestigationsFilterByFields.TIME_RANGE]: null }
        }
    },
    [InvestigationsFilterByFields.UNUSUAL_IN_PROGRESS]: (dateFilter: string) => {
        return dateFilter ? { [InvestigationsFilterByFields.UNUSUAL_IN_PROGRESS]: { 
            startTime: {
                lessThan: dateFilter
            }
        } } :  { [InvestigationsFilterByFields.UNUSUAL_IN_PROGRESS]: null };
    },
    [InvestigationsFilterByFields.UNUSUAL_COMPLETED_NO_CONTACT]: (isNonContact: boolean) => {
        return isNonContact ? { [InvestigationsFilterByFields.UNUSUAL_COMPLETED_NO_CONTACT]: { 
            contactEventsByInvestigationId: {
                every: {
                  contactedPeopleByContactEvent: {
                    every: {
                      contactEvent:{
                        isNull:true
                      }
                    }
                  }
                }
              }
        } } :  { [InvestigationsFilterByFields.UNUSUAL_COMPLETED_NO_CONTACT]: null };
    },
    [InvestigationsFilterByFields.UNALLOCATED_DESK]: (isFilterOn: boolean) => {
        return isFilterOn ?
            {
                [InvestigationsFilterByFields.UNALLOCATED_DESK]: {
                   deskId: { isNull: true } 
                }
            }
            :
            { [InvestigationsFilterByFields.UNALLOCATED_DESK]: null };
    }, 
};

export default filterCreators;
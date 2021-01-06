import { TimeRange } from 'models/TimeRange';
import InvestigationsFilterByFields from 'models/enums/InvestigationsFilterByFields';

import { allTimeRangeId } from '../adminLandingPage/useAdminLandingPage';

const unassignedUserName = 'לא משויך';
const numericRegex: RegExp = /^([\d]+)$/;

export const filterCreators: { [T in InvestigationsFilterByFields]: ((values: any) => Exclude<any, void>) } = {
    [InvestigationsFilterByFields.STATUS]: (values: string[]) => {
        return values.length > 0 ?
            { [InvestigationsFilterByFields.STATUS]: { investigationStatus: { in: values } } }    
            : 
            { [InvestigationsFilterByFields.STATUS]: null }
    },
    [InvestigationsFilterByFields.DESK_ID]: (deskIds: number[]) => {
        if (deskIds.includes(-1)) {
            return {
                [InvestigationsFilterByFields.DESK_ID]: {
                    or: [
                        { deskId: { in: deskIds.filter(deskId => deskId !== -1) } },
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
            numericRegex.test(value) ?
                {
                    [InvestigationsFilterByFields.SEARCH_BAR]: {
                        or: [
                            { epidemiologyNumber: { equalTo: Number(value) } },
                            { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { primaryPhone: { includes: value } } } },
                            { investigatedPatientByInvestigatedPatientId: { covidPatientByCovidPatient: { identityNumber: { includes: value } } } }
                        ]
                    }
                } :
                { 
                    [InvestigationsFilterByFields.SEARCH_BAR]: {
                        investigatedPatientByInvestigatedPatientId: {
                            covidPatientByCovidPatient: { fullName: { includes: value } } 
                        } 
                    } 
                } 
            :
            { [InvestigationsFilterByFields.SEARCH_BAR]: null  }
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
        if (timeRangeFilter.id !== allTimeRangeId) {
            return { [InvestigationsFilterByFields.TIME_RANGE]: { 
                creationDate: { 
                    greaterThanOrEqualTo: timeRangeFilter.startDate,
                    lessThanOrEqualTo: timeRangeFilter.endDate } 
                }
            } ;
        } else {
            return { [InvestigationsFilterByFields.TIME_RANGE]: null }
        }
    }  
};

export default filterCreators;
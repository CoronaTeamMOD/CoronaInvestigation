import { TimeRange } from 'models/TimeRange';
import { NUMERIC_REGEX } from 'commons/Regex/Regex';
import InvestigationsFilterByFields from 'models/enums/InvestigationsFilterByFields';

import { allTimeRangeId } from '../adminLandingPage/useAdminLandingPage';
import InvestigatorReferenceStatusCode from 'models/enums/InvestigatorReferenceStatusCode';
import ChatStatusCode from 'models/enums/ChatStatusCodes';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';
import BotProperties from 'models/enums/BotProperties';
import InvestigationComplexityCodes from 'models/enums/InvestigationComplexityCodes';
import { AgeRange } from 'models/AgeRange';
import { AgeRangeCodes } from 'models/enums/AgeRange';
import { addYears, format } from 'date-fns';

const unassignedUserName = 'לא משויך';

const TEN_HOURS_IN_MS = 10 * 60 * 60 * 1000;
const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;

const OVERTIME_OF_NEW_BOT_INVESTIGATION = TEN_HOURS_IN_MS;
const OVERTIME_OF_IN_PROGRESS_BOT_INVESTIGATION = TWO_HOURS_IN_MS;

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
        return dateFilter ? {
            [InvestigationsFilterByFields.UNUSUAL_IN_PROGRESS]: {
                startTime: {
                    lessThan: dateFilter
                }
            }
        } : { [InvestigationsFilterByFields.UNUSUAL_IN_PROGRESS]: null };
    },
    [InvestigationsFilterByFields.UNUSUAL_COMPLETED_NO_CONTACT]: (isNonContact: boolean) => {
        return isNonContact ? {
            [InvestigationsFilterByFields.UNUSUAL_COMPLETED_NO_CONTACT]: {
                contactEventsByInvestigationId: {
                    every: {
                        contactedPeopleByContactEvent: {
                            every: {
                                contactEvent: {
                                    isNull: true
                                }
                            }
                        }
                    }
                }
            }
        } : { [InvestigationsFilterByFields.UNUSUAL_COMPLETED_NO_CONTACT]: null };
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
    [InvestigationsFilterByFields.CHAT_STATUS]: (values: string[]) => {
        if (values.length > 0) {
            if (values.findIndex(val => val == ChatStatusCode.IRRELEVANT.toString()) > -1) {
                return {
                    [InvestigationsFilterByFields.CHAT_STATUS]: {
                        or: [
                            {
                                botInvestigationByEpidemiologyNumber: {
                                    chatStatusId: { in: values }
                                }
                            },
                            { botInvestigationByEpidemiologyNumberExists: false }
                        ]
                    }
                };
            }
            else {
                return {
                    [InvestigationsFilterByFields.CHAT_STATUS]: {
                        botInvestigationByEpidemiologyNumber: {
                            chatStatusId: { in: values }
                        }
                    }
                }
            };
        }
        else return { [InvestigationsFilterByFields.CHAT_STATUS]: null };
    },
    [InvestigationsFilterByFields.INVESTIGATOR_REFERENCE_STATUS]: (values: string[]) => {
        if (values.length > 0) {
            if (values.findIndex(val => val == InvestigatorReferenceStatusCode.IRRELEVANT.toString()) > -1) {
                return {
                    [InvestigationsFilterByFields.INVESTIGATOR_REFERENCE_STATUS]: {
                        or: [
                            {
                                botInvestigationByEpidemiologyNumber: {
                                    investigatorReferenceStatusId: { in: values }
                                }
                            },
                            { botInvestigationByEpidemiologyNumberExists: false }
                        ]
                    }
                };
            }
            else {
                return {
                    [InvestigationsFilterByFields.INVESTIGATOR_REFERENCE_STATUS]: {
                        botInvestigationByEpidemiologyNumber: {
                            investigatorReferenceStatusId: { in: values }
                        }
                    }
                }
            };
        }
        else return { [InvestigationsFilterByFields.INVESTIGATOR_REFERENCE_STATUS]: null };
    },
    [InvestigationsFilterByFields.INVESTIGATIONS_WERENT_SENT_TO_BOT]: (isFilterOn: boolean) => {
        return isFilterOn ?
            {
                [InvestigationsFilterByFields.INVESTIGATIONS_WERENT_SENT_TO_BOT]: {
                    or: [
                        {
                            botInvestigationByEpidemiologyNumber: {
                                chatStatusId: {
                                    in: [
                                        ChatStatusCode.KOSHER_PHONE_NUMBER,
                                        ChatStatusCode.INVALID_PHONE_NUMBER,
                                        ChatStatusCode.IRRELEVANT
                                    ]
                                }
                            }
                        },
                        { botInvestigationByEpidemiologyNumberExists: false }
                    ]
                },
            }
            :
            { [InvestigationsFilterByFields.INVESTIGATIONS_WERENT_SENT_TO_BOT]: null };
    },
    [InvestigationsFilterByFields.INCOMPLETED_BOT_INVESTIGATION]: (isFilterOn: boolean) => {
        return isFilterOn ?
            {
                [InvestigationsFilterByFields.INCOMPLETED_BOT_INVESTIGATION]: {
                    or: [
                        {
                            botInvestigationByEpidemiologyNumber: {
                                chatStatusId: {
                                    in: [
                                        ChatStatusCode.NO_WHATSAPP,
                                        ChatStatusCode.NO_COOPERATION,
                                        ChatStatusCode.HUMAN_INVESTIGATION_REQUEST,
                                        ChatStatusCode.WRONG_CHAT_DETAILS,
                                        ChatStatusCode.HUMAN_INVESTIGATION_PREFERNCE,
                                        ChatStatusCode.HUMAN_INVESTIGATION_REQUIRED
                                    ]
                                }
                            },
                            investigationStatus: {
                                in:
                                    [
                                        InvestigationMainStatusCodes.NEW
                                    ]
                            }
                        },
                        {
                            botInvestigationByEpidemiologyNumber: {
                                lastChatDate: { lessThan: new Date(Date.now() - OVERTIME_OF_NEW_BOT_INVESTIGATION).toUTCString() }
                            },
                            botInvestigationByEpidemiologyNumberExists: true,
                            investigationStatus: { in: [InvestigationMainStatusCodes.NEW] },
                        },
                        {
                            botInvestigationByEpidemiologyNumber: {
                                lastChatDate: { lessThan: new Date(Date.now() - OVERTIME_OF_IN_PROGRESS_BOT_INVESTIGATION).toUTCString() }
                            },
                            investigationStatus: { in: [InvestigationMainStatusCodes.IN_PROCESS] },
                            lastUpdatorUser: { equalTo: BotProperties.BOT_USER }
                        },
                        {
                            botInvestigationByEpidemiologyNumber: {
                                investigatorReferenceStatusId: {
                                    in: [
                                        InvestigatorReferenceStatusCode.NEW,
                                        InvestigatorReferenceStatusCode.IN_PROCESS
                                    ]
                                }
                            },
                            investigationStatus: { in: [InvestigationMainStatusCodes.DONE] }
                        }
                    ]
                }
            }
            :
            {
                [InvestigationsFilterByFields.INCOMPLETED_BOT_INVESTIGATION]: null
            }
    },
    [InvestigationsFilterByFields.COMPLEXITY]: (isFilterOn: boolean) => {
        return isFilterOn ?
            {
                [InvestigationsFilterByFields.COMPLEXITY]: {
                    complexityCode: { equalTo: InvestigationComplexityCodes.COMPLEX }
                }
            }
            :
            {
                [InvestigationsFilterByFields.COMPLEXITY]: null,
                [InvestigationsFilterByFields.COMPLEXITY_REASON]:null
            }
    },
    [InvestigationsFilterByFields.COMPLEXITY_REASON]: (values: string[]) => {
        return (values.length > 0) ?
            {
                [InvestigationsFilterByFields.COMPLEXITY_REASON]: {
                    complexityReasonsId: { overlaps: values }
                }
            }
            : { [InvestigationsFilterByFields.COMPLEXITY_REASON]: null }
    },
    [InvestigationsFilterByFields.AGE]: (ageFilter: AgeRange) => {
        if (ageFilter.id == AgeRangeCodes.NO_AGE) {
            return {
                [InvestigationsFilterByFields.AGE]: {
                    investigatedPatientByInvestigatedPatientId:
                        { covidPatientByCovidPatient: { birthDate: { isNull: true } } }
                }
            };
        }
        else if (ageFilter.id == AgeRangeCodes.RANGE) {
            const maxDate = format(addYears(new Date(), (ageFilter.ageFrom != null) ? -ageFilter.ageFrom : 0), 'yyyy-MM-dd') + 'T00:00:00'
            const minDate = format(addYears(new Date(), (ageFilter.ageTo != null) ? -ageFilter.ageTo - 1 : 0), 'yyyy-MM-dd') + 'T00:00:00';
            return {
                [InvestigationsFilterByFields.AGE]:
                {
                    investigatedPatientByInvestigatedPatientId:
                    {
                        covidPatientByCovidPatient:
                            { birthDate: { greaterThan: minDate }, and: { birthDate: { lessThanOrEqualTo: maxDate } } }
                    }
                }
            };
        }
        else return {
            [InvestigationsFilterByFields.AGE]: null
        };
    },
    [InvestigationsFilterByFields.VACCINE_DOSE]: (values: string[]) => {
        return (values.length > 0) ?
        {
            [InvestigationsFilterByFields.VACCINE_DOSE]: {
                vaccineDoseId: { in: values }
            }
        }
        : { [InvestigationsFilterByFields.VACCINE_DOSE]: null }
    }
};

export default filterCreators;
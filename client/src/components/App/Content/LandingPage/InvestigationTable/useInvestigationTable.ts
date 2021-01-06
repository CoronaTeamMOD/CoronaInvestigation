import axios from 'axios';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useEffect, useState, useRef, useMemo } from 'react';

import Desk from 'models/Desk';
import User from 'models/User';
import County from 'models/County';
import logger from 'logger/logger';
import { persistor } from 'redux/store';
import { Severity } from 'models/Logger';
import { TimeRange } from 'models/TimeRange';
import userType from 'models/enums/UserType';
import Investigator from 'models/Investigator';
import StoreStateType from 'redux/storeStateType';
import { BC_TABS_NAME } from 'models/BroadcastMessage';
import usePageRefresh from 'Utils/vendor/usePageRefresh';
import InvestigatorOption from 'models/InvestigatorOption';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import InvestigationTableRow from 'models/InvestigationTableRow';
import InvestigationMainStatus from 'models/InvestigationMainStatus';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import InvestigationsFilterByFields from 'models/enums/InvestigationsFilterByFields';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';
import { setLastOpenedEpidemiologyNum } from 'redux/Investigation/investigationActionCreators';
import { setInvestigationStatus, setCreator } from 'redux/Investigation/investigationActionCreators';
import { setAxiosInterceptorId } from 'redux/Investigation/investigationActionCreators';

import useStyle from './InvestigationTableStyles';
import { allTimeRangeId } from '../adminLandingPage/useAdminLandingPage';
import { filterCreators } from './FilterCreators';
import { defaultOrderBy, rowsPerPage, defaultPage } from './InvestigationTable';
import {
    TableHeadersNames,
    IndexedInvestigationData,
    investigatorIdPropertyName,
    TableKeys,
    HiddenTableKeys
} from './InvestigationTablesHeaders';
import { DeskFilter, HistoryState, StatusFilter, useInvestigationTableOutcome, useInvestigationTableParameters } from './InvestigationTableInterfaces';
import { defaultTimeRange } from '../adminLandingPage/TimeRangeFilterCard/useTimeRangeFilterCard';

const investigationURL = '/investigation';
const getFlooredRandomNumber = (min: number, max: number): number => (
    Math.floor(Math.random() * (max - min) + min)
)

export const createRowData = (
    epidemiologyNumber: number,
    coronaTestDate: string,
    isComplex: boolean,
    priority: number,
    mainStatus: InvestigationMainStatus,
    subStatus: string,
    fullName: string,
    phoneNumber: string,
    age: number,
    city: string,
    investigationDesk: string,
    county: County,
    investigator: Investigator,
    comment: string,
    statusReason: string,
    wasInvestigationTransferred: boolean,
    transferReason: string,
    groupId: string,
    canFetchGroup: boolean,
    groupReason: string,
    otherReason: string,
    reasonId: number,
    subOccupation: string,
    parentOccupation: string,
    isInInstitute: boolean,
    creationDate: Date,
    startTime: Date,
    isSelfInvestigated: boolean,
    selfInvestigationStatus: number,
    selfInvestigationUpdateTime: string
): InvestigationTableRow => ({
    isChecked: false,
    epidemiologyNumber,
    coronaTestDate,
    isComplex,
    priority,
    mainStatus,
    subStatus,
    fullName,
    phoneNumber,
    age,
    city,
    investigationDesk,
    county,
    investigator,
    comment,
    statusReason,
    wasInvestigationTransferred,
    transferReason,
    groupId,
    canFetchGroup,
    groupReason,
    otherReason,
    reasonId,
    subOccupation,
    parentOccupation,
    isInInstitute,
    creationDate,
    startTime,
    isSelfInvestigated,
    selfInvestigationStatus,
    selfInvestigationUpdateTime
});

export interface SelectedRow {
    epidemiologyNumber: number;
    groupId: string;
}

export const DEFAULT_SELECTED_ROW: SelectedRow = {
    epidemiologyNumber: -1,
    groupId: ''
};

const TABLE_REFRESH_INTERVAL = 30;
const FETCH_ERROR_TITLE = 'אופס... לא הצלחנו לשלוף';
const UPDATE_ERROR_TITLE = 'לא הצלחנו לעדכן את החקירה';
const OPEN_INVESTIGATION_ERROR_TITLE = 'לא הצלחנו לפתוח את החקירה';
export const transferredSubStatus = 'נדרשת העברה';

const welcomeMessage = 'היי, אלו הן החקירות שהוקצו לך היום. בואו נקטע את שרשראות ההדבקה!';
const noInvestigationsMessage = 'היי,אין חקירות לביצוע!';

const useInvestigationTable = (parameters: useInvestigationTableParameters): useInvestigationTableOutcome => {
    const { setSelectedRow, setAllCounties, setAllStatuses, setAllDesks, currentPage, setCurrentPage, setAllGroupedInvestigations, allGroupedInvestigations,
        investigationColor } = parameters;

    const classes = useStyle(false);
    const { alertError } = useCustomSwal();
    const history = useHistory<HistoryState>();

    const { statusFilter: historyStatusFilter = [], 
            deskFilter: historyDeskFilter = [], 
            timeRangeFilter: historyTimeRange = defaultTimeRange,
            inactiveUserFilter : historyInactiveUserFilter = false, 
            unassignedUserFilter : historyUnassignedUserFilter = false,
            isAdminLandingRedirect : historyisAdminLandingRedirect = false,
            filterTitle} = useMemo(() => {
        const { location: { state } } = history;
        return state || {};
    }, []);

    const [rows, setRows] = useState<InvestigationTableRow[]>([]);
    const [isDefaultOrder, setIsDefaultOrder] = useState<boolean>(true);
    const [orderBy, setOrderBy] = useState<string>(defaultOrderBy);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [unassignedInvestigationsCount, setUnassignedInvestigationsCount] = useState<number>(0);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>(historyStatusFilter);
    const [deskFilter, setDeskFilter] = useState<DeskFilter>(historyDeskFilter);
    const [timeRangeFilter, setTimeRangeFilter] = useState<TimeRange>(historyTimeRange);
    const [unassignedUserFilter, setUnassignedUserFilter] = useState<boolean>(historyUnassignedUserFilter);
    const [inactiveUserFilter, setInactiveUserFilter] = useState<boolean>(historyInactiveUserFilter);
    const [isAdminLandingRedirect, setIsAdminLandingRedirect] = useState<boolean>(historyisAdminLandingRedirect);
    const [filterRules, setFitlerRules] = useState<any>({});
    const [isBadgeInVisible, setIsBadgeInVisible] = useState<boolean>(true);

    const user = useSelector<StoreStateType, User>(state => state.user.data);
    const isLoggedIn = useSelector<StoreStateType, boolean>(state => state.user.isLoggedIn);
    const isLoading = useSelector<StoreStateType, boolean>(state => state.isLoading);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const axiosInterceptorId = useSelector<StoreStateType, number>(state => state.investigation.axiosInterceptorId);
    const windowTabsBroadcastChannel = useRef(new BroadcastChannel(BC_TABS_NAME));

    useEffect(() => {
        const statusFilterToSet = statusFilter.length > 0 ? filterCreators.STATUS(statusFilter) : null;
        const deskFilterToSet = deskFilter.length > 0 ? filterCreators.DESK_ID(deskFilter) : null;
        const timeRangeFilterToSet = timeRangeFilter.id !== allTimeRangeId ? filterCreators.TIME_RANGE(timeRangeFilter) : null;
        const unAssignedFilterToSet = (unassignedUserFilter && !inactiveUserFilter) ? filterCreators.UNASSIGNED_USER(unassignedUserFilter) : null;
        const inActiveToSet = (inactiveUserFilter && !unassignedUserFilter) ? filterCreators.INACTIVE_USER(unassignedUserFilter) : null;
        const unAllocatedToSet = (unassignedUserFilter && unassignedUserFilter) ? filterCreators.UNALLOCATED_USER(unassignedUserFilter) : null;
        setFitlerRules({
            ...filterRules,
            [InvestigationsFilterByFields.STATUS]: statusFilterToSet && Object.values(statusFilterToSet)[0],
            [InvestigationsFilterByFields.DESK_ID]: deskFilterToSet && Object.values(deskFilterToSet)[0],
            [InvestigationsFilterByFields.TIME_RANGE]: timeRangeFilterToSet && Object.values(timeRangeFilterToSet)[0],
            [InvestigationsFilterByFields.UNASSIGNED_USER]: unAssignedFilterToSet && Object.values(unAssignedFilterToSet)[0],
            [InvestigationsFilterByFields.INACTIVE_USER]: inActiveToSet && Object.values(inActiveToSet)[0],
            [InvestigationsFilterByFields.UNALLOCATED_USER]: unAllocatedToSet && Object.values(unAllocatedToSet)[0],
        }) 
    }, [])

    const changeDeskFilter = (desks: Desk[]) => {
        const desksIds = desks.map(desk => desk.id);
        updateFilterHistory('deskFilter', desksIds);
        setDeskFilter(desksIds);
        handleFilterChange(filterCreators.DESK_ID(desksIds))
        setCurrentPage(defaultPage);
    };

    const changeTimeRangeFilter = (timeRangeFilter: TimeRange) => {
        updateFilterHistory('timeRangeFilter', timeRangeFilter);
        setTimeRangeFilter(timeRangeFilter);
        handleFilterChange(filterCreators.TIME_RANGE(timeRangeFilter))
        setCurrentPage(defaultPage);
    };

    const changeSearchFilter = (searchQuery: string) => {
        handleFilterChange(filterCreators.SEARCH_BAR(searchQuery)) 
    }
    
    const changeStatusFilter = (statuses: InvestigationMainStatus[]) => {
        const statusesIds = statuses.map(status => status.id);
        updateFilterHistory('statusFilter', statusesIds);
        setStatusFilter(statusesIds);
        handleFilterChange(filterCreators.STATUS(statusesIds));
        setCurrentPage(defaultPage);
    };

    const changeUnassginedUserFilter = (value: boolean) => {
        updateFilterHistory('unassignedUserFilter', value);
        setUnassignedUserFilter(value);
        if (inactiveUserFilter && value) {
            delete filterRules[InvestigationsFilterByFields.INACTIVE_USER];
            handleFilterChange(filterCreators.UNALLOCATED_USER(value))
        } else {
            delete filterRules[InvestigationsFilterByFields.UNALLOCATED_USER];
            handleFilterChange(filterCreators.UNASSIGNED_USER(value))
        }
        setCurrentPage(defaultPage);
    }

    const changeInactiveUserFilter = (value: boolean) => {
        updateFilterHistory('inactiveUserFilter', value);
        setInactiveUserFilter(value);
        if (unassignedUserFilter && value) {
            delete filterRules[InvestigationsFilterByFields.UNASSIGNED_USER];
            handleFilterChange(filterCreators.UNALLOCATED_USER(value));
        } else {
            delete filterRules[InvestigationsFilterByFields.UNALLOCATED_USER];
            handleFilterChange(filterCreators.INACTIVE_USER(value));
        }
        setCurrentPage(defaultPage);
    }

    const updateFilterHistory = (key: string, value: any) => {
        const { location: { state } } = history;
        history.replace({
            state: {
                ...state,
                isAdminLandingRedirect: false,
                [key]: value
            }
        });
        setIsAdminLandingRedirect(false);
    };

    const fetchAllDesksByCountyId = () => {
        const desksByCountyIdLogger = logger.setup('Getting Desks by county id');
        axios.get('/desks/county')
            .then((result) => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    desksByCountyIdLogger.info('The desks were fetched successfully', Severity.LOW);
                    setAllDesks([{ id: -1, deskName: 'לא שוייך לדסק' }, ...result.data]);
                } else {
                    desksByCountyIdLogger.error('Got 200 status code but results structure isnt as expected', Severity.HIGH);
                }
            })
            .catch((err) => {
                alertError('לא הצלחנו לשלוף את כל הדסקים האפשריים לסינון');
                desksByCountyIdLogger.error(err, Severity.HIGH);
            })
    }

    const canChangeStatusNewToInProcess = (investigationStatus: Number, investigationInvestigator?: string) => {
        return investigationStatus === InvestigationMainStatusCodes.NEW &&
            (user.userType === userType.INVESTIGATOR || investigationInvestigator === user.id);
    };

    const fetchAllInvestigationStatuses = () => {
        const investigationStatusesLogger = logger.setup('GraphQL GET statuses request to the DB');
        axios.get('/landingPage/investigationStatuses').
            then((result) => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    investigationStatusesLogger.info('The investigations statuses were fetched successfully', Severity.LOW);
                    const allStatuses: InvestigationMainStatus[] = result.data;
                    setAllStatuses(allStatuses);
                } else {
                    investigationStatusesLogger.error('Got 200 status code but results structure isnt as expected', Severity.HIGH);
                }
            })
            .catch((err) => {
                alertError('לא הצלחנו לשלוף את כל הסטטוסים האפשריים לסינון');
                investigationStatusesLogger.error(err, Severity.HIGH);
            })
    }

    useEffect(() => {
        fetchAllInvestigationStatuses();
        fetchAllDesksByCountyId();
        startWaiting();
    }, []);

    const moveToTheInvestigationForm = async (epidemiologyNumberVal: number) => {
        const investigationClickLogger = logger.setupVerbose({
            workflow: 'Investigation click',
            investigation: epidemiologyNumberVal,
            user: user.id
        });
        setLastOpenedEpidemiologyNum(epidemiologyNumberVal);
        investigationClickLogger.info(`Entered investigation: ${epidemiologyNumberVal}`, Severity.LOW);
        await persistor.flush();
        window.open(investigationURL);
        fetchTableData();
    };

    const handleFilterChange = (filterBy: () => any) => {
        let filterRulesToSet = {...filterRules};
        if (Object.values(filterBy)[0] !== null) {
            filterRulesToSet = {
                ...filterRulesToSet,
                ...filterBy
            }
        } else {
            delete filterRulesToSet[Object.keys(filterBy)[0]]
        }
        setFitlerRules(filterRulesToSet);
    }  

    const fetchInvestigationsAxiosRequest = (): any => {
        const investigationsLogger = logger.setup('Getting Investigations');

        const requestData = {
            orderBy,
            size: rowsPerPage,
            currentPage,
            filterRules: Object.values(filterRules).reduce((obj, item) => Object.assign(obj, item) , {})
        };

        if (user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) {
            investigationsLogger.info('user is admin so landingPage/groupInvestigations route is chosen', Severity.LOW);
            return axios.post('landingPage/groupInvestigations', requestData)
        }

        investigationsLogger.info('user isnt admin so landingPage/investigations route is chosen', Severity.LOW);
        return axios.post('/landingPage/investigations', requestData);
    }

    const sortUsersByAvailability = (fisrtUser: User, secondUser: User) =>
        fisrtUser.newInvestigationsCount - secondUser.newInvestigationsCount ||
        fisrtUser.activeInvestigationsCount - secondUser.activeInvestigationsCount

    const fetchAllCountyUsers = async () => {
        const countyUsersLogger = logger.setup('Getting group users');
        countyUsersLogger.info('requesting the server the connected admin group users', Severity.LOW);
        const countyUsers: Map<string, User> = new Map();
        try {
            const result = await axios.get('/users/group');
            if (result && result.data) {
                result.data.forEach((user: any) => {
                    countyUsers.set(user.id, {
                        ...user,
                        newInvestigationsCount: user.newInvestigationsCount,
                        activeInvestigationsCount: user.activeInvestigationsCount,
                        pauseInvestigationsCount: user.pauseInvestigationsCount
                    })
                });
                countyUsersLogger.info('fetched all the users successfully', Severity.LOW);
            } else {
                countyUsersLogger.warn('the connected admin doesnt have group users', Severity.MEDIUM);
            }                    
        } catch (err) {
            countyUsersLogger.error(err, Severity.HIGH);
            alertError('לא ניתן היה לשלוף חוקרים');
        };
        const sortedCountyUsers = new Map(Array.from(countyUsers.entries())
        .sort((fisrtUser, secondUser) => sortUsersByAvailability(fisrtUser[1], secondUser[1])));
        return sortedCountyUsers;
    }
    
    const fetchAllCounties = () => {
        const fetchAllCountiesLogger = logger.setup('GraphQL request to the DB');
        axios.get('/counties').then((result: any) => {
            const allCounties: County[] = [];
            result && result.data && result.data.forEach((county: any) => {
                allCounties.push({
                    id: county.id,
                    displayName: `${county.district} - ${county.displayName}`
                })
            });
            fetchAllCountiesLogger.info('fetched all the counties successfully', Severity.LOW);
            setAllCounties(allCounties);
        }).catch(err => {
            fetchAllCountiesLogger.error(err, Severity.HIGH);
            alertError(FETCH_ERROR_TITLE);
        });
    }

    const getFormattedDate = (date: string) => {
        return format(new Date(date), 'dd/MM')
    };

    const fetchTableData = async () => {
        const fetchInvestigationsLogger = logger.setup('Getting Investigations');
        if (isLoggedIn) {
            setIsLoading(true);
            if (user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) {
                fetchAllCounties();
            }
            fetchInvestigationsLogger.info(`launching the selected request to the DB ordering by ${orderBy}`, Severity.LOW);
            fetchInvestigationsAxiosRequest()
                .then((response: any) => {
                    fetchInvestigationsLogger.info('got response from the server', Severity.LOW);

                    const { data } = response;
                    let allInvestigationsRawData: any = [];

                    if (user.investigationGroup !== -1) {
                        fetchInvestigationsLogger.info('user investigation group is valid', Severity.LOW);
                        if (data && data.allInvestigations) {
                            fetchInvestigationsLogger.info('got investigations from the DB', Severity.LOW);
                            allInvestigationsRawData = data.allInvestigations
                            setTotalCount(data.totalCount);
                            setUnassignedInvestigationsCount(data.unassignedInvestigationsCount);
                        } else {
                            fetchInvestigationsLogger.warn('didnt get investigations from the DB', Severity.MEDIUM);
                        }

                        const investigationRows: InvestigationTableRow[] = allInvestigationsRawData
                            .filter((investigation: any) =>
                                investigation?.investigatedPatientByInvestigatedPatientId?.covidPatientByCovidPatient &&
                                investigation?.userByCreator)
                            .map((investigation: any) => {
                                const patient = investigation.investigatedPatientByInvestigatedPatientId;
                                const desk = investigation.desk;
                                const covidPatient = patient.covidPatientByCovidPatient;
                                const patientCity = (covidPatient && covidPatient.addressByAddress) ? covidPatient.addressByAddress.cityByCity : '';
                                const user = investigation.userByCreator;
                                const county = user ? user.countyByInvestigationGroup : '';
                                const statusReason = user ? investigation.statusReason : '';
                                const wasInvestigationTransferred = investigation.wasInvestigationTransferred;
                                const transferReason = user ? investigation.transferReason : '';
                                const groupId = user ? investigation.groupId : '';
                                const canFetchGroup = Boolean(groupId);
                                const groupReason = user ? investigation?.investigationGroupReasonByGroupId?.reason : '';
                                const reasonId = user ? investigation?.investigationGroupReasonByGroupId?.reasonId : '';
                                const otherReason = user ? investigation?.investigationGroupReasonByGroupId?.otherReason : '';
                                const subStatus = investigation.investigationSubStatusByInvestigationSubStatus ?
                                    investigation.investigationSubStatusByInvestigationSubStatus.displayName :
                                    '';
                                const subOccupation = investigation?.investigatedPatientByInvestigatedPatientId?.subOccupationBySubOccupation?.displayName;
                                const parentOccupation = investigation?.investigatedPatientByInvestigatedPatientId?.subOccupationBySubOccupation?.parentOccupation;
                                const isInInstitute  =  investigation.investigatedPatientByInvestigatedPatientId?.investigatedPatientRoleByRole?.displayName === 'שוהה במוסד'
                                return createRowData(
                                    investigation.epidemiologyNumber,
                                    investigation.coronaTestDate,
                                    investigation.isComplex,
                                    investigation.priority,
                                    investigation.investigationStatusByInvestigationStatus,
                                    subStatus,
                                    covidPatient.fullName,
                                    covidPatient.primaryPhone,
                                    covidPatient.age,
                                    patientCity ? patientCity.displayName : '',
                                    desk,
                                    county,
                                    { id: user.id, userName: user.userName, isActive: user.isActive },
                                    investigation.comment,
                                    statusReason,
                                    wasInvestigationTransferred,
                                    transferReason,
                                    groupId,
                                    canFetchGroup,
                                    groupReason,
                                    otherReason,
                                    reasonId,
                                    subOccupation,
                                    parentOccupation,
                                    isInInstitute,
                                    investigation.creationDate,
                                    investigation.startTime,
                                    investigation.isSelfInvestigated,
                                    investigation.selfInvestigationStatus,
                                    investigation.selfInvestigationUpdateTime
                                )
                            });
                        investigationRows
                            .filter((row) => row.groupId !== null && !investigationColor.current.has(row.groupId))
                            .forEach((row) => {
                                // We have this color range so the group colors aren't too dark nor bright
                                const minColorValue = 50;
                                const maxColorValue = 200;
                                const red = getFlooredRandomNumber(minColorValue, maxColorValue);
                                const green = getFlooredRandomNumber(minColorValue, maxColorValue);
                                const blue = getFlooredRandomNumber(minColorValue, maxColorValue);
                                investigationColor.current.set(row.groupId, `rgb(${red}, ${green}, ${blue})`);
                            });
                        setRows(investigationRows);
                        setIsLoading(false);
                    } else {
                        fetchInvestigationsLogger.warn('user investigation group is invalid', Severity.MEDIUM);
                    }
                })
                .catch((err: any) => {
                    alertError('אופס... לא הצלחנו לשלוף');
                    setIsLoading(false);
                    fetchInvestigationsLogger.error(err, Severity.HIGH);
                });
        }
    };

    useEffect(() => {
        windowTabsBroadcastChannel.current.onmessage = () => fetchTableData();
    });

    const { startWaiting, onCancel, onOk, snackbarOpen } = usePageRefresh(fetchTableData, TABLE_REFRESH_INTERVAL);

    useEffect(() => {
        if (isLoggedIn) {
            fetchTableData();
        }
        setIsBadgeInVisible(!Boolean(Object.values(filterRules).find(item => item !== null)))
    }, [isLoggedIn, filterRules, orderBy, currentPage]);

    const onInvestigationRowClick = (investigationRow: { [T in keyof IndexedInvestigationData]: any }) => {
        const investigationClickLogger = logger.setupVerbose({
            workflow: 'opening an investigation',
            investigation: investigationRow.epidemiologyNumber,
            user: user.id
        });

        if (epidemiologyNumber !== investigationRow.epidemiologyNumber) {
            investigationClickLogger.info('the chosen investigation isnt the last one that was opened', Severity.LOW);
            const newInterceptor = axios.interceptors.request.use(
                (config) => {
                    config.headers.EpidemiologyNumber = investigationRow.epidemiologyNumber;
                    return config;
                },
                (error) => Promise.reject(error)
            );
            setAxiosInterceptorId(newInterceptor);
            axiosInterceptorId !== -1 && axios.interceptors.request.eject(axiosInterceptorId);
        }
        const indexOfInvestigationObject = rows.findIndex(currInvestigationRow => currInvestigationRow.epidemiologyNumber === investigationRow.epidemiologyNumber);
        indexOfInvestigationObject !== -1 && setCreator(rows[indexOfInvestigationObject].investigator.id);
        if (canChangeStatusNewToInProcess(investigationRow.investigationStatus.id, investigationRow.investigatorId)) {
            investigationClickLogger.info('the chosen investigation is new', Severity.LOW);
            investigationClickLogger.info('launching request to update the investigation start time', Severity.LOW);
            axios.post('/investigationInfo/updateInvestigationStartTime', {
                epidemiologyNumber: investigationRow.epidemiologyNumber
            })
                .then(async () => {
                    investigationClickLogger.info('the db response is successfull', Severity.LOW);
                    investigationClickLogger.info('launching request to update status to in process', Severity.LOW);
                    try {
                        await axios.post('/investigationInfo/updateInvestigationStatus', {
                            investigationMainStatus: InvestigationMainStatusCodes.IN_PROCESS,
                            investigationSubStatus: null,
                            epidemiologyNumber: investigationRow.epidemiologyNumber
                        });
                        setInvestigationStatus({
                            mainStatus: InvestigationMainStatusCodes.IN_PROCESS,
                            subStatus: null,
                            statusReason: null
                        });
                        investigationClickLogger.info(`Updated new investigation to have "in process" status and entered the investigation,
                        investigated person: ${investigationRow.fullName}, 
                        investigator name: ${user.userName}, investigator phone number: ${user.phoneNumber}`, Severity.LOW);
                        moveToTheInvestigationForm(investigationRow.epidemiologyNumber);
                    } catch (error) {
                        const errorMessage = `failed to update investigation status dut to ${JSON.stringify(error)}`;
                        investigationClickLogger.error(errorMessage, Severity.HIGH);
                        throw new Error(errorMessage)
                    }
                })
                .catch((error) => {
                    const errorMessage = `failed to update investigation start time dut to ${JSON.stringify(error)}`;
                    investigationClickLogger.error(errorMessage, Severity.HIGH);
                    alertError(OPEN_INVESTIGATION_ERROR_TITLE)
                })
        } else {
            investigationClickLogger.info(`the investigator got into the investigation, investigated person: ${investigationRow.fullName}, investigator name: ${user.userName}, investigator phone number: ${user.phoneNumber}`, Severity.LOW);
            setInvestigationStatus({
                mainStatus: investigationRow.investigationStatus.id,
                subStatus: investigationRow.investigationSubStatus,
                statusReason: investigationRow.statusReason
            });
            moveToTheInvestigationForm(investigationRow.epidemiologyNumber);
        }
    }

    const convertToIndexedRow = (row: InvestigationTableRow): IndexedInvestigationData => {
        return {
            [TableHeadersNames.color]: '',
            [TableHeadersNames.rowIndicators]: '',
            [TableHeadersNames.multipleCheck]: row.isChecked,
            [TableHeadersNames.epidemiologyNumber]: row.epidemiologyNumber,
            [TableHeadersNames.coronaTestDate]: getFormattedDate(row.coronaTestDate),
            [TableHeadersNames.isComplex]: row.isComplex,
            [TableHeadersNames.priority]: row.priority,
            [TableHeadersNames.fullName]: row.fullName,
            [TableHeadersNames.phoneNumber]: row.phoneNumber,
            [TableHeadersNames.age]: row.age,
            [TableHeadersNames.city]: row.city,
            [TableHeadersNames.subOccupation]: row.subOccupation,
            [TableHeadersNames.investigatorName]: row.investigator.userName,
            [investigatorIdPropertyName]: row.investigator.id,
            [TableHeadersNames.investigationStatus]: row.mainStatus,
            [TableHeadersNames.investigationSubStatus]: row.subStatus,
            [TableHeadersNames.statusReason]: row.statusReason,
            [TableHeadersNames.investigationDesk]: row.investigationDesk,
            [TableHeadersNames.comment]: row.comment,
            [TableHeadersNames.statusReason]: row.statusReason,
            [TableHeadersNames.wasInvestigationTransferred]: row.wasInvestigationTransferred,
            [TableHeadersNames.transferReason]: row.transferReason,
            [TableHeadersNames.settings]: '',
            [TableHeadersNames.groupId]: row.groupId,
            [TableHeadersNames.canFetchGroup]: row.canFetchGroup,
            [TableHeadersNames.groupReason]: row.groupReason,
            [TableHeadersNames.otherReason]: row.otherReason,
            [TableHeadersNames.reasonId]: row.reasonId,
            [TableHeadersNames.isSelfInvestigated]: row.isSelfInvestigated,
            [TableHeadersNames.selfInvestigationStatus]: row.selfInvestigationStatus,
            [TableHeadersNames.selfInvestigationUpdateTime]: row.selfInvestigationUpdateTime,
        }
    }

    const getInvestigationsOldValues = (investigations: InvestigationTableRow[], key: TableKeys, countyValue?: number) => (
        investigations
        .map(investigation => `${investigation.epidemiologyNumber}: ${countyValue || convertToIndexedRow(investigation)[key as TableHeadersNames]}`)
        .join(', ')
    )

    const logInvestigationTransfer = (epidemiologyNumbers: number[], key: TableKeys, newValue: number | string, reason?: string) => {
        const countyValue : number | undefined = key  === HiddenTableKeys.county ? user.investigationGroup : undefined;
        const investigations =  rows.filter(investigation => epidemiologyNumbers.includes(investigation.epidemiologyNumber))
        const investigationsPreviousValues = getInvestigationsOldValues(investigations, key, countyValue);
        return `launching request to transfer the investigations ${key} to ${newValue} from their old values: {${investigationsPreviousValues}} ${reason ? `due to ${reason}` : ''}`;
    }

    const logGroupTransfer = (groupIds: string[], key: TableKeys, newValue: number | string, reason?: string) => {
        const countyValue = key  === HiddenTableKeys.county ? user.investigationGroup : undefined;
        const groups =  Array.from(allGroupedInvestigations.keys()).filter(groupId => groupIds.includes(groupId))
        const investigationsPreviousValues = groups
        .map(groupId => `group ${groupId}- investigations:{${getInvestigationsOldValues(allGroupedInvestigations.get(groupId) as InvestigationTableRow[], key, countyValue)}}`)
        .join(', ');
        return `launching request to transfer the groups investigations ${key} to ${newValue} from their old values: ${investigationsPreviousValues} ${reason ? `due to ${reason}` : ''}`;
    }

    const getUserMapKeyByValue = (map: Map<string, User>, value: string): string => {
        const key = Array.from(map.keys()).find(key => map.get(key)?.userName === value);
        return key ? key : ''
    }

    const changeGroupsInvestigator = async (groupIds: string[], investigator: InvestigatorOption | null) => {
        const changeGroupsInvestigatorLogger = logger.setup('Change groups investigator');
        const joinedGroupIds = groupIds.join(', ');
        changeGroupsInvestigatorLogger.info(logGroupTransfer(groupIds, TableHeadersNames.investigatorName, investigator?.value.userName || ''), Severity.LOW);
        try {
            await axios.post('/users/changeGroupInvestigator', {
                groupIds,
                user: investigator?.id,
            });
            changeGroupsInvestigatorLogger.info(`the investigator have been changed successfully for groups ${joinedGroupIds}`, Severity.LOW);
        } catch (error) {
            changeGroupsInvestigatorLogger.error(`couldn't change investigator of groups ${joinedGroupIds} due to ${error}`, Severity.HIGH);
            alertError(UPDATE_ERROR_TITLE);
        }
    };

    const changeInvestigationsInvestigator = async (epidemiologyNumbers: number[], investigator: InvestigatorOption | null, transferReason?: string) => {
        const changeInvestigationsInvestigatorLogger = logger.setupVerbose({
            workflow: 'Change investigations investigator',
            user: user.id,
        });
        changeInvestigationsInvestigatorLogger.info(logInvestigationTransfer(epidemiologyNumbers, TableHeadersNames.investigatorName, investigator?.value.userName || '', transferReason), Severity.LOW);
        try {
            await axios.post('/users/changeInvestigator', {
                epidemiologyNumbers,
                user: investigator?.id,
                transferReason
            });
            changeInvestigationsInvestigatorLogger.info('the investigator have been changed successfully', Severity.LOW);
        } catch (error) {
            changeInvestigationsInvestigatorLogger.error('couldnt change investigator due to ' + error, Severity.HIGH);
            alertError(UPDATE_ERROR_TITLE);
        }
    };

    const changeGroupsDesk = async (groupIds: string[], newSelectedDesk: Desk | null, transferReason?: string) => {
        const changeDeskLogger = logger.setup('Change Investigation Desk');
        const joinedGroupIds = groupIds.join(', ');
        changeDeskLogger.info(`performing desk change request for group ${joinedGroupIds}`, Severity.LOW);
        try {
            await axios.post('/landingPage/changeGroupDesk', {
                groupIds,
                desk: newSelectedDesk?.id,
                reason: transferReason
            });
            changeDeskLogger.info(logGroupTransfer(groupIds, TableHeadersNames.investigationDesk, newSelectedDesk?.deskName || '', transferReason), Severity.LOW);
            setSelectedRow(DEFAULT_SELECTED_ROW);
            fetchTableData();
        } catch (error) {
            changeDeskLogger.error(`couldn't change the desk for group ${joinedGroupIds} due to ${error}`, Severity.HIGH);
            alertError(UPDATE_ERROR_TITLE);
        }
    };

    const changeGroupsCounty = (groupIds: string[], newSelectedCounty: County | null, transferReason: string) => {
        const changeCountyLogger = logger.setup('Change Investigation County');
        try {
            axios.post('/users/changeGroupCounty', {
                groupIds,
                county: newSelectedCounty?.id,
                transferReason
            });
            changeCountyLogger.info(logGroupTransfer(groupIds, HiddenTableKeys.county, newSelectedCounty?.id || '', transferReason), Severity.LOW);
            setSelectedRow(DEFAULT_SELECTED_ROW);
            fetchTableData();
        } catch (error) {
            changeCountyLogger.error(`couldn't change the county for groups ${groupIds} due to ${error}`, Severity.HIGH);
            alertError(UPDATE_ERROR_TITLE);
        }
    };

    const changeInvestigationsDesk = async (epidemiologyNumbers: number[], newSelectedDesk: Desk | null, transferReason?: string) => {
        const changeDeskLogger = logger.setupVerbose({
            workflow: 'change investigations desk',
            user: user.id,
            investigation: epidemiologyNumbers.join(', ')
        });
        changeDeskLogger.info(logInvestigationTransfer(epidemiologyNumbers, TableHeadersNames.investigationDesk, newSelectedDesk?.deskName || '', transferReason), Severity.LOW);
        try {
            await axios.post('/landingPage/changeDesk', {
                epidemiologyNumbers,
                updatedDesk: newSelectedDesk?.id,
                transferReason
            });
            changeDeskLogger.info('changed the desk successfully', Severity.LOW);
        } catch (error) {
            changeDeskLogger.error(`couldn't change the desk due to ${error}`, Severity.HIGH);
            alertError(UPDATE_ERROR_TITLE);
        }
    }

    const changeInvestigationCounty = (epidemiologyNumbers: number[], newSelectedCounty: County | null, transferReason: string) => {
        const changeCountyLogger = logger.setup('Change Investigations County');
        try {
            axios.post('/users/changeCounty', {
                epidemiologyNumbers,
                updatedCounty: newSelectedCounty?.id,
                transferReason
            });
            changeCountyLogger.info(logInvestigationTransfer(epidemiologyNumbers, HiddenTableKeys.county, newSelectedCounty?.id || '', transferReason), Severity.LOW);
            setSelectedRow(DEFAULT_SELECTED_ROW);
            fetchTableData();
        } catch (error) {
            changeCountyLogger.error(`couldn't change the county for ${epidemiologyNumbers} due to ${error}`, Severity.HIGH);
            alertError(UPDATE_ERROR_TITLE);
        }
    }

    const getDefaultCellStyles = (cellKey: string) => {
        let classNames: string[] = [];
        classNames.push(classes.font);
        if (cellKey !== TableHeadersNames.color) {
            classNames.push(classes.tableCell);
        }
        if (cellKey === TableHeadersNames.investigatorName) {
            classNames.push(classes.columnBorder);
        }
        else
        if (cellKey === TableHeadersNames.priority) {
            classNames.push(classes.priorityTableCell);
        }

        return classNames;
    }

    const getNestedCellStyle = (isLast: boolean) => (cellKey: string) => {
        let classNames = getDefaultCellStyles(cellKey);

        if (isLast) {
            classNames.push(classes.rowBorder);
        } else {
            classNames.push(classes.nestedTableCell);
        }

        return classNames;
    }

    const getRegularCellStyle = (rowIndex: number, isGroupShown: boolean) => (cellKey: string) => {
        let classNames = getDefaultCellStyles(cellKey);

        if (cellNeedsABorder(rowIndex)) {
            classNames.push(classes.rowBorder);
        }
        if (isGroupShown) {
            classNames.push(classes.nestedTableCell);
            if (rowIndex !== 0 && !cellNeedsABorder(rowIndex - 1)) {
                classNames.push(classes.openedTableCell);
            }
        }

        return classNames;
    }

    const cellNeedsABorder = (rowIndex: number) => {
        const currentRow = rows[rowIndex];
        const nextRow = rows[rowIndex + 1];

        const isNotLastRow = (rows.length - 1 !== rowIndex);
        const hasATestDate = Boolean(currentRow?.coronaTestDate);
        const isLastOfDate = (getFormattedDate(currentRow?.coronaTestDate) !== getFormattedDate(Boolean(nextRow) ?
            nextRow.coronaTestDate :
            "9999/12/31"));

        return ((isDefaultOrder && !isLoading) &&
            isNotLastRow &&
            hasATestDate &&
            isLastOfDate)
    }

    const sortInvestigationTable = (orderByValue: string) => {
        setIsDefaultOrder(orderByValue === defaultOrderBy);
        setOrderBy(orderByValue);
        setCurrentPage(defaultPage);
    }

    const fetchInvestigationsByGroupId = async (groupId: string): Promise<InvestigationTableRow[]> => {
        const investigationsByGroupIdLogger = logger.setup('get investigations by group id');
        investigationsByGroupIdLogger.info('send get investigations by group id request', Severity.LOW);
        setIsLoading(true)
        try {
            const result = await axios.get('/groupedInvestigations/' + groupId)
            if (result?.data && result.headers['content-type'].includes('application/json')) {
                investigationsByGroupIdLogger.info('The investigations were fetched successfully', Severity.LOW);
                const investigationRows: InvestigationTableRow[] = result.data
                    .filter((investigation: any) =>
                        investigation?.investigatedPatientByInvestigatedPatientId?.covidPatientByCovidPatient &&
                        investigation?.userByCreator)
                    .map((investigation: any) => {
                        const patient = investigation.investigatedPatientByInvestigatedPatientId;
                        const desk = investigation.desk;
                        const covidPatient = patient.covidPatientByCovidPatient;
                        const patientCity = (covidPatient && covidPatient.addressByAddress) ? covidPatient.addressByAddress.cityByCity : '';
                        const user = investigation.userByCreator;
                        const county = user ? user.countyByInvestigationGroup : '';
                        const statusReason = user ? investigation.statusReason : '';
                        const wasInvestigationTransferred = investigation.wasInvestigationTransferred;
                        const transferReason = user ? investigation.transferReason : '';
                        const groupId = user ? investigation.groupId : '';
                        const canFetchGroup = false;
                        const groupReason = user ? investigation.investigationGroupReasonByGroupId.reason : ''
                        const otherReason = user ? investigation.investigationGroupReasonByGroupId.otherReason : ''
                        const reasonId = user ? investigation.investigationGroupReasonByGroupId.reasonId : ''
                        const subStatus = investigation.investigationSubStatusByInvestigationSubStatus ?
                            investigation.investigationSubStatusByInvestigationSubStatus.displayName :
                            '';
                        const subOccupation = investigation.investigatedPatientByInvestigatedPatientId?.subOccupationBySubOccupation?.displayName;
                        const parentOccupation = investigation.investigatedPatientByInvestigatedPatientId?.subOccupationBySubOccupation?.parentOccupation;
                        const isInInstitute  =  investigation.investigatedPatientByInvestigatedPatientId?.investigatedPatientRoleByRole?.displayName === 'שוהה במוסד'
                        return createRowData(
                            investigation.epidemiologyNumber,
                            investigation.coronaTestDate,
                            investigation.isComplex,
                            investigation.priority,
                            investigation.investigationStatusByInvestigationStatus,
                            subStatus,
                            covidPatient.fullName,
                            covidPatient.primaryPhone,
                            covidPatient.age,
                            patientCity ? patientCity.displayName : '',
                            desk,
                            county,
                            { id: user.id, userName: user.userName, isActive: user.isActive },
                            investigation.comment,
                            statusReason,
                            wasInvestigationTransferred,
                            transferReason,
                            groupId,
                            canFetchGroup,
                            groupReason,
                            otherReason,
                            reasonId,
                            subOccupation,
                            parentOccupation,
                            isInInstitute,
                            investigation.creationDate,
                            investigation.startTime,
                            investigation.isSelfInvestigated,
                            investigation.selfInvestigationStatus,
                            investigation.selfInvestigationUpdateTime
                        )
                    });
                setAllGroupedInvestigations(allGroupedInvestigations.set(groupId, investigationRows))
                return investigationRows;
            } else {
                investigationsByGroupIdLogger.error('Got 200 status code but results structure isnt as expected', Severity.HIGH);
                return [];
            }
        } catch (err) {
            alertError('לא הצלחנו לשלוף את כל החקירות בקבוצה');
            investigationsByGroupIdLogger.error(err, Severity.HIGH);
            return [];
        } finally {
            setIsLoading(false)
        }
    }

    const isAdmin = user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN;

    const noAdminFilterTitle = rows.length === 0 ? noInvestigationsMessage : welcomeMessage;;

    const tableTitle = useMemo(() => {
        if (rows.length === 0) return noInvestigationsMessage;
        if (isAdminLandingRedirect === false || !isAdmin) {
            return noAdminFilterTitle;
        }
        return filterTitle || noAdminFilterTitle;
    }, [rows])

    return {
        tableRows: rows,
        fetchTableData,
        onInvestigationRowClick,
        convertToIndexedRow,
        getNestedCellStyle,
        getRegularCellStyle,
        sortInvestigationTable,
        getUserMapKeyByValue,
        onCancel,
        onOk,
        snackbarOpen,
        moveToTheInvestigationForm,
        changeGroupsDesk,
        changeInvestigationsDesk,
        changeGroupsCounty,
        changeInvestigationCounty,
        totalCount,
        unassignedInvestigationsCount,
        fetchInvestigationsByGroupId,
        changeGroupsInvestigator,
        changeInvestigationsInvestigator,
        statusFilter,
        changeStatusFilter,
        deskFilter,
        changeDeskFilter,
        changeSearchFilter,
        changeUnassginedUserFilter,
        unassignedUserFilter,
        changeInactiveUserFilter,
        inactiveUserFilter,
        fetchAllCountyUsers,
        tableTitle, 
        timeRangeFilter,
        isBadgeInVisible,
        changeTimeRangeFilter
    };
};

export default useInvestigationTable;

import axios from 'axios';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useEffect, useState, useRef, useMemo } from 'react';

import Desk from 'models/Desk';
import User from 'models/User';
import County from 'models/County';
import logger from 'logger/logger';
import { persistor } from 'redux/store';
import { Severity } from 'models/Logger';
import { TimeRange } from 'models/TimeRange';
import Investigator from 'models/Investigator';
import StoreStateType from 'redux/storeStateType';
import UserTypeCodes from 'models/enums/UserTypeCodes';
import { BC_TABS_NAME } from 'models/BroadcastMessage';
import usePageRefresh from 'Utils/vendor/usePageRefresh';
import { truncateDate } from 'Utils/DateUtils/formatDate';
import InvestigatorOption from 'models/InvestigatorOption';
import { defaultTimeRange } from 'models/enums/timeRanges';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import InvestigationTableRow from 'models/InvestigationTableRow';
import InvestigationMainStatus from 'models/InvestigationMainStatus';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import getColorByGroupId from 'Utils/GroupedInvestigations/getColorByGroupId';
import InvestigationsFilterByFields from 'models/enums/InvestigationsFilterByFields';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';
import { setComplexReasons } from 'redux/ComplexReasons/complexReasonsActionCreators';
import { setComplexReasonsId } from 'redux/Investigation/investigationActionCreators';
import { setLastOpenedEpidemiologyNum } from 'redux/Investigation/investigationActionCreators';
import { setInvestigationStatus, setCreator } from 'redux/Investigation/investigationActionCreators';
import AllocatedInvestigator from 'models/InvestigationTable/AllocateInvestigatorDialog/AllocatedInvestigator';
import { resetInvestigationState, setAxiosInterceptorId } from 'redux/Investigation/investigationActionCreators';

import useStyle from './InvestigationTableStyles';
import { filterCreators } from './FilterCreators';
import { allTimeRangeId } from '../adminLandingPage/useAdminLandingPage';
import { defaultOrderBy, rowsPerPage, defaultPage } from './InvestigationTable';
import {
    TableHeadersNames, IndexedInvestigationData, investigatorIdPropertyName, TableKeys, HiddenTableKeys
} from './InvestigationTablesHeaders';
import { DeskFilter, HistoryState, StatusFilter, SubStatusFilter, useInvestigationTableOutcome, useInvestigationTableParameters } from './InvestigationTableInterfaces';
import SubStatus from 'models/SubStatus';
import KeyValuePair from 'models/KeyValuePair';
import { fetchAllInvestigatorReferenceStatuses, fetchAllChatStatuses } from 'httpClient/investigationInfo'; 
import { setInvestigatorReferenceStatuses } from 'redux/investigatorReferenceStatuses/investigatorReferenceStatusesActionCreator';
import { setChatStatuses } from 'redux/ChatStatuses/chatStatusesActionCreator';

const investigationURL = '/investigation';

export const createRowData = (
    epidemiologyNumber: number,
    validationDate: string,
    isComplex: boolean,
    complexityReasonsId: (number | null)[],
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
    selfInvestigationUpdateTime: string,
    lastChatDate: string,
    investigatiorReferenceRequired: boolean,
    chatStatus: KeyValuePair,
    investigatorReferenceStatus: KeyValuePair
): InvestigationTableRow => ({
    isChecked: false,
    epidemiologyNumber,
    validationDate,
    isComplex,
    complexityReasonsId,
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
    selfInvestigationUpdateTime,
    lastChatDate,
    investigatiorReferenceRequired,
    chatStatus,
    investigatorReferenceStatus
});

export interface SelectedRow {
    epidemiologyNumber: number;
    groupId: string;
};

export const DEFAULT_SELECTED_ROW: SelectedRow = {
    epidemiologyNumber: -1,
    groupId: ''
};

const TABLE_REFRESH_INTERVAL = 30;
const UPDATE_ERROR_TITLE = 'לא הצלחנו לעדכן את החקירה';
const OPEN_INVESTIGATION_ERROR_TITLE = 'לא הצלחנו לפתוח את החקירה';
const FETCH_ERROR_TITLE = 'אופס... לא הצלחנו לשלוף'
export const transferredSubStatus = 'נדרשת העברה';
const welcomeMessage = 'ניהול חקירות';

const useInvestigationTable = (parameters: useInvestigationTableParameters): useInvestigationTableOutcome => {

    const { setSelectedRow, setAllStatuses, currentPage, setCurrentPage, setAllGroupedInvestigations, allGroupedInvestigations,
        investigationColor, setAllSubStatuses } = parameters;

    const classes = useStyle(false);
    const { alertError } = useCustomSwal();
    const history = useHistory<HistoryState>();
    const dispatch = useDispatch();

    const { statusFilter: historyStatusFilter = [],
        subStatusFilter: historySubStatusFilter = [],
        deskFilter: historyDeskFilter = [],
        timeRangeFilter: historyTimeRange = defaultTimeRange,
        inactiveUserFilter: historyInactiveUserFilter = false,
        unassignedUserFilter: historyUnassignedUserFilter = false,
        updateDateFilter: historyUpdateDateFilter = '',
        nonContactFilter: historyNonContactFilter = false,
        isAdminLandingRedirect: historyisAdminLandingRedirect = false,
        unallocatedDeskFilter: historyUnallocatedDeskFilter = false,
        investigatorReferenceStatusFilter: historyInvestigatorReferenceStatusFilter = [],
        chatStatusFilter: historyChatStatusFilter = [],
        investigatorReferenceRequiredFilter: historyInvestigatorReferenceRequiredFilter = false,
        incompletedBotInvestigationFilter: historyIncompletedBotInvestigationFilter = false,
        filterTitle } = useMemo(() => {
            const { location: { state } } = history;
            return state || {};
        }, []);

    const [rows, setRows] = useState<InvestigationTableRow[]>([]);
    const [isDefaultOrder, setIsDefaultOrder] = useState<boolean>(true);
    const [orderBy, setOrderBy] = useState<string>(defaultOrderBy);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [unassignedInvestigationsCount, setUnassignedInvestigationsCount] = useState<number>(0);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>(historyStatusFilter);
    const [subStatusFilter, setSubStatusFilter] = useState<SubStatusFilter>(historySubStatusFilter);
    const [deskFilter, setDeskFilter] = useState<DeskFilter>(historyDeskFilter);
    const [timeRangeFilter, setTimeRangeFilter] = useState<TimeRange>(historyTimeRange);
    const [updateDateFilter, setUpdateDateFilter] = useState<string>(historyUpdateDateFilter);
    const [nonContactFilter, setNonContactFilter] = useState<boolean>(historyNonContactFilter);
    const [unassignedUserFilter, setUnassignedUserFilter] = useState<boolean>(historyUnassignedUserFilter);
    const [inactiveUserFilter, setInactiveUserFilter] = useState<boolean>(historyInactiveUserFilter);
    const [isAdminLandingRedirect, setIsAdminLandingRedirect] = useState<boolean>(historyisAdminLandingRedirect);
    const [unallocatedDeskFilter, setUnallocatedDeskFilter] = useState<boolean>(historyUnallocatedDeskFilter);
    const [chatStatusFilter, setChatStatusFilter] = useState<number[]>(historyChatStatusFilter);
    const [investigatorReferenceStatusFilter, setInvestigatorReferenceStatusFilter] = useState<number[]>(historyInvestigatorReferenceStatusFilter);
    const [investigatorReferenceRequiredFilter, setInvestigatorReferenceRequiredFilter] = useState<boolean>(historyInvestigatorReferenceRequiredFilter);
    const [incompletedBotInvestigationFilter, setIncompletedBotInvestigationFilter] = useState<boolean>(historyIncompletedBotInvestigationFilter);

    const getFilterRules = () => {
        const statusFilterToSet = historyStatusFilter.length > 0 ? filterCreators.STATUS(historyStatusFilter) : null;
        const subStatusFilterToSet = historySubStatusFilter.length > 0 ? filterCreators.SUB_STATUS(historySubStatusFilter) : null;
        const deskFilterToSet = historyDeskFilter.length > 0 ? filterCreators.DESK_ID(historyDeskFilter) : null;
        const timeRangeFilterToSet = !allTimeRangeId.includes(historyTimeRange.id) ? filterCreators.TIME_RANGE(historyTimeRange) : null;
        const unAssignedFilterToSet = (historyUnassignedUserFilter && !inactiveUserFilter) ? filterCreators.UNASSIGNED_USER(historyUnassignedUserFilter) : null;
        const inActiveToSet = (historyInactiveUserFilter && !historyUnassignedUserFilter) ? filterCreators.INACTIVE_USER(historyInactiveUserFilter) : null;
        const unAllocatedToSet = (historyInactiveUserFilter && historyUnassignedUserFilter) ? filterCreators.UNALLOCATED_USER(historyUnassignedUserFilter) : null;
        const updateDateFilterToSet = historyUpdateDateFilter ? filterCreators.UNUSUAL_IN_PROGRESS(historyUpdateDateFilter) : null;
        const nonContactFilterToSet = historyNonContactFilter ? filterCreators.UNUSUAL_COMPLETED_NO_CONTACT(historyNonContactFilter) : null;
        const unAllocatedDeskToSet = historyUnallocatedDeskFilter ? filterCreators.UNALLOCATED_DESK(historyUnallocatedDeskFilter) : null;
        const investigatorRefernceStatusToSet = historyInvestigatorReferenceStatusFilter ? filterCreators.INVESTIGATOR_REFERENCE_STATUS(historyInvestigatorReferenceStatusFilter) : null;
        const chatStatusFilterToSet = historyChatStatusFilter ? filterCreators.CHAT_STATUS(historyChatStatusFilter) : null;
        const investigatorReferenceRequiredFilterToSet = historyInvestigatorReferenceRequiredFilter ? filterCreators.INVESTIGATOR_REFERENCE_REQUIRED(historyInvestigatorReferenceRequiredFilter) : null;
        const incompletedBotInvestigationFilterToSet = historyIncompletedBotInvestigationFilter ? filterCreators.INCOMPLETED_BOT_INVESTIGATION(historyIncompletedBotInvestigationFilter) : null;
        
        return {
            [InvestigationsFilterByFields.STATUS]: statusFilterToSet && Object.values(statusFilterToSet)[0],
            [InvestigationsFilterByFields.SUB_STATUS]: subStatusFilterToSet && Object.values(subStatusFilterToSet)[0],
            [InvestigationsFilterByFields.DESK_ID]: deskFilterToSet && Object.values(deskFilterToSet)[0],
            [InvestigationsFilterByFields.TIME_RANGE]: timeRangeFilterToSet && Object.values(timeRangeFilterToSet)[0],
            [InvestigationsFilterByFields.UNASSIGNED_USER]: unAssignedFilterToSet && Object.values(unAssignedFilterToSet)[0],
            [InvestigationsFilterByFields.INACTIVE_USER]: inActiveToSet && Object.values(inActiveToSet)[0],
            [InvestigationsFilterByFields.UNALLOCATED_USER]: unAllocatedToSet && Object.values(unAllocatedToSet)[0],
            [InvestigationsFilterByFields.UNUSUAL_IN_PROGRESS]: updateDateFilterToSet && Object.values(updateDateFilterToSet)[0],
            [InvestigationsFilterByFields.UNUSUAL_COMPLETED_NO_CONTACT]: nonContactFilterToSet && Object.values(nonContactFilterToSet)[0],
            [InvestigationsFilterByFields.UNALLOCATED_DESK]: unAllocatedDeskToSet && Object.values(unAllocatedDeskToSet)[0],
            [InvestigationsFilterByFields.INVESTIGATOR_REFERENCE_STATUS]: investigatorRefernceStatusToSet && Object.values(investigatorRefernceStatusToSet)[0],
            [InvestigationsFilterByFields.CHAT_STATUS]: chatStatusFilterToSet && Object.values(chatStatusFilterToSet)[0],
            [InvestigationsFilterByFields.INVESTIGATOR_REFERENCE_REQUIRED]: investigatorReferenceRequiredFilterToSet && Object.values(investigatorReferenceRequiredFilterToSet)[0],
            [InvestigationsFilterByFields.INCOMPLETED_BOT_INVESTIGATION]: incompletedBotInvestigationFilterToSet && Object.values(incompletedBotInvestigationFilterToSet)[0]
        }
    };

    const [filterRules, setFitlerRules] = useState<any>(getFilterRules());
    const [isBadgeInVisible, setIsBadgeInVisible] = useState<boolean>(true);

    const user = useSelector<StoreStateType, User>(state => state.user.data);
    const isLoading = useSelector<StoreStateType, boolean>(state => state.isLoading);
    const isLoggedIn = useSelector<StoreStateType, boolean>(state => state.user.isLoggedIn);
    const userType = useSelector<StoreStateType, number>(state => state.user.data.userType);
    const displayedCounty = useSelector<StoreStateType, number>(state => state.user.displayedCounty);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const axiosInterceptorId = useSelector<StoreStateType, number>(state => state.investigation.axiosInterceptorId);
    const windowTabsBroadcastChannel = useRef(new BroadcastChannel(BC_TABS_NAME));

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

    const changeUpdateDateFilter = (dateStringFilter: string) => {
        updateFilterHistory('updateDateFilter', dateStringFilter);
        setUpdateDateFilter(dateStringFilter);
        handleFilterChange(filterCreators.UNUSUAL_IN_PROGRESS(dateStringFilter))
        setCurrentPage(defaultPage);
    };

    const changeNonContactFilter = (isNonContact: boolean) => {
        updateFilterHistory('nonContactFilter', isNonContact);
        setNonContactFilter(isNonContact);
        handleFilterChange(filterCreators.UNUSUAL_COMPLETED_NO_CONTACT(isNonContact))
        setCurrentPage(defaultPage);
    };

    const changeSearchFilter = (searchQuery: string) => {
        handleFilterChange(filterCreators.SEARCH_BAR(searchQuery))
    };

    const changeStatusFilter = (statuses: InvestigationMainStatus[]) => {
        const statusesIds = statuses.map(status => status.id);
        updateFilterHistory('statusFilter', statusesIds);
        setStatusFilter(statusesIds);
        handleFilterChange(filterCreators.STATUS(statusesIds));
        setCurrentPage(defaultPage);
    };

    const changeSubStatusFilter = (subStatuses: SubStatus[]) => {
        const subStatusesIds = subStatuses.map(subStatus => subStatus.displayName);
        updateFilterHistory('subStatusFilter', subStatusesIds);
        setSubStatusFilter(subStatusesIds);
        handleFilterChange(filterCreators.SUB_STATUS(subStatusesIds));
        setCurrentPage(defaultPage);
    };

    const changeInvestigatorReferenceStatusFilter = (statuses: KeyValuePair[]) => {
        const investigatorReferenceStatusesIds = statuses.map(status => status.id);
        updateFilterHistory('investigatorReferenceStatusFilter', investigatorReferenceStatusesIds);
        setInvestigatorReferenceStatusFilter(investigatorReferenceStatusesIds);
        handleFilterChange(filterCreators.INVESTIGATOR_REFERENCE_STATUS(investigatorReferenceStatusesIds));
        setCurrentPage(defaultPage);
    };

    const changeChatStatusFilter = (statuses: KeyValuePair[]) => {
        const chatStatusesIds = statuses.map(status => status.id);
        updateFilterHistory('chatStatusFilter', chatStatusesIds);
        setChatStatusFilter(chatStatusesIds);
        handleFilterChange(filterCreators.CHAT_STATUS(chatStatusesIds));
        setCurrentPage(defaultPage);
    };

    const changeUnassginedUserFilter = (value: boolean) => {
        updateFilterHistory('unassignedUserFilter', value);
        setUnassignedUserFilter(value);
        if (inactiveUserFilter === true) {
            if (value === true) {
                delete filterRules[InvestigationsFilterByFields.INACTIVE_USER];
                handleFilterChange(filterCreators.UNALLOCATED_USER(value));
            } else {
                delete filterRules[InvestigationsFilterByFields.UNALLOCATED_USER];
                handleFilterChange(filterCreators.INACTIVE_USER(true));
            }
        } else {
            handleFilterChange(filterCreators.UNASSIGNED_USER(value));
        }
        setCurrentPage(defaultPage);
    };

    const changeInactiveUserFilter = (value: boolean) => {
        updateFilterHistory('inactiveUserFilter', value);
        setInactiveUserFilter(value);
        if (unassignedUserFilter === true) {
            if (value === true) {
                delete filterRules[InvestigationsFilterByFields.UNASSIGNED_USER];
                handleFilterChange(filterCreators.UNALLOCATED_USER(value));
            } else {
                delete filterRules[InvestigationsFilterByFields.UNALLOCATED_USER];
                handleFilterChange(filterCreators.UNASSIGNED_USER(true));
            }
        } else {
            handleFilterChange(filterCreators.INACTIVE_USER(value));
        }
        setCurrentPage(defaultPage);
    };

    const changeUnallocatedDeskFilter = (value: boolean) => {
        updateFilterHistory('unallocatedDeskFilter', value);
        setUnallocatedDeskFilter(value);
        handleFilterChange(filterCreators.UNALLOCATED_DESK(value));
        setCurrentPage(defaultPage);
    };

    const changeInvestigatorReferenceRequiredFilter = (value: boolean) => {
        updateFilterHistory('investigatorReferenceRequiredFilter', value);
        setInvestigatorReferenceRequiredFilter(value);
        handleFilterChange(filterCreators.INVESTIGATOR_REFERENCE_REQUIRED(value));
        setCurrentPage(defaultPage);
    };
    
    const changeIncompletedBotInvestigationFilter = (value: boolean) => {
        updateFilterHistory('incompletedBotInvestigationFilter', value);
        setIncompletedBotInvestigationFilter(value);
        handleFilterChange(filterCreators.INCOMPLETED_BOT_INVESTIGATION(value));
        setCurrentPage(defaultPage);
    };

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

    const canChangeStatusNewToInProcess = (investigationStatus: Number, investigationInvestigator?: string) => {
        return investigationStatus === InvestigationMainStatusCodes.NEW &&
            (userType === UserTypeCodes.INVESTIGATOR || investigationInvestigator === user.id);
    };

    const fetchAllInvestigationStatuses = () => {
        const investigationStatusesLogger = logger.setup('Fetch Investigation Statuses');
        investigationStatusesLogger.info('sending request to DB', Severity.LOW);
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
    };

    const fetchAllInvestigationComplexityReasons = () => {
        const investigationStatusesLogger = logger.setup('Fetch All Complexity Reasons');
        investigationStatusesLogger.info('sending request to DB', Severity.LOW);
        axios.get('/investigationInfo/complexityReasons').
            then((result) => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    investigationStatusesLogger.info('The investigations complexity reasons were fetched successfully', Severity.LOW);
                    const allComplexReasons: (number | null)[] = (result.data).map((reason: { description: any; }) => reason.description)
                    setComplexReasons(allComplexReasons)
                } else {
                    investigationStatusesLogger.error('Got 200 status code but results structure isnt as expected', Severity.HIGH);
                }
            })
            .catch((err) => {
                alertError('לא הצלחנו לשלוף את כל הסיבות לחקירות מורכבות');
                investigationStatusesLogger.error(err, Severity.HIGH);
            })
    };

    const fetchAllInvestigationSubStatuses = () => {
        const subStatusesLogger = logger.setup('Fetch All Investigation Sub Statuses');
        subStatusesLogger.info('sending request to DB', Severity.LOW);
        axios.get('/landingPage/investigationSubStatuses').
            then((result) => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    subStatusesLogger.info('The investigations statuses were fetched successfully', Severity.LOW);
                    const allSubStatuses: SubStatus[] = result.data;
                    setAllSubStatuses(allSubStatuses);
                } else {
                    subStatusesLogger.error('Got 200 status code but results structure isnt as expected', Severity.HIGH);
                }
            })
            .catch((err) => {
                subStatusesLogger.error(err, Severity.HIGH);
            })
    };
    
    const fetchAllBotInvestigationStatuses = () =>{
            fetchAllInvestigatorReferenceStatuses().then(data => {
                if (data) dispatch(setInvestigatorReferenceStatuses(data));
            });
            fetchAllChatStatuses().then(data => {
                if (data) dispatch(setChatStatuses(data));
            });
       
    }

    useEffect(() => {
        resetInvestigationState();
        fetchAllInvestigationStatuses();
        fetchAllInvestigationSubStatuses();
        fetchAllInvestigationComplexityReasons();
        fetchAllBotInvestigationStatuses();
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
        let filterRulesToSet = { ...filterRules };
        if (Object.values(filterBy)[0] !== null) {
            filterRulesToSet = {
                ...filterRulesToSet,
                ...filterBy
            }
        } else {
            delete filterRulesToSet[Object.keys(filterBy)[0]]
        }
        setFitlerRules(filterRulesToSet);
    };

    const fetchInvestigationsAxiosRequest = (): any => {
        const investigationsLogger = logger.setup('Getting Investigations');

        const requestData = {
            orderBy,
            size: rowsPerPage,
            currentPage,
            filterRules: Object.values(filterRules).reduce((obj, item) => Object.assign(obj, item), {}),
        };

        if (userType === UserTypeCodes.ADMIN || userType === UserTypeCodes.SUPER_ADMIN) {
            investigationsLogger.info('user is admin so landingPage/groupInvestigations route is chosen', Severity.LOW);
            return axios.post('landingPage/groupInvestigations', { ...requestData, county: displayedCounty })
        }

        investigationsLogger.info('user isnt admin so landingPage/investigations route is chosen', Severity.LOW);
        return axios.post('/landingPage/investigations', requestData);
    };

    const sortUsersByAvailability = (firstUser: User, secondUser: User) => {
        return (
            firstUser.newInvestigationsCount - secondUser.newInvestigationsCount
            || firstUser.activeInvestigationsCount - secondUser.activeInvestigationsCount
        )
    };

    const fetchAllCountyUsers = async () => {
        const countyUsersLogger = logger.setup('Getting group users');
        countyUsersLogger.info('requesting the server the connected admin group users', Severity.LOW);
        const countyUsers: Map<string, AllocatedInvestigator> = new Map();
        try {
            const result = await axios.get(`/users/group/${displayedCounty}`);
            if (result && result.data) {
                result.data.forEach((user: any) => {
                    countyUsers.set(user.id, {
                        ...user,
                        userName: user.username,
                        authorityName: user.authorityname,
                        newInvestigationsCount: user.newinvestigationscount,
                        activeInvestigationsCount: user.activeinvestigationscount,
                        pauseInvestigationsCount: user.pauseinvestigationscount,
                        sourceOrganization: user.sourceorganization
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
    };

    const getFormattedDate = (date: string) => {
        return format(truncateDate(date), 'dd/MM')
    };

    const fetchTableData = async () => {
        const fetchInvestigationsLogger = logger.setup('Getting Investigations');
        if (isLoggedIn) {
            setIsLoading(true);
            fetchInvestigationsLogger.info(`launching the selected request to the DB ordering by ${orderBy}`, Severity.LOW);
            fetchInvestigationsAxiosRequest()
                .then((response: any) => {
                    fetchInvestigationsLogger.info('got response from the server', Severity.LOW);
                    const { data } = response;
                    let allInvestigationsRawData: any = [];

                    if (displayedCounty !== -1) {
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
                                const isInInstitute = investigation.investigatedPatientByInvestigatedPatientId?.investigatedPatientRoleByRole?.displayName === 'שוהה במוסד'
                                const lastChatDate = investigation.botInvestigation ? investigation.botInvestigation?.lastChatDate : '';
                                return createRowData(
                                    investigation.epidemiologyNumber,
                                    covidPatient.validationDate,
                                    investigation.isComplex,
                                    investigation.complexityReasonsId,
                                    investigation.priority,
                                    investigation.investigationStatusByInvestigationStatus,
                                    subStatus,
                                    covidPatient.fullName,
                                    covidPatient.primaryPhone,
                                    covidPatient.age,
                                    patientCity ? patientCity.displayName : '',
                                    desk,
                                    county,
                                    { id: user.id, userName: user.userName, isActive: user.isActive, authorityName: user.authorityByAuthorityId?.authorityName },
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
                                    investigation.selfInvestigationUpdateTime,
                                    lastChatDate,
                                    investigation.botInvestigation?.investigatiorReferenceRequired,
                                    investigation.botInvestigation?.chatStatus,
                                    investigation.botInvestigation?.investigatorReferenceStatus
                                )
                            });
                        investigationRows
                            .filter((row) => row.groupId !== null && !investigationColor.current.has(row.groupId))
                            .forEach((row) => {
                                investigationColor.current.set(row.groupId, getColorByGroupId(row.groupId));
                            });
                        setRows(investigationRows);
                        setIsLoading(false);
                    } else {
                        fetchInvestigationsLogger.warn('user investigation group is invalid', Severity.MEDIUM);
                    }
                })
                .catch((err: any) => {
                    alertError(FETCH_ERROR_TITLE);
                    setIsLoading(false);
                    fetchInvestigationsLogger.error(err, Severity.HIGH);
                });
        }
    };

    useEffect(() => {
        windowTabsBroadcastChannel.current.onmessage = () => {
            fetchAllGroupedInvestigations();
            fetchTableData();
        };
    });

    const { startWaiting, onCancel, onOk, snackbarOpen } = usePageRefresh(fetchTableData, TABLE_REFRESH_INTERVAL);

    useEffect(() => {
        fetchTableData();
        setIsBadgeInVisible(!Boolean(Object.values(filterRules).find(item => item !== null)))
    }, [isLoggedIn, filterRules, orderBy, currentPage, displayedCounty, userType]);

    useEffect(() => {
        setCurrentPage(defaultPage);
    }, [displayedCounty, userType]);

    const onInvestigationRowClick = async (investigationRow: { [T in keyof IndexedInvestigationData]: any }) => {
        const epidemiologyNum: number = investigationRow.epidemiologyNumber
        const getComplexityReasonClickLogger = logger.setupVerbose({
            workflow: 'get Complexity Reason when opening an investigation',
            investigation: investigationRow.epidemiologyNumber,
            user: user.id
        });
        await axios.get('/investigationInfo/getComplexityReason/' + epidemiologyNum)
            .then((result) => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    setComplexReasonsId(result.data)
                    getComplexityReasonClickLogger.info('the chosen investigation have complexity reasons', Severity.LOW);
                } else {
                    setComplexReasonsId([])
                    getComplexityReasonClickLogger.info('the chosen investigation dont have complexity reasons', Severity.LOW);
                }
            })
            .catch((errorMessage) => { getComplexityReasonClickLogger.error(errorMessage, Severity.HIGH); })

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
    };

    const convertToIndexedRow = (row: InvestigationTableRow): IndexedInvestigationData => {
        return {
            [TableHeadersNames.color]: '',
            [TableHeadersNames.rowIndicators]: '',
            [TableHeadersNames.multipleCheck]: row.isChecked,
            [TableHeadersNames.epidemiologyNumber]: row.epidemiologyNumber,
            [TableHeadersNames.validationDate]: getFormattedDate(row.validationDate),
            [TableHeadersNames.isComplex]: row.isComplex,
            [TableHeadersNames.priority]: row.priority,
            [TableHeadersNames.fullName]: row.fullName,
            [TableHeadersNames.phoneNumber]: row.phoneNumber,
            [TableHeadersNames.age]: row.age,
            [TableHeadersNames.city]: row.city,
            [TableHeadersNames.subOccupation]: row.subOccupation,
            [TableHeadersNames.investigatorName]: row.investigator.authorityName ?
                row.investigator.userName + ' - ' + row.investigator.authorityName :
                row.investigator.userName,
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
            [TableHeadersNames.lastChatDate]: row.lastChatDate ? getFormattedDate(row.lastChatDate) : '',
            [TableHeadersNames.chatStatus]: row.chatStatus?.displayName,
            [TableHeadersNames.investigatiorReferenceRequired]: row.investigatiorReferenceRequired,
            [TableHeadersNames.investigatorReferenceStatus]: row.investigatorReferenceStatus?.displayName
        }
    };

    const getInvestigationsOldValues = (investigations: InvestigationTableRow[], key: TableKeys, isCounty?: boolean) => (
        investigations
            .map(investigation => `${investigation.epidemiologyNumber}: ${isCounty ? investigation.county.id : convertToIndexedRow(investigation)[key as TableHeadersNames]}`)
            .join(', ')
    );

    const logInvestigationTransfer = (epidemiologyNumbers: number[], key: TableKeys, newValue: number | string, reason?: string) => {
        const investigations = rows.filter(investigation => epidemiologyNumbers.includes(investigation.epidemiologyNumber))
        const investigationsPreviousValues = getInvestigationsOldValues(investigations, key, key === HiddenTableKeys.county);
        return `launching request to transfer the investigations ${key} to ${newValue} from their old values: {${investigationsPreviousValues}} ${reason ? `due to ${reason}` : ''}`;
    };

    const logGroupTransfer = (groupIds: string[], key: TableKeys, newValue: number | string, reason?: string) => {
        const groups = Array.from(allGroupedInvestigations.keys()).filter(groupId => groupIds.includes(groupId))
        const investigationsPreviousValues = groups
            .map(groupId => `group ${groupId}- investigations:{${getInvestigationsOldValues
                (allGroupedInvestigations.get(groupId) as InvestigationTableRow[], key, key === HiddenTableKeys.county)}}`)
            .join(', ');
        return `launching request to transfer the groups investigations ${key} to ${newValue} from their old values: ${investigationsPreviousValues} ${reason ? `due to ${reason}` : ''}`;
    };

    const getUserMapKeyByValue = (map: Map<string, User>, value: string): string => {
        const key = Array.from(map.keys()).find(key => map.get(key)?.userName === value);
        return key ? key : ''
    };

    const changeGroupsInvestigator = async (groupIds: string[], investigator: InvestigatorOption | null, transferReason?: string) => {
        const changeGroupsInvestigatorLogger = logger.setup('Change groups investigator');
        const joinedGroupIds = groupIds.join(', ');
        changeGroupsInvestigatorLogger.info(logGroupTransfer(groupIds, TableHeadersNames.investigatorName, investigator?.value.userName || ''), Severity.LOW);
        try {
            await axios.post('/users/changeGroupInvestigator', {
                groupIds,
                user: investigator?.id,
                county: displayedCounty,
                transferReason
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
                reason: transferReason,
                county: displayedCounty
            });
            changeDeskLogger.info(logGroupTransfer(groupIds, TableHeadersNames.investigationDesk, newSelectedDesk?.deskName || '', transferReason), Severity.LOW);
            setSelectedRow(DEFAULT_SELECTED_ROW);
        } catch (error) {
            changeDeskLogger.error(`couldn't change the desk for group ${joinedGroupIds} due to ${error}`, Severity.HIGH);
            alertError(UPDATE_ERROR_TITLE);
        } finally {
            if (groupIds[0]) {
                await Promise.all(
                    groupIds.map(async (groupId: string) => {
                        await fetchInvestigationsByGroupId(groupId);
                    })
                );
            }

            fetchTableData();
        }
    };

    const changeGroupsCounty = async (groupIds: string[], newSelectedCounty: County | null, transferReason: string) => {
        const changeCountyLogger = logger.setup('Change Grouped Investigations County');
        try {
            await axios.post('/users/changeGroupCounty', {
                groupIds,
                newCounty: newSelectedCounty?.id,
                county: displayedCounty,
                transferReason,
            });
            changeCountyLogger.info(logGroupTransfer(groupIds, HiddenTableKeys.county, newSelectedCounty?.id || '', transferReason), Severity.LOW);
            setSelectedRow(DEFAULT_SELECTED_ROW);
            if (groupIds[0]) {
                await Promise.all(
                    groupIds.map(async (groupId: string) => {
                        await fetchInvestigationsByGroupId(groupId);
                    })
                );
            };
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
    };

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
    };

    const getDefaultCellStyles = (cellKey: string) => {
        let classNames: string[] = [];
        classNames.push(classes.font);
        if(cellKey === TableHeadersNames.multipleCheck){
            classNames.push(classes.watchBtn);
        }
        if(cellKey === TableHeadersNames.rowIndicators){
            classNames.push(classes.biggerWidth);
        }
        if (cellKey !== TableHeadersNames.color) {
            classNames.push(classes.tableCell);
        }
        if (cellKey === TableHeadersNames.investigatorName) {
            classNames.push(classes.columnBorder);
        }
        if (cellKey === TableHeadersNames.investigatiorReferenceRequired) {
            classNames.push(classes.columnBorder);
        }
        else
            if (cellKey === TableHeadersNames.priority) {
                classNames.push(classes.priorityTableCell);
            }

        return classNames;
    };

    const getNestedCellStyle = (isLast: boolean) => (cellKey: string) => {
        let classNames = getDefaultCellStyles(cellKey);

        if (isLast) {
            classNames.push(classes.rowBorder);
        } else {
            classNames.push(classes.nestedTableCell);
        }

        return classNames;
    };

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
    };

    const cellNeedsABorder = (rowIndex: number) => {
        const currentRow = rows[rowIndex];
        const nextRow = rows[rowIndex + 1];

        const isNotLastRow = (rows.length - 1 !== rowIndex);
        const hasATestDate = Boolean(currentRow?.validationDate);
        const isLastOfDate = (getFormattedDate(currentRow?.validationDate) !== getFormattedDate(Boolean(nextRow) ?
            nextRow.validationDate :
            '9999/12/31'));

        return ((isDefaultOrder && !isLoading) &&
            isNotLastRow &&
            hasATestDate &&
            isLastOfDate)
    };

    const sortInvestigationTable = (orderByValue: string) => {
        setIsDefaultOrder(orderByValue === defaultOrderBy);
        setOrderBy(orderByValue);
        setCurrentPage(defaultPage);
    };

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
                        const isInInstitute = investigation.investigatedPatientByInvestigatedPatientId?.investigatedPatientRoleByRole?.displayName === 'שוהה במוסד'
                        return createRowData(
                            investigation.epidemiologyNumber,
                            covidPatient.validationDate,
                            investigation.isComplex,
                            investigation.complexityReasonsId,
                            investigation.priority,
                            investigation.investigationStatusByInvestigationStatus,
                            subStatus,
                            covidPatient.fullName,
                            covidPatient.primaryPhone,
                            covidPatient.age,
                            patientCity ? patientCity.displayName : '',
                            desk,
                            county,
                            { id: user.id, userName: user.userName, isActive: user.isActive, authorityName: user.authorityByAuthorityId?.authorityName },
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
                            investigation.selfInvestigationUpdateTime,
                            investigation.botInvestigation?.lastChatDate,
                            investigation.botInvestigation?.investigatiorReferenceRequired,
                            investigation.botInvestigation?.chatStatus,
                            investigation.botInvestigation?.investigatorReferenceStatus
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
            setIsLoading(false);
        }
    };

    const isAdmin = userType === UserTypeCodes.ADMIN || userType === UserTypeCodes.SUPER_ADMIN;

    const noAdminFilterTitle = welcomeMessage;

    const tableTitle = useMemo(() => {
        if (isAdminLandingRedirect === false || !isAdmin) {
            return noAdminFilterTitle;
        }
        return filterTitle || noAdminFilterTitle;
    }, [rows]);

    const fetchAllGroupedInvestigations = async () => {
        const allGroupIds = new Set<string>();
        rows.forEach(row => {
            const { groupId } = row;
            groupId && allGroupIds.add(groupId)
        });
        const allGroupIdsArr = Array.from(allGroupIds);

        if (allGroupIdsArr[0]) {
            await Promise.all(
                allGroupIdsArr.map(async (groupId: string) => {
                    await fetchInvestigationsByGroupId(groupId);
                })
            );
        }
    };

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
        subStatusFilter,
        changeSubStatusFilter,
        changeStatusFilter,
        deskFilter,
        changeDeskFilter,
        changeSearchFilter,
        changeUnassginedUserFilter,
        changeTimeRangeFilter,
        changeUnallocatedDeskFilter,
        unassignedUserFilter,
        changeInactiveUserFilter,
        inactiveUserFilter,
        fetchAllCountyUsers,
        tableTitle,
        timeRangeFilter,
        isBadgeInVisible,
        nonContactFilter,
        changeNonContactFilter,
        updateDateFilter,
        changeUpdateDateFilter,
        unallocatedDeskFilter,
        fetchAllGroupedInvestigations,
        changeInvestigatorReferenceStatusFilter,
        changeInvestigatorReferenceRequiredFilter,
        investigatorReferenceRequiredFilter,
        investigatorReferenceStatusFilter,
        chatStatusFilter,
        changeChatStatusFilter,
        incompletedBotInvestigationFilter,
        changeIncompletedBotInvestigationFilter     
    };
};

export default useInvestigationTable;
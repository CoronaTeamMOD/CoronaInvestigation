import { useEffect, useState, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { format } from 'date-fns';
import { SweetAlertResult } from 'sweetalert2';

import User from 'models/User';
import theme from 'styles/theme';
import County from 'models/County';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import userType from 'models/enums/UserType';
import { persistor } from 'redux/store';
import Investigator from 'models/Investigator';
import { activateIsLoading } from 'Utils/axios';
import StoreStateType from 'redux/storeStateType';
import { BC_TABS_NAME } from 'models/BroadcastMessage';
import usePageRefresh from 'Utils/vendor/usePageRefresh';
import { initialUserState } from 'redux/User/userReducer';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import InvestigationTableRow from 'models/InvestigationTableRow';
import InvestigationMainStatus from 'models/InvestigationMainStatus';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';
import { setLastOpenedEpidemiologyNum } from 'redux/Investigation/investigationActionCreators';
import { setInvestigationStatus, setCreator } from 'redux/Investigation/investigationActionCreators';
import { setAxiosInterceptorId } from 'redux/Investigation/investigationActionCreators';
import InvestigatorOption from 'models/InvestigatorOption';
import Desk from 'models/Desk';

import useStyle from './InvestigationTableStyles';
import { defaultOrderBy, rowsPerPage, defaultPage, HistoryState } from './InvestigationTable';
import {
    TableHeadersNames,
    IndexedInvestigation,
    IndexedInvestigationData,
    investigatorIdPropertyName
} from './InvestigationTablesHeaders';
import { useInvestigationTableOutcome, useInvestigationTableParameters } from './InvestigationTableInterfaces';
import { useHistory } from 'react-router-dom';

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
    reasonId: number
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
    reasonId
});

const TABLE_REFRESH_INTERVAL = 30;
export const UNDEFINED_ROW = -1;
const FETCH_ERROR_TITLE = 'אופס... לא הצלחנו לשלוף';
const UPDATE_ERROR_TITLE = 'לא הצלחנו לעדכן את החקירה';
const OPEN_INVESTIGATION_ERROR_TITLE = 'לא הצלחנו לפתוח את החקירה';
export const transferredSubStatus = 'נדרשת העברה';
export const allStatusesOption: InvestigationMainStatus = { id: -1, displayName: 'הכל' };

const useInvestigationTable = (parameters: useInvestigationTableParameters): useInvestigationTableOutcome => {
    const { setSelectedRow, setAllCounties, setAllUsersOfCurrCounty,
        setAllStatuses, setAllDesks, currentPage, setCurrentPage, setAllGroupedInvestigations, allGroupedInvestigations,
        investigationColor } = parameters;

    const classes = useStyle(false)();
    const { alertError, alertWarning } = useCustomSwal();
    const history = useHistory<HistoryState>();
    const { filterRules: historyFilterRules = {} } = useMemo(() => {
        const { location: { state } } = history;
        return state || {};
    }, []);

    const [rows, setRows] = useState<InvestigationTableRow[]>([]);
    const [isDefaultOrder, setIsDefaultOrder] = useState<boolean>(true);
    const [orderBy, setOrderBy] = useState<string>(defaultOrderBy);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [filterRules, setFilterRules] = useState<any>(historyFilterRules);
    const [unassignedInvestigationsCount, setUnassignedInvestigationsCount] = useState<number>(0);

    const user = useSelector<StoreStateType, User>(state => state.user.data);
    const isLoggedIn = useSelector<StoreStateType, boolean>(state => state.user.isLoggedIn);
    const isLoading = useSelector<StoreStateType, boolean>(state => state.isLoading);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const axiosInterceptorId = useSelector<StoreStateType, number>(state => state.investigation.axiosInterceptorId);
    const windowTabsBroadcatChannel = useRef(new BroadcastChannel(BC_TABS_NAME));

    const fetchAllDesksByCountyId = () => {
        const desksByCountyIdLogger = logger.setup({
            workflow: 'Getting Desks by county id',
        });
        axios.get('/desks/county')
            .then((result) => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    desksByCountyIdLogger.info('The desks were fetched successfully', Severity.LOW);
                    setAllDesks(result.data);
                } else {
                    desksByCountyIdLogger.error('Got 200 status code but results structure isnt as expected', Severity.HIGH);
                }
            })
            .catch((err) => {
                alertError('לא הצלחנו לשלוף את כל הדסקים האפשריים לסינון');
                desksByCountyIdLogger.error(err, Severity.HIGH);
            })
    }

    const canChangeStatusNewToInProcess = (investigationStatus: Number, investigationInvestigator? : string) => {
        return investigationStatus === InvestigationMainStatusCodes.NEW && 
                (user.userType === userType.INVESTIGATOR || investigationInvestigator === user.id);
    };

    const fetchAllInvestigationStatuses = () => {
        const investigationStatusesLogger = logger.setup({
            workflow: 'GraphQL GET statuses request to the DB',
        });
        axios.get('/landingPage/investigationStatuses').
            then((result) => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    investigationStatusesLogger.info('The investigations statuses were fetched successfully', Severity.LOW);
                    const allStatuses: InvestigationMainStatus[] = result.data;
                    allStatuses.unshift(allStatusesOption);
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
        windowTabsBroadcatChannel.current.onmessage = () => fetchTableData();
    }, [])

    const moveToTheInvestigationForm = async (epidemiologyNumberVal: number) => {
        const investigationClickLogger = logger.setup({
            workflow: 'Investigation click',
            investigation: epidemiologyNumberVal
        });
        setLastOpenedEpidemiologyNum(epidemiologyNumberVal);
        investigationClickLogger.info(`Entered investigation: ${epidemiologyNumberVal}`, Severity.LOW);
        await persistor.flush();
        window.open(investigationURL);
        fetchTableData();
    }

    const getInvestigationsAxiosRequest = (orderBy: string): any => {
        const getInvestigationsLogger = logger.setup({
            workflow: 'Getting Investigations',
            user: user.id
        });
        if (user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) {
            getInvestigationsLogger.info('user is admin so landingPage/groupInvestigations route is chosen', Severity.LOW);
            return axios.post('landingPage/groupInvestigations', {
                orderBy,
                size: rowsPerPage,
                currentPage: currentPage,
                filterRules
            })
        }
        getInvestigationsLogger.info('user isnt admin so landingPage/investigations route is chosen', Severity.LOW);
        return axios.post('/landingPage/investigations', {
            orderBy,
            size: rowsPerPage,
            currentPage: currentPage,
            filterRules
        });
    }

    const sortUsersByAvailability = (fisrtUser: User, secondUser: User) =>
        fisrtUser.newInvestigationsCount - secondUser.newInvestigationsCount ||
        fisrtUser.activeInvestigationsCount - secondUser.activeInvestigationsCount

    const fetchAllCountyUsers = () => {
        const countyUsersLogger = logger.setup({
            workflow: 'Getting group users',
            user: user.id
        });
        countyUsersLogger.info('requesting the server the connected admin group users', Severity.LOW);
        axios.get(`/users/group`)
            .then((result: any) => {
                let countyUsers: Map<string, User> = new Map();
                if (result && result.data) {
                    result.data.forEach((user: any) => {
                        countyUsers.set(user.id, {
                            ...user,
                            newInvestigationsCount: user.newInvestigationsCount.totalCount,
                            activeInvestigationsCount: user.activeInvestigationsCount.totalCount,
                        })
                        countyUsers = new Map(Array.from(countyUsers.entries())
                            .sort((fisrtUser, secondUser) => sortUsersByAvailability(fisrtUser[1], secondUser[1])));
                    });
                    countyUsersLogger.info('fetched all the users successfully', Severity.LOW);
                    setAllUsersOfCurrCounty(countyUsers);
                } else {
                    countyUsersLogger.warn('the connected admin doesnt have group users', Severity.MEDIUM);
                }
            }).catch(err => {
                countyUsersLogger.error(err, Severity.HIGH);
                alertError(FETCH_ERROR_TITLE);
            });
    }

    const fetchAllCounties = () => {
        const fetchAllCountiesLogger = logger.setup({
            workflow: 'GraphQL request to the DB',
        });
        axios.get('/counties').then((result: any) => {
            const allCounties: Map<number, County> = new Map();
            result && result.data && result.data.forEach((county: any) => {
                allCounties.set(county.id, {
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

    const fetchTableData = () => {
        const fetchInvestigationsLogger = logger.setup({
            workflow: 'Getting Investigations',
            user: user.id
        });
        setIsLoading(true);
        if (user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) {
            fetchAllCountyUsers();
            fetchAllCounties();
        }
        if (user.userName !== initialUserState.data.userName) {
            fetchInvestigationsLogger.info(`launching the selected request to the DB ordering by ${orderBy}`, Severity.LOW);
            getInvestigationsAxiosRequest(orderBy)
                .then((response: any) => {
                    fetchInvestigationsLogger.info('got respond from the server', Severity.LOW);

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
                                    { id: user.id, userName: user.userName },
                                    investigation.comment,
                                    statusReason,
                                    wasInvestigationTransferred,
                                    transferReason,
                                    groupId,
                                    canFetchGroup,
                                    groupReason,
                                    otherReason,
                                    reasonId
                                )
                            });
                        setRows(investigationRows);
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
                        setIsLoading(false);
                    } else {
                        fetchInvestigationsLogger.warn('user investigation group is invalid', Severity.MEDIUM);
                    }
                })
                .catch((err: any) => {
                    alertError('אופס... לא הצלחנו לשלוף');
                    fetchInvestigationsLogger.error(err, Severity.HIGH);
                });
        }
    };

    const { startWaiting, onCancel, onOk, snackbarOpen } = usePageRefresh(fetchTableData, TABLE_REFRESH_INTERVAL);

    const handleFilterChange = (filterBy: any) => {
        const nextFilterRules = Object.entries(filterBy).reduce((previousValue, [filterKey, filterValue]) => {
            if (filterValue) {
                return {
                    ...previousValue,
                    [filterKey]: filterValue
                }
            }

            delete previousValue[filterKey as any];
            return previousValue;
        }, { ...filterRules });
        const { location: { state } } = history;
        history.replace({
            state: {
                ...state,
                filterRules: nextFilterRules
            }
        });
        setFilterRules(nextFilterRules);
        setCurrentPage(defaultPage);
    }

    useEffect(() => {
        if (isLoggedIn) {
            fetchTableData();
        }
    }, [isLoggedIn, currentPage, orderBy, filterRules]);

    const onInvestigationRowClick = (investigationRow: { [T in keyof IndexedInvestigationData]: any }) => {
        const investigationClickLogger = logger.setup({
            workflow: 'Investigation click',
            investigation: investigationRow.epidemiologyNumber,
            user: user.id
        });

        if (epidemiologyNumber !== investigationRow.epidemiologyNumber) {
            investigationClickLogger.info('the clicked investigation is not the first one', Severity.LOW);
            const newInterceptor = axios.interceptors.request.use(
                (config) => {
                    config.headers.EpidemiologyNumber = investigationRow.epidemiologyNumber;
                    activateIsLoading(config);
                    return config;
                },
                (error) => Promise.reject(error)
            );
            setAxiosInterceptorId(newInterceptor);
            axiosInterceptorId !== -1 && axios.interceptors.request.eject(axiosInterceptorId);
        }
        const indexOfInvestigationObject = rows.findIndex(currInvestigationRow => currInvestigationRow.epidemiologyNumber === investigationRow.epidemiologyNumber);
        indexOfInvestigationObject !== -1 &&
            setCreator(rows[indexOfInvestigationObject].investigator.id);
        if ( canChangeStatusNewToInProcess(investigationRow.investigationStatus.id,investigationRow.investigatorId)) {
            investigationClickLogger.info('the user clicked a new investigation', Severity.LOW);
            axios.post('/investigationInfo/updateInvestigationStartTime', {
                epidemiologyNumber: investigationRow.epidemiologyNumber
            })
                .then(async () => {
                    investigationClickLogger.info('updated investigation start time now sending request to update status', Severity.LOW);
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
                    } catch (e) {
                        throw new Error('failed to update investigation status with error' + JSON.stringify(e))
                    }
                })
                .catch((error) => {
                    investigationClickLogger.error(error, Severity.HIGH);
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
            [TableHeadersNames.multipleCheck]: row.isChecked,
            [TableHeadersNames.epidemiologyNumber]: row.epidemiologyNumber,
            [TableHeadersNames.coronaTestDate]: getFormattedDate(row.coronaTestDate),
            [TableHeadersNames.isComplex]: row.isComplex,
            [TableHeadersNames.priority]: row.priority,
            [TableHeadersNames.fullName]: row.fullName,
            [TableHeadersNames.phoneNumber]: row.phoneNumber,
            [TableHeadersNames.age]: row.age,
            [TableHeadersNames.city]: row.city,
            [TableHeadersNames.investigatorName]: row.investigator.userName,
            [investigatorIdPropertyName]: row.investigator.id,
            [TableHeadersNames.investigationStatus]: row.mainStatus,
            [TableHeadersNames.investigationSubStatus]: row.subStatus,
            [TableHeadersNames.statusReason]: row.statusReason,
            [TableHeadersNames.county]: row.county ? row.county.displayName : '',
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
        }
    }

    const getUserMapKeyByValue = (map: Map<string, User>, value: string): string => {
        const key = Array.from(map.keys()).find(key => map.get(key)?.userName === value);
        return key ? key : ''
    }

    const getCountyMapKeyByValue = (map: Map<number, County>, value: string): number => {
        const key = Array.from(map.keys()).find(key => map.get(key)?.displayName === value);
        return key ? key : 0;
    }

    const changeGroupsInvestigator = async (groupIds: string[], investigator: InvestigatorOption | null, transferReason?: string) => {
        const changeGroupsInvestigatorLogger = logger.setup({
            workflow: 'Change groups investigator',
            user: user.id,
        });
        const joinedGroupIds = groupIds.join(', ');
        changeGroupsInvestigatorLogger.info(`performing investigator change request for groups ${joinedGroupIds}`, Severity.LOW);
        try {
            await axios.post('/users/changeGroupInvestigator', {
                groupIds,
                user: investigator?.id,
                reason: transferReason
            });
            changeGroupsInvestigatorLogger.info(`the investigator have been changed successfully for groups ${joinedGroupIds}`, Severity.LOW);
        } catch (error) {
            changeGroupsInvestigatorLogger.error(`couldn't change investigator of groups ${joinedGroupIds} due to ${error}`, Severity.HIGH);
            alertError(UPDATE_ERROR_TITLE);
        }
    };

    const changeInvestigationsInvestigator = async (epidemiologyNumbers: number[], investigator: InvestigatorOption | null, transferReason?: string) => {
        const changeInvestigationsInvestigatorLogger = logger.setup({
            workflow: 'Change investigations investigator',
            user: user.id,
        });
        changeInvestigationsInvestigatorLogger.info('performing investigator change request', Severity.LOW);
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

    const changeCounty = async (indexedRow: IndexedInvestigation, newSelectedCounty: {id: number, value: County} | null) => {
        const changeCountyLogger = logger.setup({
            workflow: 'Change Investigation County',
            user: user.id,
            investigation: +indexedRow.epidemiologyNumber
        });
        changeCountyLogger.info(`alerted to change the county of investigation ${indexedRow.epidemiologyNumber} from ${indexedRow.county} to ${JSON.stringify(newSelectedCounty?.value)}`, Severity.LOW);
        const result: SweetAlertResult<any> = await alertWarning(`<p>האם אתה בטוח שאתה רוצה להחליף את נפה <b>${indexedRow.county}</b> בנפה <b>${newSelectedCounty?.value.displayName}</b>?</p>`, {
            showCancelButton: true,
            cancelButtonText: 'לא',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך'
        });
        if (result.isConfirmed) {
            changeCountyLogger.info(`confirmed changing county in investigation ${indexedRow.epidemiologyNumber}`, Severity.LOW);
            if (indexedRow.groupId) {
                changeCountyLogger.info(`performing county change request for group ${indexedRow.groupId}`, Severity.LOW);
                try {
                    axios.post('/users/changeGroupCounty', {
                        groupIds: [indexedRow.groupId],
                        county: newSelectedCounty?.id,
                    });
                    changeCountyLogger.info(`changed the county successfully for group ${indexedRow.groupId}`, Severity.LOW);
                    setSelectedRow(UNDEFINED_ROW);
                    fetchTableData();
                } catch (error) {
                    changeCountyLogger.error(`couldn't change the county for group ${indexedRow.groupId} due to ${error}`, Severity.HIGH);
                    alertError(UPDATE_ERROR_TITLE);
                }
            } else {
                changeCountyLogger.info('performing county change request', Severity.LOW);
                try {
                    axios.post('/users/changeCounty', {
                        epidemiologyNumber: indexedRow.epidemiologyNumber,
                        updatedCounty: newSelectedCounty?.id,
                    });
                    changeCountyLogger.info('changed the county successfully', Severity.LOW);
                    setSelectedRow(UNDEFINED_ROW);
                    fetchTableData();
                } catch (error) {
                    changeCountyLogger.error(`couldn't change the county due to ${error}`, Severity.HIGH);
                    alertError(UPDATE_ERROR_TITLE);
                }
            }
        } else if (result.isDismissed) {
            changeCountyLogger.info('dismissed changing the county', Severity.LOW);
            setSelectedRow(UNDEFINED_ROW);
        }
    }

    const changeGroupsDesk = async (groupIds: string[], newSelectedDesk: Desk | null, transferReason?: string) => {
        const changeDeskLogger = logger.setup({
            workflow: 'Change Groups Desk',
            user: user.id,
        });
        const joinedGroupIds = groupIds.join(', ');
        changeDeskLogger.info(`performing desk change request for group ${joinedGroupIds}`, Severity.LOW);
        try {
            await axios.post('/landingPage/changeGroupDesk', {
                groupIds,
                desk: newSelectedDesk?.id,
                reason: transferReason
            });
            changeDeskLogger.info(`changed the desk successfully for group ${joinedGroupIds}`, Severity.LOW);
            setSelectedRow(UNDEFINED_ROW);
            fetchTableData();
        } catch (error) {
            changeDeskLogger.error(`couldn't change the desk for group ${joinedGroupIds} due to ${error}`, Severity.HIGH);
            alertError(UPDATE_ERROR_TITLE);
        }
    };

    const changeInvestigationsDesk = async (epidemiologyNumbers: number[], newSelectedDesk: Desk | null, transferReason?: string) => {
        const changeDeskLogger = logger.setup({
            workflow: 'Change Groups Desk',
            user: user.id,
            investigation: epidemiologyNumbers.join(', ')
        });
        changeDeskLogger.info('performing desk change request', Severity.LOW);
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

    const getTableCellStyles = (rowIndex: number, cellKey: string) => {
        let classNames = [];

        classNames.push(classes.font);
        if (cellKey !== TableHeadersNames.color) {
            classNames.push(classes.tableCell);
        }
        if (cellKey === TableHeadersNames.investigatorName) {
            classNames.push(classes.columnBorder);
        } else if (cellKey === TableHeadersNames.priority) {
            classNames.push(classes.priorityTableCell);
        } 
        if ((isDefaultOrder && !isLoading) &&
            (rows.length - 1 !== rowIndex) &&
            rows[rowIndex]?.coronaTestDate &&
            (getFormattedDate(rows[rowIndex]?.coronaTestDate) !== getFormattedDate(rows[rowIndex + 1]?.coronaTestDate))) {
            classNames.push(classes.rowBorder)
        }

        return classNames;
    }

    const sortInvestigationTable = (orderByValue: string) => {
        setIsDefaultOrder(orderByValue === defaultOrderBy);
        setOrderBy(orderByValue);
        setCurrentPage(defaultPage);
    }

    const fetchInvestigationsByGroupId = async (groupId: string) => {
        const investigationsByGroupIdLogger = logger.setup({
            workflow: 'get investigations by group id',
            user: user.id,
            investigation: epidemiologyNumber
        });
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
                            { id: user.id, userName: user.userName },
                            investigation.comment,
                            statusReason,
                            wasInvestigationTransferred,
                            transferReason,
                            groupId,
                            canFetchGroup,
                            groupReason,
                            otherReason,
                            reasonId
                        )
                    });
                setAllGroupedInvestigations(allGroupedInvestigations.set(groupId, investigationRows))
            } else {
                investigationsByGroupIdLogger.error('Got 200 status code but results structure isnt as expected', Severity.HIGH);
            }
        } catch (err) {
            alertError('לא הצלחנו לשלוף את כל החקירות בקבוצה');
            investigationsByGroupIdLogger.error(err, Severity.HIGH);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        tableRows: rows,
        fetchTableData,
        onInvestigationRowClick,
        convertToIndexedRow,
        getTableCellStyles,
        sortInvestigationTable,
        getUserMapKeyByValue,
        getCountyMapKeyByValue,
        changeCounty,
        onCancel,
        onOk,
        snackbarOpen,
        moveToTheInvestigationForm,
        changeGroupsDesk,
        changeInvestigationsDesk,
        totalCount,
        handleFilterChange,
        unassignedInvestigationsCount,
        fetchInvestigationsByGroupId,
        changeGroupsInvestigator,
        changeInvestigationsInvestigator,
    };
};

export default useInvestigationTable;

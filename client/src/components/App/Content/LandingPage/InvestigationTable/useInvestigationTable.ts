import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { format } from 'date-fns';

import User from 'models/User';
import theme from 'styles/theme';
import County from 'models/County';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import userType from 'models/enums/UserType';
import { persistor, store } from 'redux/store';
import Investigator from 'models/Investigator';
import { timeout } from 'Utils/Timeout/Timeout';
import { activateIsLoading } from 'Utils/axios';
import StoreStateType from 'redux/storeStateType';
import { BC_TABS_NAME } from 'models/BroadcastMessage';
import usePageRefresh from 'Utils/vendor/usePageRefresh';
import { initialUserState } from 'redux/User/userReducer';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import InvestigationTableRow from 'models/InvestigationTableRow';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import InvestigationMainStatus from 'models/enums/InvestigationMainStatus';
import { setLastOpenedEpidemiologyNum } from 'redux/Investigation/investigationActionCreators';
import { setIsInInvestigation } from 'redux/IsInInvestigations/isInInvestigationActionCreators';
import { setInvestigationStatus, setCreator } from 'redux/Investigation/investigationActionCreators';
import { setAxiosInterceptorId, setIsCurrentlyLoading } from 'redux/Investigation/investigationActionCreators';

import useStyle from './InvestigationTableStyles';
import { defaultOrderBy, rowsPerPage, defaultPage } from './InvestigationTable';

import {
    TableHeadersNames,
    IndexedInvestigation,
    IndexedInvestigationData,
    investigatorIdPropertyName
} from './InvestigationTablesHeaders';
import { useInvestigationTableOutcome, useInvestigationTableParameters } from './InvestigationTableInterfaces';
import useInvestigatedPersonInfo
    from '../../InvestigationForm/InvestigationInfo/InvestigatedPersonInfo/useInvestigatedPersonInfo';

const investigationURL = '/investigation';
const groupedInvestigationsColors = ['#f05454', '#30475e', '#9ddfd3', '#ea86b6', '#ffa36c', '#ffe05d', '#c56183', '#794c74', '#158467', '#a8dda8'];

export const createRowData = (
    epidemiologyNumber: number,
    coronaTestDate: string,
    isComplex: boolean,
    priority: number,
    mainStatus: string,
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
    groupReason: string
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
    groupReason
});

const TABLE_REFRESH_INTERVAL = 30;
export const UNDEFINED_ROW = -1;
const FETCH_ERROR_TITLE = 'אופס... לא הצלחנו לשלוף';
const UPDATE_ERROR_TITLE = 'לא הצלחנו לעדכן את המשתמש';
const OPEN_INVESTIGATION_ERROR_TITLE = 'לא הצלחנו לפתוח את החקירה';
export const ALL_STATUSES_FILTER_OPTIONS = 'הכל';
export const transferredSubStatus = 'נדרשת העברה';

const useInvestigationTable = (parameters: useInvestigationTableParameters): useInvestigationTableOutcome => {
    const { selectedInvestigator, setSelectedRow, setAllCounties, setAllUsersOfCurrCounty,
        setAllStatuses, setAllDesks, currentPage, setCurrentPage, setAllGroupedInvestigations, allGroupedInvestigations,
        coloredGroupedRows, investigationColor } = parameters;

    const { shouldUpdateInvestigationStatus } = useInvestigatedPersonInfo();

    const classes = useStyle(false)();
    const { alertError, alertWarning } = useCustomSwal();

    const [rows, setRows] = useState<InvestigationTableRow[]>([]);
    const [isDefaultOrder, setIsDefaultOrder] = useState<boolean>(true);
    const [orderBy, setOrderBy] = useState<string>(defaultOrderBy);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [filterRules, setFilterRules] = useState<any>({});
    const [unassignedInvestigationsCount, setUnassignedInvestigationsCount] = useState<number>(0);

    const user = useSelector<StoreStateType, User>(state => state.user.data);
    const isLoggedIn = useSelector<StoreStateType, boolean>(state => state.user.isLoggedIn);
    const isCurrentlyLoadingInvestigation = useSelector<StoreStateType, boolean>(state => state.investigation.isCurrentlyLoading);
    const isLoading = useSelector<StoreStateType, boolean>(state => state.isLoading);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const axiosInterceptorId = useSelector<StoreStateType, number>(state => state.investigation.axiosInterceptorId);
    const isInInvestigations = useSelector<StoreStateType, boolean>(state => state.isInInvestigation);

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

    const fetchAllInvestigationStatuses = () => {
        const investigationStatusesLogger = logger.setup({
            workflow: 'GraphQL GET statuses request to the DB',
        });
        axios.get('/landingPage/investigationStatuses').
            then((result) => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    investigationStatusesLogger.info('The investigations statuses were fetched successfully', Severity.LOW);
                    const allStatuses: string[] = result.data;
                    allStatuses.unshift(ALL_STATUSES_FILTER_OPTIONS);
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
        setIsLoading(isCurrentlyLoadingInvestigation);
    }, [isCurrentlyLoadingInvestigation])

    useEffect(() => {
        fetchAllInvestigationStatuses();
        fetchAllDesksByCountyId();
        startWaiting();
        windowTabsBroadcatChannel.current.onmessage = (broadcastEvent: MessageEvent) =>
            setIsInInvestigation(broadcastEvent.data.isInInvestigation);
    }, [])

    const moveToTheInvestigationForm = async (epidemiologyNumberVal: number) => {
        const investigationClickLogger = logger.setup({
            workflow: 'Investigation click',
            investigation: epidemiologyNumberVal
        });
        setLastOpenedEpidemiologyNum(epidemiologyNumberVal);
        investigationClickLogger.info(`Entered investigation: ${epidemiologyNumberVal}`, Severity.LOW);
        setIsInInvestigation(true);
        setIsCurrentlyLoading(true);
        await persistor.flush();
        window.open(investigationURL);
        timeout(15000).then(() => {
            store.getState().investigation.isCurrentlyLoading && setIsCurrentlyLoading(false);
        });
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
                                const subStatus = investigation.investigationSubStatusByInvestigationSubStatus ?
                                    investigation.investigationSubStatusByInvestigationSubStatus.displayName :
                                    '';
                                return createRowData(
                                    investigation.epidemiologyNumber,
                                    investigation.coronaTestDate,
                                    investigation.isComplex,
                                    investigation.priority,
                                    investigation.investigationStatusByInvestigationStatus.displayName,
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
                                    groupReason
                                )
                            });
                        setRows(investigationRows);
                        investigationRows
                            .filter((row) => row.groupId !== null || !investigationColor.current.has(row.groupId))
                            .forEach((row) => {
                                const colorIndex = getRandomIndex(0, groupedInvestigationsColors.length - 1);
                                coloredGroupedRows.current.push(colorIndex);
                                investigationColor.current.set(row.groupId, groupedInvestigationsColors[colorIndex]);
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
        let nextFilterRules = { ...filterRules };
        if (Object.values(filterBy)[0] !== null) {
            nextFilterRules = {
                ...nextFilterRules,
                ...filterBy
            }
        } else {
            delete nextFilterRules[Object.keys(filterBy)[0]];
        }
        setFilterRules(nextFilterRules);
    }

    useEffect(() => {
        setCurrentPage(defaultPage);
    }, [filterRules, orderBy]);

    useEffect(() => {
        if (isLoggedIn) {
            fetchTableData();
        }
    }, [isLoggedIn, isInInvestigations, currentPage]);

    const onInvestigationRowClick = (investigationRow: { [T in keyof IndexedInvestigationData]: any }) => {
        const investigationClickLogger = logger.setup({
            workflow: 'Investigation click',
            investigation: investigationRow.epidemiologyNumber,
            user: user.id
        });

        axios.interceptors.request.use(
            (config) => {
                config.headers.EpidemiologyNumber = investigationRow.epidemiologyNumber;
                setIsLoading(true);
                activateIsLoading(config);
                return config;
            },
            (error) => Promise.reject(error)
        );
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
        if (investigationRow.investigationStatus === InvestigationMainStatus.NEW && shouldUpdateInvestigationStatus(investigationRow.investigatorId)) {
            investigationClickLogger.info('the user clicked a new investigation', Severity.LOW);
            axios.post('/investigationInfo/updateInvestigationStartTime', {
                epidemiologyNumber: investigationRow.epidemiologyNumber
            })
                .then(async () => {
                    investigationClickLogger.info('updated investigation start time now sending request to update status', Severity.LOW);
                    try {
                        await axios.post('/investigationInfo/updateInvestigationStatus', {
                            investigationMainStatus: InvestigationMainStatus.IN_PROCESS,
                            investigationSubStatus: null,
                            epidemiologyNumber: investigationRow.epidemiologyNumber
                        });
                        setInvestigationStatus({
                            mainStatus: InvestigationMainStatus.IN_PROCESS,
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
                mainStatus: investigationRow.investigationStatus,
                subStatus: investigationRow.investigationSubStatus,
                statusReason: investigationRow.statusReason
            });
            moveToTheInvestigationForm(investigationRow.epidemiologyNumber);
        }
    }

    const convertToIndexedRow = (row: InvestigationTableRow): IndexedInvestigationData => {
        return {
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
            [TableHeadersNames.groupId]: row.groupId,
            [TableHeadersNames.canFetchGroup]: row.canFetchGroup,
            [TableHeadersNames.groupReason]: row.groupReason,
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

    const onInvestigatorChange = (indexedRow: IndexedInvestigation, newSelectedInvestigator: any, currentSelectedInvestigator: string) => {
        const changeInvestigatorLogger = logger.setup({
            workflow: 'Change Investigation Investigator',
            user: user.id,
            investigation: epidemiologyNumber
        });

        if (selectedInvestigator && newSelectedInvestigator.value !== '')
            changeInvestigatorLogger.info(`the admin approved the investigator switch in investigation ${indexedRow.epidemiologyNumber}`, Severity.LOW);
        alertWarning(`<p> האם אתה בטוח שאתה רוצה להחליף את החוקר <b>${currentSelectedInvestigator}</b> בחוקר <b>${newSelectedInvestigator.value.userName}</b>?</p>`, {
            showCancelButton: true,
            cancelButtonText: 'לא',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('/users/changeInvestigator', {
                    epidemiologyNumbers: [indexedRow.epidemiologyNumber],
                    user: newSelectedInvestigator.id
                }
                ).then(() => timeout(1900).then(() => {
                    changeInvestigatorLogger.info('the investigator have been switched successfully', Severity.LOW);
                    setSelectedRow(UNDEFINED_ROW)
                    setRows(rows.map((investigation: InvestigationTableRow) => (
                        investigation.epidemiologyNumber === indexedRow.epidemiologyNumber ?
                            {
                                ...investigation,
                                investigator: {
                                    id: newSelectedInvestigator.id,
                                    userName: newSelectedInvestigator.value.userName
                                }
                            }
                            : investigation
                    )))
                    setUnassignedInvestigationsCount(unassignedInvestigationsCount - 1);
                })).catch((error) => {
                    changeInvestigatorLogger.error('couldnt change investigator due to ' + error, Severity.LOW);
                    alertError(UPDATE_ERROR_TITLE);
                })
            } else if (result.isDismissed) {
                changeInvestigatorLogger.info('the admin denied the investigator from being switched', Severity.LOW);
                setSelectedRow(UNDEFINED_ROW);
            }
        })
    }

    const onCountyChange = (indexedRow: IndexedInvestigation, newSelectedCounty: any) => {
        const changeCountyLogger = logger.setup({
            workflow: 'Change Investigation County',
            user: user.id,
            investigation: epidemiologyNumber
        });

        if (selectedInvestigator && newSelectedCounty.value !== '')
            changeCountyLogger.info(`the admin has been offered to switch the investigation ${indexedRow.epidemiologyNumber} county from ${indexedRow.county} to ${JSON.stringify(newSelectedCounty.value)}`, Severity.LOW);
        alertWarning(`<p>האם אתה בטוח שאתה רוצה להחליף את נפה <b>${indexedRow.county}</b> בנפה <b>${newSelectedCounty.value.displayName}</b>?</p>`, {
            showCancelButton: true,
            cancelButtonText: 'לא',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('/users/changeCounty', {
                    epidemiologyNumber: indexedRow.epidemiologyNumber,
                    updatedCounty: newSelectedCounty.id,
                }).then(() => timeout(1900).then(() => {
                    changeCountyLogger.info('changed the county successfully', Severity.LOW);
                    setSelectedRow(UNDEFINED_ROW);
                    setRows(rows.filter((row: InvestigationTableRow) => row.epidemiologyNumber !== indexedRow.epidemiologyNumber));
                }))
                    .catch((error) => {
                        changeCountyLogger.error(`couldnt change the county due to ${error}`, Severity.LOW);
                        alertError(UPDATE_ERROR_TITLE);
                    })
            } else if (result.isDismissed) {
                setSelectedRow(UNDEFINED_ROW);
            }
        })
    }

    const onDeskChange = (indexedRow: IndexedInvestigation, newSelectedDesk: any) => {
        const switchDeskTitle = `<p>האם אתה בטוח שאתה רוצה להחליף את דסק <b>${indexedRow.investigationDesk}</b> בדסק <b>${newSelectedDesk.deskName}</b>?</p>`;
        const enterDeskTitle = `<p>האם אתה בטוח שאתה רוצה לבחור את דסק <b>${newSelectedDesk.deskName}</b>?</p>`;

        const changeDeskLogger = logger.setup({
            workflow: 'Change Investigation Desk',
            user: user.id,
            investigation: epidemiologyNumber
        });

        if (selectedInvestigator && newSelectedDesk.deskName !== '' && newSelectedDesk.deskName !== indexedRow.investigationDesk) {
            changeDeskLogger.info(`the admin has been offered to switch the investigation ${indexedRow.epidemiologyNumber} desk from ${indexedRow.investigationDesk} to ${JSON.stringify(newSelectedDesk.deskName)}`, Severity.LOW);
            alertWarning(indexedRow.investigationDesk ? switchDeskTitle : enterDeskTitle, {
                showCancelButton: true,
                cancelButtonText: 'לא',
                cancelButtonColor: theme.palette.error.main,
                confirmButtonColor: theme.palette.primary.main,
                confirmButtonText: 'כן, המשך',
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.post('/landingPage/changeDesk', {
                        epidemiologyNumbers: [indexedRow.epidemiologyNumber],
                        updatedDesk: newSelectedDesk.id,
                    }).then(() => timeout(1900).then(() => {
                        changeDeskLogger.info('changed the desk successfully', Severity.LOW);
                        setRows(rows.map((investigation: InvestigationTableRow) => (
                            investigation.epidemiologyNumber === indexedRow.epidemiologyNumber ?
                                {
                                    ...investigation,
                                    investigationDesk: newSelectedDesk.deskName
                                }
                                : investigation
                        )));
                        setSelectedRow(UNDEFINED_ROW);
                    }))
                        .catch((error) => {
                            changeDeskLogger.error(`couldnt chang the desk due to ${error}`, Severity.HIGH);
                            alertError(UPDATE_ERROR_TITLE);
                        })
                } else if (result.isDismissed) {
                    setSelectedRow(UNDEFINED_ROW);
                }
            })
        }
    }

    const getRandomIndex = (min: number, max: number) => {
        let randomIndex = Math.floor(Math.random() * (max - min + 1) + min);
        while (
            coloredGroupedRows.current.includes(randomIndex) &&
            coloredGroupedRows.current.length < max
        ) {
            if (randomIndex < max) {
                randomIndex++;
            } else {
                randomIndex = 0;
            }
        }
        return randomIndex;
    }

    const getTableCellStyles = (rowIndex: number, cellKey: string) => {
        let classNames = [];

        classNames.push(classes.font);
        classNames.push(classes.tableCell);
        if (cellKey === TableHeadersNames.investigatorName) {
            classNames.push(classes.columnBorder);
        } else if (cellKey === TableHeadersNames.priority) {
            classNames.push(classes.priorityTableCell);
        } else if (cellKey === TableHeadersNames.multipleCheck) {
            classNames.push(classes.groupedInvestigation);
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
    }

    const fetchInvestigationsByGroupId = async (groupId: string) => {
        const investigationsByGroupIdLogger = logger.setup({
            workflow: 'get investigations by group id',
            user: user.id,
            investigation: epidemiologyNumber
        });
        investigationsByGroupIdLogger.info('send get investigations by group id request', Severity.LOW);
        if (!allGroupedInvestigations.get(groupId)) {
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
                                        const groupReason =  user ? investigation.investigationGroupReasonByGroupId.reason : ''
                                        const subStatus = investigation.investigationSubStatusByInvestigationSubStatus ?
                                            investigation.investigationSubStatusByInvestigationSubStatus.displayName :
                                            '';
                                        return createRowData(
                                            investigation.epidemiologyNumber,
                                            investigation.coronaTestDate,
                                            investigation.isComplex,
                                            investigation.priority,
                                            investigation.investigationStatusByInvestigationStatus.displayName,
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
                                            groupReason
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
    }

    return {
        tableRows: rows,
        setTableRows: setRows,
        onInvestigationRowClick,
        convertToIndexedRow,
        onInvestigatorChange,
        getTableCellStyles,
        sortInvestigationTable,
        getUserMapKeyByValue,
        getCountyMapKeyByValue,
        onCountyChange,
        onCancel,
        onOk,
        snackbarOpen,
        moveToTheInvestigationForm,
        onDeskChange,
        totalCount,
        handleFilterChange,
        unassignedInvestigationsCount,
        fetchInvestigationsByGroupId
    };
};

export default useInvestigationTable;

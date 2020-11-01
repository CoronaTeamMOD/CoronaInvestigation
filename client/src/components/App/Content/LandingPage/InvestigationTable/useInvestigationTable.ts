import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import User from 'models/User';
import Desk from 'models/Desk';
import theme from 'styles/theme';
import County from 'models/County';
import logger from 'logger/logger';
import { store } from 'redux/store';
import userType from 'models/enums/UserType';
import Investigator from 'models/Investigator';
import { timeout } from 'Utils/Timeout/Timeout';
import { Service, Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import axios, { activateIsLoading } from 'Utils/axios';
import { defaultEpidemiologyNumber } from 'Utils/consts';
import usePageRefresh from 'Utils/vendor/usePageRefresh';
import { initialUserState } from 'redux/User/userReducer';
import InvestigationTableRow from 'models/InvestigationTableRow';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import InvestigationMainStatus from 'models/enums/InvestigationMainStatus';
import { setInvestigationStatus } from 'redux/Investigation/investigationActionCreators';
import { setLastOpenedEpidemiologyNum } from 'redux/Investigation/investigationActionCreators';
import { setIsInInvestigation } from 'redux/IsInInvestigations/isInInvestigationActionCreators';
import { setAxiosInterceptorId, setIsCurrentlyLoading } from 'redux/Investigation/investigationActionCreators';

import useStyle from './InvestigationTableStyles';
import { defaultOrderBy } from './InvestigationTable';
import { TableHeadersNames, IndexedInvestigation } from './InvestigationTablesHeaders';
import { useInvestigationTableOutcome, useInvestigationTableParameters } from './InvestigationTableInterfaces';

const investigationURL = '/investigation';

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
): InvestigationTableRow => ({
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
    comment
});

const TABLE_REFRESH_INTERVAL = 30;
export const UNDEFINED_ROW = -1;
const FETCH_ERROR_TITLE = 'אופס... לא הצלחנו לשלוף';
const UPDATE_ERROR_TITLE = 'לא הצלחנו לעדכן את המשתמש';
const OPEN_INVESTIGATION_ERROR_TITLE = 'לא הצלחנו לפתוח את החקירה';
export const ALL_STATUSES_FILTER_OPTIONS = 'הכל';
export const ALL_DESKS_FILTER_OPTIONS = 'כל הדסקים';

const useInvestigationTable = (parameters: useInvestigationTableParameters): useInvestigationTableOutcome => {
    const classes = useStyle();

    const { selectedInvestigator, setSelectedRow, setAllCounties, setAllUsersOfCurrCounty,
        setAllStatuses, setAllDesks } = parameters;

    const [rows, setRows] = useState<InvestigationTableRow[]>([]);
    const [isDefaultOrder, setIsDefaultOrder] = useState<boolean>(true);
    const [orderBy, setOrderBy] = useState<string>(defaultOrderBy);

    const user = useSelector<StoreStateType, User>(state => state.user);
    const isCurrentlyLoadingInvestigation = useSelector<StoreStateType, boolean>(state => state.investigation.isCurrentlyLoading);
    const isLoading = useSelector<StoreStateType, boolean>(state => state.isLoading);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const axiosInterceptorId = useSelector<StoreStateType, number>(state => state.investigation.axiosInterceptorId);
    const isInInvestigations = useSelector<StoreStateType, boolean>(state => state.isInInvestigation);

    const fireSwalError = (errorTitle: string) => {
        Swal.fire({
            title: errorTitle,
            icon: 'error',
            customClass: {
                title: classes.errorAlertTitle
            }
        });
    };

    const fetchAllDesks = () => {
        axios.get('/desks').
        then((result) => {
            if (result?.data && result.headers['content-type'].includes('application/json')) {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Getting Desks',
                    step: 'The desks were fetched successfully'
                });
                const alDesks : string[] = result.data.map((desk: Desk) => desk.name);
                alDesks.unshift(ALL_DESKS_FILTER_OPTIONS);
                setAllDesks(alDesks);
            } else {
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Getting Desks',
                    step: 'Got 200 status code but results structure isnt as expected'
                });
            }
        })
        .catch((err) => {
            fireSwalError('לא הצלחנו לשלוף את כל הדסקים האפשריים לסינון');
            logger.error({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Getting Desks',
                step: err
            });
        })
    }

    const fetchAllInvestigationStatuses = () => {
        axios.get('/landingPage/investigationStatuses').
        then((result) => {
            if (result?.data && result.headers['content-type'].includes('application/json')) {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'GraphQL GET statuses request to the DB',
                    step: 'The investigations statuses were fetched successfully'
                });
                const allStatuses : string[] = result.data;
                allStatuses.unshift(ALL_STATUSES_FILTER_OPTIONS);
                setAllStatuses(allStatuses);
            } else {
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'GraphQL GET statuses request to the DB',
                    step: 'Got 200 status code but results structure isnt as expected'
                });
            }
        })
        .catch((err) => {
            fireSwalError('לא הצלחנו לשלוף את כל הסטטוסים האפשריים לסינון');
            logger.error({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'GraphQL GET statuses request to the DB',
                step: err
            });
        })
    }

    useEffect(() => {
        setIsLoading(isCurrentlyLoadingInvestigation);
    }, [isCurrentlyLoadingInvestigation])

    useEffect(() => {
        fetchAllInvestigationStatuses();
        fetchAllDesks();

        startWaiting();
    }, [])

    const moveToTheInvestigationForm = (epidemiologyNumberVal: number) => {
        setLastOpenedEpidemiologyNum(epidemiologyNumberVal);
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Investigation click',
            step: `Entered investigation: ${epidemiologyNumberVal}`,
            investigation: epidemiologyNumberVal
        })
        setIsInInvestigation(true);
        console.log(epidemiologyNumberVal, defaultEpidemiologyNumber, epidemiologyNumberVal !== defaultEpidemiologyNumber)
        epidemiologyNumberVal !== defaultEpidemiologyNumber && window.open(investigationURL);
        setIsCurrentlyLoading(true);
        timeout(15000).then(() => {
            store.getState().investigation.isCurrentlyLoading && setIsCurrentlyLoading(false);
        });
    }


    const getInvestigationsAxiosRequest = (orderBy: string): any => {
        if (user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Getting Investigations',
                step: 'user is admin so landingPage/groupInvestigations route is chosen',
                user: user.id
            });
            return axios.get('landingPage/groupInvestigations/' + orderBy)
        }
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Getting Investigations',
            step: 'user isnt admin so landingPage/investigations route is chosen',
            user: user.id
        });
        return axios.get('/landingPage/investigations/' + orderBy);
    }

    const sortUsersByAvailability = (fisrtUser: User, secondUser: User) =>
        fisrtUser.newInvestigationsCount - secondUser.newInvestigationsCount || 
            fisrtUser.activeInvestigationsCount - secondUser.activeInvestigationsCount

    const fetchAllCountyUsers = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Getting group users',
            step: `requesting the server the connected admin's group users`,
            user: user.id
        })
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
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'GraphQL request to the DB',
                        step: 'fetched all the users successfully'
                    });
                    setAllUsersOfCurrCounty(countyUsers);
                } else {
                    logger.warn({
                        service: Service.CLIENT,
                        severity: Severity.MEDIUM,
                        workflow: 'Getting group users',
                        step: 'the connected admin doesnt have group users',
                        user: user.id
                    });
                }
            }).catch(err => {
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'GraphQL request to the DB',
                    step: err
                });
                fireSwalError(FETCH_ERROR_TITLE);
            });
    }

    const fetchAllCounties = () => {
        axios.get('/counties').then((result: any) => {
            const allCounties: Map<number, County> = new Map();
            result && result.data && result.data.forEach((county: any) => {
                allCounties.set(county.id, {
                    id: county.id,
                    displayName: `${county.district} - ${county.displayName}`
                })
            });
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'GraphQL request to the DB',
                step: 'fetched all the counties successfully'
            });
            setAllCounties(allCounties);
        }).catch(err => {
            logger.error({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'GraphQL request to the DB',
                step: err
            });
            fireSwalError(FETCH_ERROR_TITLE);
        });
    }

    const getFormattedDate = (date: string) => {
        return format(new Date(date), 'dd/MM')
    };

    const fetchTableData = () => {
        setIsLoading(true);
        if (user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) {
            fetchAllCountyUsers();
            fetchAllCounties();
        }
        if (user.userName !== initialUserState.userName) {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Getting Investigations',
                step: `launching the selected request to the DB ordering by ${orderBy}`,
                user: user.id
            });
            getInvestigationsAxiosRequest(orderBy)
                .then((response: any) => {
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Getting Investigations',
                        step: 'got respond from the server',
                        user: user.id
                    });

                    const { data } = response;
                    let allInvestigationsRawData: any = [];

                    if (user.investigationGroup !== -1) {
                        logger.info({
                            service: Service.CLIENT,
                            severity: Severity.LOW,
                            workflow: 'Getting Investigations',
                            step: 'user investigation group is valid',
                            user: user.id
                        });
                        if (data && data.allInvestigations) {
                            logger.info({
                                service: Service.CLIENT,
                                severity: Severity.LOW,
                                workflow: 'Getting Investigations',
                                step: 'got investigations from the DB',
                                user: user.id
                            });
                            allInvestigationsRawData = data.allInvestigations
                        } else {
                            logger.warn({
                                service: Service.CLIENT,
                                severity: Severity.MEDIUM,
                                workflow: 'Getting Investigations',
                                step: 'didnt get investigations from the DB',
                                user: user.id
                            });
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
                                investigation.comment
                            )
                        });
                        setRows(investigationRows);
                        setIsLoading(false);
                    } else {
                        logger.warn({
                            service: Service.CLIENT,
                            severity: Severity.LOW,
                            workflow: 'Getting Investigations',
                            step: 'user investigation group is invalid',
                            user: user.id
                        });
                    }
                })
                .catch((err: any) => {
                    Swal.fire({
                        title: 'אופס... לא הצלחנו לשלוף',
                        icon: 'error',
                        customClass: {
                            title: classes.errorAlertTitle
                        }
                    })
                    logger.error({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'GraphQL GET users request to the DB',
                        step: err
                    });
                });
        }
    };

    const {startWaiting,onCancel, onOk, snackbarOpen} = usePageRefresh(fetchTableData, TABLE_REFRESH_INTERVAL);

    useEffect(() => {
        fetchTableData()
    }, [user.id, classes.errorAlertTitle, user, orderBy, isInInvestigations]);

    const onInvestigationRowClick = (investigationRow: { [T in keyof typeof TableHeadersNames]: any }) => {
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
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Investigation click',
                step: 'the clicked investigation is not the first one',
                investigation: investigationRow.epidemiologyNumber,
                user: user.id
            })
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
        setInvestigationStatus({
            mainStatus: investigationRow.investigationStatus === InvestigationMainStatus.NEW ?
                InvestigationMainStatus.IN_PROCESS :
                investigationRow.investigationStatus,
            subStatus: investigationRow.investigationSubStatus
        })
        if (investigationRow.investigationStatus === InvestigationMainStatus.NEW) {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Investigation click',
                step: 'the user clicked a new investigation, updating status in the DB',
                investigation: investigationRow.epidemiologyNumber,
                user: user.id
            })
            axios.post('/investigationInfo/updateInvestigationStartTime', {
                investigationStartTime: new Date(),
                epidemiologyNumber: investigationRow.epidemiologyNumber
            }).then(() => {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Investigation click',
                    step: 'updated investigation start time now sending request to update status',
                    investigation: investigationRow.epidemiologyNumber,
                    user: user.id
                });
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Investigation click',
                    step: `the investigator got into the investigation, investigated person: ${investigationRow.fullName}, investigator name: ${user.userName}, investigator phone number: ${user.phoneNumber}`,
                    investigation: investigationRow.epidemiologyNumber,
                    user: user.id
                });
                moveToTheInvestigationForm(investigationRow.epidemiologyNumber);
            }).catch((error) => {
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'GraphQL POST request to the DB',
                    step: error
                });
                fireSwalError(OPEN_INVESTIGATION_ERROR_TITLE)
            })
        } else {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Investigation click',
                step: `the investigator got into the investigation, investigated person: ${investigationRow.fullName}, investigator name: ${user.userName}, investigator phone number: ${user.phoneNumber}`,
                investigation: investigationRow.epidemiologyNumber,
                user: user.id
            })
            moveToTheInvestigationForm(investigationRow.epidemiologyNumber);
        }
    }

    const convertToIndexedRow = (row: InvestigationTableRow): IndexedInvestigation => {
        return {
            [TableHeadersNames.epidemiologyNumber]: row.epidemiologyNumber,
            [TableHeadersNames.coronaTestDate]: getFormattedDate(row.coronaTestDate),
            [TableHeadersNames.isComplex]: row.isComplex,
            [TableHeadersNames.priority]: row.priority,
            [TableHeadersNames.fullName]: row.fullName,
            [TableHeadersNames.phoneNumber]: row.phoneNumber,
            [TableHeadersNames.age]: row.age,
            [TableHeadersNames.city]: row.city,
            [TableHeadersNames.investigatorName]: row.investigator.userName,
            [TableHeadersNames.investigationStatus]: row.mainStatus,
            [TableHeadersNames.investigationSubStatus]: row.subStatus,
            [TableHeadersNames.county]: row.county ? row.county.displayName : '',
            [TableHeadersNames.investigationDesk]: row.investigationDesk,
            [TableHeadersNames.comment]: row.comment
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
        if (selectedInvestigator && newSelectedInvestigator.value !== '')
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Switch investigator',
                step: `the admin approved the investigator switch in investigation ${indexedRow.epidemiologyNumber}`,
                user: user.id
            })
        Swal.fire({
            icon: 'warning',
            title: `<p> האם אתה בטוח שאתה רוצה להחליף את החוקר <b>${currentSelectedInvestigator}</b> בחוקר <b>${newSelectedInvestigator.value.userName}</b>?</p>`,
            showCancelButton: true,
            cancelButtonText: 'לא',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך',
            customClass: {
                title: classes.swalTitle,
            }
        }).then((result) => {
            if (result.isConfirmed) {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Switch investigator',
                    step: 'the investigator have been switched successfully',
                    investigation: indexedRow.epidemiologyNumber as number,
                    user: user.id
                })
                axios.post('/users/changeInvestigator', {
                    epidemiologyNumber: indexedRow.epidemiologyNumber,
                    user: newSelectedInvestigator.id
                }
                ).then(() => timeout(1900).then(() => {
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
                })).catch((error) => {
                    logger.error({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Switch investigator',
                        step: `the investigator swap failed due to: ${error}`,
                        investigation: indexedRow.epidemiologyNumber as number,
                        user: user.id
                    })
                    fireSwalError(UPDATE_ERROR_TITLE)
                })
            } else if (result.isDismissed) {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Switch investigator',
                    step: 'the admin denied the investigator from being switched',
                    investigation: indexedRow.epidemiologyNumber as number,
                    user: user.id
                })
                setSelectedRow(UNDEFINED_ROW);
            }
        })
    }

    const onCountyChange = (indexedRow: IndexedInvestigation, newSelectedCounty: any) => {
        if (selectedInvestigator && newSelectedCounty.value !== '')
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Switch County',
                step: `the admin has been offered to switch the investigation ${indexedRow.epidemiologyNumber} county from ${indexedRow.county} to ${JSON.stringify(newSelectedCounty.value)}`,
                user: user.id
            })
        Swal.fire({
            icon: 'warning',
            title: `<p>האם אתה בטוח שאתה רוצה להחליף את נפה <b>${indexedRow.county}</b> בנפה <b>${newSelectedCounty.value.displayName}</b>?</p>`,
            showCancelButton: true,
            cancelButtonText: 'לא',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך',
            customClass: {
                title: classes.swalTitle,
            }
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('/users/changeCounty', {
                    epidemiologyNumber: indexedRow.epidemiologyNumber,
                    updatedCounty: newSelectedCounty.id,
                }).then(() => timeout(1900).then(() => {
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'GraphQL POST request to the DB',
                        step: 'changed the county successfully'
                    });
                    setSelectedRow(UNDEFINED_ROW);
                    setRows(rows.filter((row: InvestigationTableRow) => row.epidemiologyNumber !== indexedRow.epidemiologyNumber));
                })).catch((error) => {
                    logger.error({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'GraphQL POST request to the DB',
                        step: error
                    });
                    fireSwalError(UPDATE_ERROR_TITLE);
                })
            } else if (result.isDismissed) {

                setSelectedRow(UNDEFINED_ROW);
            }
        })
    }

    const getTableCellStyles = (rowIndex: number, cellKey: string) => {
        let classNames = [];

        classNames.push(classes.font);
        if (cellKey === TableHeadersNames.investigatorName) {
            classNames.push(classes.columnBorder);
        } else if (cellKey === TableHeadersNames.priority) {
            classNames.push(classes.priorityTableCell);
        } else if (cellKey === TableHeadersNames.coronaTestDate) {
            classNames.push(classes.testDateCell);
        } else if (cellKey === TableHeadersNames.epidemiologyNumber) {
            classNames.push(classes.epiNumberCell);
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

    return {
        tableRows: rows,
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
        moveToTheInvestigationForm
    };
};

export default useInvestigationTable;

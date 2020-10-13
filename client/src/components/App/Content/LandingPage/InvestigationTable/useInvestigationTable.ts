import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

import User from 'models/User';
import theme from 'styles/theme';
import County from 'models/County';
import logger from 'logger/logger';
import Investigator from 'models/Investigator';
import {Service, Severity} from 'models/Logger';
import { timeout } from 'Utils/Timeout/Timeout';
import StoreStateType from 'redux/storeStateType';
import axios, { activateIsLoading } from 'Utils/axios';
import { initialUserState } from 'redux/User/userReducer';
import InvestigationTableRow from 'models/InvestigationTableRow';
import InvestigationStatus from 'models/enums/InvestigationStatus';
import { setEpidemiologyNum, setCantReachInvestigated, setAxiosInterceptorId } from 'redux/Investigation/investigationActionCreators';

import useStyle from './InvestigationTableStyles';
import { defaultOrderBy } from './InvestigationTable';
import { TableHeadersNames, IndexedInvestigation } from './InvestigationTablesHeaders';
import { useInvestigationTableOutcome, useInvestigationTableParameters } from './InvestigationTableInterfaces';

export const createRowData = (
    epidemiologyNumber: number,
    coronaTestDate: string,
    priority: number,
    status: string,
    fullName: string,
    phoneNumber: string,
    age: number,
    city: string,
    county: County,
    investigator: Investigator
): InvestigationTableRow => ({
    epidemiologyNumber,
    coronaTestDate,
    priority,
    status,
    fullName,
    phoneNumber,
    age,
    city,
    county,
    investigator
});

export const UNDEFINED_ROW = -1;
const FETCH_ERROR_TITLE = 'אופס... לא הצלחנו לשלוף';
const UPDATE_ERROR_TITLE = 'לא הצלחנו לעדכן את המשתמש';
const OPEN_INVESTIGATION_ERROR_TITLE = 'לא הצלחנו לפתוח את החקירה';

const useInvestigationTable = (parameters: useInvestigationTableParameters): useInvestigationTableOutcome => {
    const history = useHistory();
    const classes = useStyle();

    const {selectedInvestigator, setSelectedRow, setAllCounties, setAllUsersOfCurrCounty} = parameters;

    const [rows, setRows] = useState<InvestigationTableRow[]>([]);
    const [isDefaultOrder, setIsDefaultOrder] = useState<boolean>(true);
    const [orderBy, setOrderBy] = useState<string>(defaultOrderBy);

    const user = useSelector<StoreStateType, User>(state => state.user);
    const isLoading = useSelector<StoreStateType, boolean>(state => state.isLoading);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const axiosInterceptorId = useSelector<StoreStateType, number>(state => state.investigation.axiosInterceptorId);

    const fireSwalError = (errorTitle: string) => {
        Swal.fire({
            title: errorTitle,
            icon: 'error',
            customClass: {
                title: classes.errorAlertTitle
            }
        });
    }

    const getInvestigationsAxiosRequest = (orderBy: string): any => {
        if (user.isAdmin)
            return axios.get(`landingPage/groupInvestigations?orderBy=${orderBy}`)
        return axios.get(`/landingPage/investigations?orderBy=${orderBy}`);
    }

    const fetchAllCountyUsers = () => {
        axios.get(`/users/group`)
            .then((result: any) => {
                const countyUsers: Map<string, User> = new Map();
                result && result.data && result.data.forEach((user: User) => {
                    countyUsers.set(user.id, user)
                });
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'GraphQL request to the DB',
                    step: 'fetched all the users successfully'
                });
                setAllUsersOfCurrCounty(countyUsers);
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
        axios.get('/counties/allCounties').then((result: any) => {
            const allCounties: Map<number, County> = new Map();
            result && result.data && result.data.data.allCounties.nodes.forEach((county: any) => {
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
    }

    useEffect(() => {
        setIsLoading(true);
        if (user.isAdmin) {
            fetchAllCountyUsers();
            fetchAllCounties();
        }
        user.userName !== initialUserState.userName && getInvestigationsAxiosRequest(orderBy)
            .then((response: any) => {

                const {data} = response;
                let allInvestigationsRawData: any = [];

                if (user.investigationGroup !== -1) {

                    if (data && data.allInvestigations) {
                        allInvestigationsRawData = data.allInvestigations
                    }

                    const investigationRows: InvestigationTableRow[] = allInvestigationsRawData.map((investigation: any) => {
                        const patient = investigation.investigatedPatientByInvestigatedPatientId;
                        const covidPatient = patient.covidPatientByCovidPatient;
                        const patientCity = (covidPatient && covidPatient.addressByAddress) ? covidPatient.addressByAddress.cityByCity : '';
                        const county = investigation.userByLastUpdator.countyByInvestigationGroup;
                        const user = investigation.userByLastUpdator;
                        return createRowData(
                            investigation.epidemiologyNumber,
                            investigation.coronaTestDate,
                            investigation.priority,
                            investigation.investigationStatusByInvestigationStatus.displayName,
                            covidPatient.fullName,
                            covidPatient.primaryPhone,
                            covidPatient.age,
                            patientCity ? patientCity.displayName : '',
                            county,
                            user
                        )
                    });
                    setRows(investigationRows);
                    setIsLoading(false);
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
    }, [user.id, classes.errorAlertTitle, user, orderBy]);

    const transferToInvestigationForm  = (epidemiologyNumber: number) => {
        setEpidemiologyNum(epidemiologyNumber);
        history.push('/investigation');
    }

    const handleInvestigationRowClick = (epidemiologyNumberVal: number, currentInvestigationStatus: string) => {
        axios.interceptors.request.use(
            (config) => {
                config.headers.Authorization = user.token;
                config.headers.EpidemiologyNumber = epidemiologyNumberVal;
                setIsLoading(true);
                activateIsLoading(config);
                return config;
            },
            (error) => Promise.reject(error)
        );
        if (currentInvestigationStatus === InvestigationStatus.NEW) {
            if (epidemiologyNumber !== epidemiologyNumberVal) {
                const newInterceptor = axios.interceptors.request.use(
                    (config) => {
                        config.headers.Authorization = user.token;
                        config.headers.EpidemiologyNumber = epidemiologyNumberVal;
                        activateIsLoading(config);
                        return config;
                    },
                    (error) => Promise.reject(error)
                );
                setAxiosInterceptorId(newInterceptor);
                axiosInterceptorId !== -1 && axios.interceptors.request.eject(axiosInterceptorId);
            }
            if (currentInvestigationStatus === InvestigationStatus.NEW) {
                axios.post('/investigationInfo/updateInvestigationStartTime', {
                    investigationStartTime: new Date(),
                    epidemiologyNumber: epidemiologyNumberVal
                }).then(() => {
                    axios.post('/investigationInfo/updateInvestigationStatus', {
                        investigationStatus: InvestigationStatus.IN_PROCESS,
                        epidemiologyNumber: epidemiologyNumberVal
                    }).then(() => {
                        transferToInvestigationForm(epidemiologyNumberVal);
                    }).catch((error) => {
                        logger.error({
                            service: Service.CLIENT,
                            severity: Severity.LOW,
                            workflow: 'GraphQL POST request to the DB',
                            step: error
                        });
                        fireSwalError(OPEN_INVESTIGATION_ERROR_TITLE)
                    });
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
                setCantReachInvestigated(currentInvestigationStatus === InvestigationStatus.CANT_REACH);
                transferToInvestigationForm(epidemiologyNumberVal);
            }
        }
    }

    const convertToIndexedRow = (row: InvestigationTableRow): IndexedInvestigation => {
        return {
            [TableHeadersNames.epidemiologyNumber]: row.epidemiologyNumber,
            [TableHeadersNames.coronaTestDate]: getFormattedDate(row.coronaTestDate),
            [TableHeadersNames.priority]: row.priority,
            [TableHeadersNames.fullName]: row.fullName,
            [TableHeadersNames.phoneNumber]: row.phoneNumber,
            [TableHeadersNames.age]: row.age,
            [TableHeadersNames.city]: row.city,
            [TableHeadersNames.investigatorName]: row.investigator.userName,
            [TableHeadersNames.investigationStatus]: row.status,
            [TableHeadersNames.county]: row.county ? row.county.displayName : '',
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
                            workflow: 'GraphQL POST request to the DB',
                            step: error
                        });
                        fireSwalError(UPDATE_ERROR_TITLE)
                    })
                } else if (result.isDismissed) {
                    setSelectedRow(UNDEFINED_ROW);
                }
            })
    }

    const onCountyChange = (indexedRow: IndexedInvestigation, newSelectedCounty: any) => {
        if (selectedInvestigator && newSelectedCounty.value !== '')
            Swal.fire({
                icon: 'warning',
                title: `<p>האם אתה בטוח שאתה רוצה להחליף את דסק <b>${indexedRow.county}</b> בדסק <b>${newSelectedCounty.value.displayName}</b>?</p>`,
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

        if (cellKey === TableHeadersNames.investigatorName) {
            classNames.push(classes.columnBorder);
        }

        if ((isDefaultOrder && !isLoading) &&
            (rows.length - 1 !== rowIndex) &&
            (getFormattedDate(rows[rowIndex].coronaTestDate) !== getFormattedDate(rows[rowIndex + 1].coronaTestDate))) {
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
        handleInvestigationRowClick,
        convertToIndexedRow,
        onInvestigatorChange,
        getTableCellStyles,
        sortInvestigationTable,
        getUserMapKeyByValue,
        getCountyMapKeyByValue,
        onCountyChange
    };
};

export default useInvestigationTable;
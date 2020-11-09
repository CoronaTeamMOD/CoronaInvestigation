import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2';

import logger from 'logger/logger'
import { Service, Severity } from 'models/Logger'
import User from 'models/User';
import SignUpUser from 'models/SignUpUser';
import SignUpFields from 'models/enums/SignUpFields';
import SortOrder from 'models/enums/SortOrder';
import County from 'models/County';
import SourceOrganization from 'models/SourceOrganization';
import UserTypeModel from 'models/UserType';
import UserTypeEnum from 'models/enums/UserType';
import Language from 'models/Language';
import StoreStateType from 'redux/storeStateType'
import axios from 'Utils/axios'
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions'

import { SortOrderTableHeadersNames } from './UsersManagementTableHeaders'

interface UserDialog {
    isOpen: boolean,
    info: SignUpUser
}
interface CellNameSort {
    name: string;
    direction: SortOrder | undefined;
}

const useUsersManagement = ({ page, rowsPerPage, cellNameSort }: useUsersManagementInCome): useUsersManagementOutCome => {
    
    const [users, setUsers] = useState<SignUpUser[]>([]);
    const [counties, setCounties] = useState<County[]>([]);
    const [sourcesOrganization, setSourcesOrganization] = useState<SourceOrganization[]>([])
    const [userTypes, setUserTypes] = useState<UserTypeModel[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [userDialog, setUserDialog] = useState<UserDialog>({ isOpen: false, info: {} });
    const [filterRules, setFitlerRules] = useState<any>({});
    const [isBadgeInVisible, setIsBadgeInVisible] = useState<boolean>(true);
    
    const user = useSelector<StoreStateType, User>(state => state.user);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const getUsersRoute = () => {
        switch (user.userType) {
            case UserTypeEnum.ADMIN: return '/users/county';
            case UserTypeEnum.SUPER_ADMIN: return '/users/district';
            default: return '';
        }
    }

    const fetchUsers = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching users',
            step: 'launching users request',
            user: user.id,
            investigation: epidemiologyNumber
        });
        const fetchUsersRoute = getUsersRoute(); 
        if (fetchUsersRoute !== '') {
            axios.post(fetchUsersRoute, {
                page: {
                    number: page,
                    size: rowsPerPage
                },
                orderBy: cellNameSort.direction !== undefined ? 
                         `${get(SortOrderTableHeadersNames, cellNameSort.name)}_${cellNameSort.direction?.toUpperCase()}` : null,
                filter: filterRules
            })
                .then(result => {
                    if (result?.data && result.headers['content-type'].includes('application/json')) {
                        setUsers(result.data?.users);
                        setTotalCount(result.data?.totalCount);
                        logger.info({
                            service: Service.CLIENT,
                            severity: Severity.LOW,
                            workflow: 'Fetching users',
                            step: 'got results back from the server',
                            user: user.id,
                            investigation: epidemiologyNumber
                        });
                    } 
                })
                .catch(err => {
                    if (err.response.status === 401) {
                        handleFailedRequest('אין לך הרשאות למידע זה');
                    }
                    else {
                        handleFailedRequest('לא ניתן היה לקבל משתמשים');
                    }
                    logger.error({
                        service: Service.CLIENT,
                        severity: Severity.HIGH,
                        workflow: 'Fetching users',
                        step: 'didnt get results back from the server',
                        user: user.id,
                        investigation: epidemiologyNumber
                    });
                });
        }
    }

    const fetchSourcesOrganization = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching sourcesOrganization',
            step: 'launching sourcesOrganization request',
            user: user.id,
            investigation: epidemiologyNumber
        })
        axios.get('/users/sourcesOrganization')
            .then(result => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    setSourcesOrganization(result.data);
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Fetching sourcesOrganization',
                        step: 'got results back from the server',
                        user: user.id,
                        investigation: epidemiologyNumber
                    });
                } 
            })
            .catch(err => {
                handleFailedRequest('לא ניתן היה לקבל מסגרות');
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching sourcesOrganization',
                    step: 'didnt get results back from the server',
                    user: user.id,
                    investigation: epidemiologyNumber
                });         
            });
    }

    const fetchCounties = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching counties',
            step: 'launching counties request',
            user: user.id,
            investigation: epidemiologyNumber
        })
        axios.get('/counties')
            .then(result => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    setCounties(result.data);
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Fetching counties',
                        step: 'got results back from the server',
                        user: user.id,
                        investigation: epidemiologyNumber
                    });
                }  
            })
            .catch(err => {
                handleFailedRequest('לא ניתן היה לקבל נפות');
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching counties',
                    step: 'didnt get results back from the server',
                    user: user.id,
                    investigation: epidemiologyNumber
                });         
            });
    };

    const fetchUserTypes = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching userTypes',
            step: 'launching userTypes request',
            user: user.id,
            investigation: epidemiologyNumber
        })
        axios.get('/users/userTypes')
            .then(result => {
                if (result?.data && result.headers['content-type'].includes('application/json'))
                {
                    setUserTypes(result.data);
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Fetching userTypes',
                        step: 'got results back from the server',
                        user: user.id,
                        investigation: epidemiologyNumber
                    });
                } 
            })
            .catch(err => {
                handleFailedRequest('לא ניתן היה לקבל סוגי משתמשים');
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching userTypes',
                    step: 'didnt get results back from the server',
                    user: user.id,
                    investigation: epidemiologyNumber
                });         
            });
    }

    const fetchLanguages = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching languages',
            step: 'launching languages request',
            user: user.id,
            investigation: epidemiologyNumber
        })
        axios.get('/users/languages')
            .then(result => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    setLanguages(result?.data);
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Fetching languages',
                        step: 'got results back from the server',
                        user: user.id,
                        investigation: epidemiologyNumber
                    });
                } 
            })
            .catch(err => {
                handleFailedRequest('לא ניתן היה לקבל שפות');
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching languages',
                    step: 'didnt get results back from the server',
                    user: user.id,
                    investigation: epidemiologyNumber
                });         
            });
    }

    const handleFilterChange = (filterBy: () => any) => {
        let filterRulesToSet = {...filterRules};
        if (Object.values(filterBy)[0] !== null) {
            filterRulesToSet = {
                ...filterRulesToSet,
                ...filterBy
            }
        } else {
            //@ts-ignore
            delete filterRulesToSet[Object.keys(filterBy)[0]]
        }
        setIsBadgeInVisible(Object.keys(filterRulesToSet).length === 0);
        setFitlerRules(filterRulesToSet)
    }

    const handleFailedRequest = (message: string) => {
        Swal.fire({
            title: message,
            icon: 'error',
        })
    }

    useEffect(() => {
        fetchSourcesOrganization();
        fetchCounties();
        fetchUserTypes();
        fetchLanguages();
    }, [])

    useEffect(() => {
        fetchUsers();
    }, [page, cellNameSort, filterRules, user.userType])
    
    const watchUserInfo = (row: any) => {
        const userInfoToSet = {
            ...row,
            [SignUpFields.LANGUAGES]: row[SignUpFields.LANGUAGES].map((language: string) => {
                return { displayName: language }
            }),
            [SignUpFields.COUNTY]: { displayName: row[SignUpFields.COUNTY] },
            [SignUpFields.DESK]: { name: row[SignUpFields.DESK] },
            [SignUpFields.CITY]: { value: { displayName: row[SignUpFields.CITY] }},
            [SignUpFields.FULL_NAME]: row[SignUpFields.FULL_NAME] || row[SignUpFields.USER_NAME],
            [SignUpFields.SOURCE_ORGANIZATION]: { displayName: row[SignUpFields.SOURCE_ORGANIZATION]}
        };
        setUserDialog({ isOpen: true, info: userInfoToSet });
    }

    const handleCloseDialog = () => setUserDialog({ isOpen: false, info: {} })

    return {
        users,
        counties,
        sourcesOrganization,
        userTypes,
        languages,
        totalCount,
        userDialog,
        isBadgeInVisible,
        watchUserInfo,
        handleCloseDialog,
        handleFilterChange
    }
}

interface useUsersManagementInCome {
    page: number;
    rowsPerPage: number;
    cellNameSort: CellNameSort;
}

interface useUsersManagementOutCome {
    users: SignUpUser[];
    counties: County[];
    sourcesOrganization: SourceOrganization[];
    userTypes: UserTypeModel[];
    languages: Language[];
    totalCount: number;
    userDialog: UserDialog;
    isBadgeInVisible: boolean;
    watchUserInfo: (row: any) => void;
    handleCloseDialog: () => void;
    handleFilterChange: (filterBy: any) => void;
}

export default useUsersManagement;
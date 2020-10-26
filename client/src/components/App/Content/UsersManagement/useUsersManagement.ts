import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2';

import logger from 'logger/logger'
import { Service, Severity } from 'models/Logger'
import SignUpUser from 'models/SignUpUser';
import SignUpFields from 'models/enums/SignUpFields';
import SortOrder from 'models/enums/SortOrder';
import County from 'models/County';
import SourceOrganization from 'models/SourceOrganization';
import UserType from 'models/UserType';
import Language from 'models/Language';
import StoreStateType from 'redux/storeStateType'
import axios from 'Utils/axios'
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions'
import User from 'models/User';
import UserType from 'models/enums/UserType';

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

    const user = useSelector<StoreStateType, User>(state => state.user);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const [users, setUsers] = useState<SignUpUser[]>([]);
    const [counties, setCounties] = useState<County[]>([]);
    const [sourcesOrganization, setSourcesOrganization] = useState<SourceOrganization[]>([])
    const [userTypes, setUserTypes] = useState<UserType[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [userDialog, setUserDialog] = useState<UserDialog>({ isOpen: false, info: {} });

    const fetchUsers = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching users',
            step: 'launching users request',
            user: user.id,
            investigation: epidemiologyNumber
        });
        const fetchUsersRoute = user.userType === UserType.SUPER_ADMIN ? '/users/district' : '/users/county';
        axios.post(fetchUsersRoute, {
            page: {
                number: page,
                size: rowsPerPage
            },
            orderBy: cellNameSort.direction !== undefined ?
                `${get(SortOrderTableHeadersNames, cellNameSort.name)}_${cellNameSort.direction?.toUpperCase()}` : null
        })
            .then(result => {
                result?.data && setUsers(result.data?.users);
                setTotalCount(result.data?.totalCount);
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Fetching users',
                    step: 'got results back from the server',
                    user: user.id,
                    investigation: epidemiologyNumber
                });
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

    const fetchSourcesOrganization = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching sourcesOrganization',
            step: 'launching sourcesOrganization request',
            user: userId,
            investigation: epidemiologyNumber
        })
        axios.get('/users/sourcesOrganization')
            .then(result => {
                result?.data && setSourcesOrganization(result.data);
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Fetching sourcesOrganization',
                    step: 'got results back from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                });
            })
            .catch(err => {
                handleFailedRequest('לא ניתן היה לקבל מסגרות');
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching sourcesOrganization',
                    step: 'didnt get results back from the server',
                    user: userId,
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
            user: userId,
            investigation: epidemiologyNumber
        })
        axios.get('/counties')
            .then(result => {
                result?.data && setCounties(result.data);
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Fetching counties',
                    step: 'got results back from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                });
            })
            .catch(err => {
                handleFailedRequest('לא ניתן היה לקבל נפות');
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching counties',
                    step: 'didnt get results back from the server',
                    user: userId,
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
            user: userId,
            investigation: epidemiologyNumber
        })
        axios.get('/users/userTypes')
            .then(result => {
                result?.data && setUserTypes(result.data);
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Fetching userTypes',
                    step: 'got results back from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                });
            })
            .catch(err => {
                handleFailedRequest('לא ניתן היה לקבל סוגי משתמשים');
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching userTypes',
                    step: 'didnt get results back from the server',
                    user: userId,
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
            user: userId,
            investigation: epidemiologyNumber
        })
        axios.get('/users/languages')
            .then(result => {
                result?.data && setLanguages(result?.data);
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Fetching languages',
                    step: 'got results back from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                });
            })
            .catch(err => {
                handleFailedRequest('לא ניתן היה לקבל שפות');
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching languages',
                    step: 'didnt get results back from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                });         
            });
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
    }, [page, cellNameSort])

    const watchUserInfo = (row: any) => {
        const userInfoToSet = {
            ...row,
            [SignUpFields.LANGUAGES]: row[SignUpFields.LANGUAGES].map((language: string) => {
                return { displayName: language }
            }),
            [SignUpFields.COUNTY]: { displayName: row[SignUpFields.COUNTY] },
            [SignUpFields.DESK]: { name: row[SignUpFields.DESK] },
            [SignUpFields.CITY]: { value: { displayName: row[SignUpFields.CITY] }},
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
        watchUserInfo,
        handleCloseDialog
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
    userTypes: UserType[];
    languages: Language[];
    totalCount: number;
    userDialog: UserDialog;
    watchUserInfo: (row: any) => void;
    handleCloseDialog: () => void;
}

export default useUsersManagement;
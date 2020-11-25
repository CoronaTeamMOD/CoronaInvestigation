import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import logger from 'logger/logger'
import { Severity } from 'models/Logger'
import User from 'models/User';
import SignUpUser from 'models/SignUpUser';
import SignUpFields from 'models/enums/SignUpFields';
import SortOrder from 'models/enums/SortOrder';
import County from 'models/County';
import SourceOrganization from 'models/SourceOrganization';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import UserTypeModel from 'models/UserType';
import UserTypeEnum from 'models/enums/UserType';
import Language from 'models/Language';
import StoreStateType from 'redux/storeStateType'
import axios from 'Utils/axios'
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions'

import { SortOrderTableHeadersNames } from './UsersManagementTableHeaders'
import { defaultPage } from './UsersManagement';

interface UserDialog {
    isOpen: boolean,
    info: SignUpUser
}
interface CellNameSort {
    name: string;
    direction: SortOrder | undefined;
}

const useUsersManagement = ({ page, rowsPerPage, cellNameSort, setPage }: useUsersManagementInCome): useUsersManagementOutCome => {
    
    const [users, setUsers] = useState<SignUpUser[]>([]);
    const [counties, setCounties] = useState<County[]>([]);
    const [sourcesOrganization, setSourcesOrganization] = useState<SourceOrganization[]>([])
    const [userTypes, setUserTypes] = useState<UserTypeModel[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [userDialog, setUserDialog] = useState<UserDialog>({ isOpen: false, info: {} });
    const [filterRules, setFitlerRules] = useState<any>({});
    const [isBadgeInVisible, setIsBadgeInVisible] = useState<boolean>(true);
    
    const user = useSelector<StoreStateType, User>(state => state.user.data);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const { alertError } = useCustomSwal();
    
    const getUsersRoute = () => {
        switch (user.userType) {
            case UserTypeEnum.ADMIN: return '/users/county';
            case UserTypeEnum.SUPER_ADMIN: return '/users/district';
            default: return '';
        }
    }

    const fetchUsers = () => {
        const fetchUsersLogger = logger.setup({
            workflow: 'Fetching users',
            user: user.id,
            investigation: epidemiologyNumber
        });
        fetchUsersLogger.info('launching users request', Severity.LOW);
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
                        fetchUsersLogger.info('got results back from the server', Severity.LOW);
                    } 
                })
                .catch(err => {
                    if (err.response.status === 401) {
                        alertError('אין לך הרשאות למידע זה');
                    }
                    else {
                        alertError('לא ניתן היה לקבל משתמשים');
                    }
                    fetchUsersLogger.error('didnt get results back from the server', Severity.HIGH);
                });
        }
    }

    const fetchSourcesOrganization = () => {
        const fetchSourcesOrganizationLogger = logger.setup({
            workflow: 'Fetching sourcesOrganization',
            user: user.id,
            investigation: epidemiologyNumber
        });
        fetchSourcesOrganizationLogger.info('launching sourcesOrganization request', Severity.LOW);
        axios.get('/users/sourcesOrganization')
            .then(result => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    setSourcesOrganization(result.data);
                    fetchSourcesOrganizationLogger.info('got results back from the server', Severity.LOW);
                } 
            })
            .catch(() => {
                alertError('לא ניתן היה לקבל מסגרות');
                fetchSourcesOrganizationLogger.error('didnt get results back from the server', Severity.HIGH);      
            });
    }

    const fetchCounties = () => {
        const fetchCountiesLogger = logger.setup({
            workflow: 'Fetching counties',
            user: user.id,
            investigation: epidemiologyNumber
        });
        fetchCountiesLogger.info('launching counties request', Severity.LOW);
        axios.get('/counties')
            .then(result => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    setCounties(result.data);
                    fetchCountiesLogger.info('got results back from the server', Severity.LOW);
                }  
            })
            .catch(() => {
                alertError('לא ניתן היה לקבל נפות');
                fetchCountiesLogger.error('didnt get results back from the server', Severity.HIGH);      
            });
    };

    const fetchUserTypes = () => {
        const fetchUserTypesLogger = logger.setup({
            workflow: 'Fetching userTypes',
            user: user.id,
            investigation: epidemiologyNumber
        });
        fetchUserTypesLogger.info('launching userTypes request', Severity.LOW);
        axios.get('/users/userTypes')
            .then(result => {
                if (result?.data && result.headers['content-type'].includes('application/json'))
                {
                    setUserTypes(result.data);
                    fetchUserTypesLogger.info('got results back from the server', Severity.LOW);
                } 
            })
            .catch(() => {
                alertError('לא ניתן היה לקבל סוגי משתמשים');
                fetchUserTypesLogger.error('didnt get results back from the server', Severity.HIGH);       
            });
    }

    const fetchLanguages = () => {
        const fetchLanguagesLogger = logger.setup({
            workflow: 'Fetching languages',
            user: user.id,
            investigation: epidemiologyNumber
        });
        fetchLanguagesLogger.info('launching languages request', Severity.LOW);
        axios.get('/users/languages')
            .then(result => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    setLanguages(result?.data);
                    fetchLanguagesLogger.info('got results back from the server', Severity.LOW);
                } 
            })
            .catch(() => {
                alertError('לא ניתן היה לקבל שפות');
                fetchLanguagesLogger.error('didnt get results back from the server', Severity.HIGH);      
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
        setFitlerRules(filterRulesToSet);
    }

    useEffect(() => {
        fetchSourcesOrganization();
        fetchCounties();
        fetchUserTypes();
        fetchLanguages();
    }, [])

    useEffect(() => {
        setPage(defaultPage);
        page === defaultPage && fetchUsers();
    }, [filterRules, cellNameSort])

    useEffect(() => {
        fetchUsers();
    }, [page, user.userType])
    
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
    setPage: React.Dispatch<React.SetStateAction<number>>;
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
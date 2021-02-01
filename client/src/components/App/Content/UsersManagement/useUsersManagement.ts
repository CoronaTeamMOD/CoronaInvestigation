import axios  from 'axios';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import Desk from 'models/Desk';
import User from 'models/User';
import theme from 'styles/theme';
import logger from 'logger/logger';
import County from 'models/County';
import Language from 'models/Language';
import { Severity } from 'models/Logger';
import SignUpUser from 'models/SignUpUser';
import UserTypeModel from 'models/UserType';
import SortOrder from 'models/enums/SortOrder';
import UserTypeEnum from 'models/enums/UserType';
import StoreStateType from 'redux/storeStateType';
import SignUpFields from 'models/enums/SignUpFields';
import SourceOrganization from 'models/SourceOrganization';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

import { defaultPage } from './UsersManagement';
import { SortOrderTableHeadersNames } from './UsersManagementTableHeaders'

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
    const [desks, setDesks] = useState<Desk[]>([]);
    const [sourcesOrganization, setSourcesOrganization] = useState<SourceOrganization[]>([])
    const [userTypes, setUserTypes] = useState<UserTypeModel[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [userDialog, setUserDialog] = useState<UserDialog>({ isOpen: false, info: {} });
    const [filterRules, setFitlerRules] = useState<any>({});
    const [isBadgeInVisible, setIsBadgeInVisible] = useState<boolean>(true);
    
    const user = useSelector<StoreStateType, User>(state => state.user.data);
    const displayedCounty = useSelector<StoreStateType, number>(state => state.user.displayedCounty);
    const countyDisplayName = useSelector<StoreStateType, string>(state => state.user.data.countyByInvestigationGroup.displayName);

    const { alertError, alertWarning } = useCustomSwal();
    
    const deactivateAllCountyUsersWarningTitle = `האם אתה בטוח שתרצה לכבות את כל המשתמשים בנפת ${countyDisplayName}`;

    const getUsersRoute = () => {
        switch (user.userType) {
            case UserTypeEnum.ADMIN: return '/users/county';
            case UserTypeEnum.SUPER_ADMIN: return '/users/district';
            default: return '';
        }
    }

    const fetchUsers = () => {
        const fetchUsersLogger = logger.setup('Fetching users');
        fetchUsersLogger.info('launching users request', Severity.LOW);
        const fetchUsersRoute = getUsersRoute();
        setIsLoading(true);
        if (fetchUsersRoute !== '') {
            axios.post(fetchUsersRoute, {
                page: {
                    number: page,
                    size: rowsPerPage
                },
                orderBy: cellNameSort.direction !== undefined ? 
                         `${get(SortOrderTableHeadersNames, cellNameSort.name)}_${cellNameSort.direction?.toUpperCase()}` : null,
                filter: Object.values(filterRules).reduce((obj, item) => Object.assign(obj, item) , {}),
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
                })
                .finally(() => setIsLoading(false));
        }
    }

    const fetchSourcesOrganization = () => {
        const fetchSourcesOrganizationLogger = logger.setup('Fetching sourcesOrganization');
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
        const fetchCountiesLogger = logger.setup('Fetching counties');
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

    const fetchDesks = () => {
        const desksLogger = logger.setup('Fetching desks');
        desksLogger.info('launching desks request', Severity.LOW);
        axios.get('/desks/county')
            .then(result => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    setDesks(result.data);
                    desksLogger.info('got results back from the server', Severity.LOW);
                }  
            })
            .catch(() => {
                alertError('לא ניתן היה לקבל דסקים');
                desksLogger.error('didnt get results back from the server', Severity.HIGH);      
            });
    }

    const fetchUserTypes = () => {
        const fetchUserTypesLogger = logger.setup('Fetching userTypes');
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
        const fetchLanguagesLogger = logger.setup('Fetching languages');
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
        fetchDesks();
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

    const setUserActivityStatus = (isActive: boolean, userId: string) : Promise<any> => {
        const setUpdateActivityStatusLogger = logger.setup('Updating user activity status');
        setUpdateActivityStatusLogger.info('send request to server for updating user activity status', Severity.LOW);
        setIsLoading(true);
        return axios.post('users/updateIsUserActiveById', {
            isActive,
            userId
        }).then((result) => {
            if(result.data)
                fetchUsers();
                setUpdateActivityStatusLogger.info('updated user activity status successfully', Severity.LOW);
        }).catch((error) => {
            alertError('לא הצלחנו לעדכן את סטטוס הפעילות של המשתמש');
            setUpdateActivityStatusLogger.error(`error in updating user activity status ${error}`, Severity.HIGH);
        })
        .finally(() => setIsLoading(false));
    }

    const setUserSourceOrganization = (sourceOrganization: string, userId: string) => {
        const setUpdateSourcesOrganizationLogger = logger.setup('Updating user source organization');
        setUpdateSourcesOrganizationLogger.info('send request to server for updating user source organization', Severity.LOW);
        setIsLoading(true);
        axios.post('users/updateSourceOrganizationById', {
            sourceOrganization,
            userId
        }).then((result) => {
            if(result.data)
                fetchUsers();
                setUpdateSourcesOrganizationLogger.info('updated user source organization successfully', Severity.LOW);
        }).catch((error) => {
            alertError('לא הצלחנו לעדכן את מסגרת המשתמש');
            setUpdateSourcesOrganizationLogger.error(`error in updating user source organization ${error}`, Severity.HIGH);
        })
        .finally(() => setIsLoading(false));
    }

    const setUserDesk = (deskId: number, userId: string) => {
        const setUpdateDeskLogger = logger.setup('Updating user desk');
        setUpdateDeskLogger.info(`send request to server for updating user desk to ${deskId}`, Severity.LOW);
        setIsLoading(true);
        axios.post('users/updateDesk', {
            desk: deskId,
            userId
        }).then((result) => {
            if(result.data)
                setUpdateDeskLogger.info('updated user desk successfully', Severity.LOW);
                fetchUsers();
        }).catch((error) => {
            alertError('לא הצלחנו לעדכן את הדסק של המשתמש');
            setUpdateDeskLogger.error(`error in updating user desk due to ${error}`, Severity.HIGH);
        })
        .finally(() => setIsLoading(false));
    }

    const setUserCounty = (countyId: number, userId: string) => {
        if(userId != user.id){
            const setUpdateCountyLogger = logger.setup('Updating user county');
            setUpdateCountyLogger.info(`send request to server for updating user county to ${countyId}`, Severity.LOW);
            setIsLoading(true);
    
            axios.post('users/updateCounty', {
                investigationGroup: countyId,
                userId
            }).then((result) => {
                if(result.data)
                setUpdateCountyLogger.info('updated user county successfully', Severity.LOW);
                fetchUsers();
            }).catch((error) => {
                alertError('לא הצלחנו לעדכן את הנפה של המשתמש');
                setUpdateCountyLogger.error(`error in updating user county due to ${error}`, Severity.HIGH);
            })
            .finally(() => setIsLoading(false));
        } else {
            alertWarning('אין אפשרות להעביר את עצמך לנפה אחרת', {text: 'אם זו עדיין הפעולה שהתכוונת לבצע, ניתן לפנות לתמיכה!'})
        }
    }

    const handleDeactivateAllUsersCounty = () => {
        alertWarning((deactivateAllCountyUsersWarningTitle),{
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך',
        }).then((result) => {
            if (result.value) {
                const deactivateAllCountyUsersLogger = logger.setup('Updating all county users activity status to false');
                deactivateAllCountyUsersLogger.info('send request to server for updating users activity statuses', Severity.LOW);
                setIsLoading(true);
                return axios.post('users/deactivateAllCountyUsers', {
                    county: displayedCounty
                }).then((result) => {
                    if(result.data){
                        fetchUsers();
                        deactivateAllCountyUsersLogger.info('updated users activity statuses successfully', Severity.LOW); 
                    }
                }).catch((error) => {
                    alertError('לא הצלחנו לכבות את כל החוקרים בנפה');
                    deactivateAllCountyUsersLogger.error(`error in updating users activity statuses ${error}`, Severity.HIGH);
                    setIsLoading(false); 
                })
            }            
        });
    };

    return {
        users,
        counties,
        desks,
        sourcesOrganization,
        userTypes,
        languages,
        totalCount,
        userDialog,
        isBadgeInVisible,
        watchUserInfo,
        handleCloseDialog,
        handleFilterChange,
        setUserActivityStatus,
        setUserSourceOrganization,
        setUserDesk,
        setUserCounty,
        handleDeactivateAllUsersCounty,
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
    desks: Desk[];
    sourcesOrganization: SourceOrganization[];
    userTypes: UserTypeModel[];
    languages: Language[];
    totalCount: number;
    userDialog: UserDialog;
    isBadgeInVisible: boolean;
    watchUserInfo: (row: any) => void;
    handleCloseDialog: () => void;
    handleFilterChange: (filterBy: any) => void;
    setUserActivityStatus: (isActive: boolean, userId: string) => Promise<any>;
    setUserSourceOrganization: (sourceOrganization: string, userId: string) => void;
    setUserDesk: (deskId: number, userId: string) => void;
    setUserCounty: (countyId: number, userId: string) => void;
    handleDeactivateAllUsersCounty: () => void;
}

export default useUsersManagement;
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2';

import logger from 'logger/logger'
import { Service, Severity } from 'models/Logger'
import SignUpUser from 'models/SignUpUser';
import SignUpFields from 'models/enums/SignUpFields';
import SortOrder from 'models/enums/SortOrder';
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

    const handleFailedRequest = (message: string) => {
        Swal.fire({
            title: message,
            icon: 'error',
        })
    }

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
    users: SignUpUser[],
    totalCount: number;
    userDialog: UserDialog;
    watchUserInfo: (row: any) => void;
    handleCloseDialog: () => void;
}

export default useUsersManagement;
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2';

import logger from 'logger/logger'
import { Service, Severity } from 'models/Logger'
import SignUpUser from 'models/SignUpUser';
import SignUpFields from 'models/enums/SignUpFields';
import StoreStateType from 'redux/storeStateType'
import axios from 'Utils/axios'

interface UserDialog {
    isOpen: boolean,
    info: SignUpUser
}

const useUsersManagement = ({ page, rowsPerPage}: useUsersManagementInCome) : useUsersManagementOutCome => {

    const userId = useSelector<StoreStateType, string>(state => state.user.id);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const [users, setUsers] = useState<SignUpUser[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [userDialog, setUserDialog] = useState<UserDialog>({isOpen: false, info: {}});

    const fetchUsers = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching users',
            step: 'launching users request',
            user: userId,
            investigation: epidemiologyNumber
        })
        axios.post('/users', { page: { number: page, size: rowsPerPage } })
            .then(result => {
                result?.data && setUsers(result.data?.users);
                                setTotalCount(result.data?.totalCount);
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Fetching users',
                    step: 'got results back from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                });
            })
            .catch(err => {
                handleFailedRequest('לא ניתן היה לקבל משתמשים');
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching users',
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
        fetchUsers();
    }, [page])
    
    const watchUserInfo = (row: any) => {
        const userInfoToSet = {
            ...row,
            [SignUpFields.LANGUAGES]: row[SignUpFields.LANGUAGES].map((language: string) =>  {
                return { displayName: language}
            }),
            [SignUpFields.COUNTY]: { displayName: row[SignUpFields.COUNTY] },
            [SignUpFields.CITY]: { value: { displayName: row[SignUpFields.COUNTY] }},
            [SignUpFields.SOURCE_ORGANIZATION]: { displayName: row[SignUpFields.SOURCE_ORGANIZATION]}
        };
        setUserDialog({isOpen: true, info: userInfoToSet});
    }

    const handleCloseDialog = () => setUserDialog({isOpen: false, info: {}})

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
}

interface useUsersManagementOutCome {
    users: SignUpUser[],
    totalCount: number;
    userDialog: UserDialog;
    watchUserInfo: (row: any) => void;
    handleCloseDialog: () => void;
}

export default useUsersManagement;
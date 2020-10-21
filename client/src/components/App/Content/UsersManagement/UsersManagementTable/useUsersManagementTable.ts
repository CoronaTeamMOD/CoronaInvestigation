import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2';

import logger from 'logger/logger'
import { Service, Severity } from 'models/Logger'
import StoreStateType from 'redux/storeStateType'
import axios from 'Utils/axios'

const useUsersManagementTable = ({ page, rowsPerPage}: useUsersManagementTableInCome) : useUsersManagementTableOutCome => {

    const userId = useSelector<StoreStateType, string>(state => state.user.id);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const [users, setUsers] = useState<any>([]);
    const [totalCount, setTotalCount] = useState<number>(0);

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
                result?.data && setTotalCount(result.data?.totalCount);
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
    

    return {
        users,
        totalCount
    }
}

interface useUsersManagementTableInCome {
    page: number;
    rowsPerPage: number;
}

interface useUsersManagementTableOutCome {
    users: any
    totalCount: number;
}

export default useUsersManagementTable;
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2';

import logger from 'logger/logger'
import { Service, Severity } from 'models/Logger'
import County from 'models/County';
import SourceOrganization from 'models/SourceOrganization';
import UserType from 'models/UserType';
import StoreStateType from 'redux/storeStateType'
import axios from 'Utils/axios'

const useUsersManagementTable = ({ page, rowsPerPage}: useUsersManagementTableInCome) : useUsersManagementTableOutCome => {

    const userId = useSelector<StoreStateType, string>(state => state.user.id);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const [users, setUsers] = useState<any>([]);
    const [counties, setCounties] = useState<County[]>([]);
    const [sourcesOrganization, setSourcesOrganization] = useState<SourceOrganization[]>([])
    const [userTypes, setUserTypes] = useState<UserType[]>([]);
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
    }, [])

    useEffect(() => {
        fetchUsers();
    }, [page])
    

    return {
        users,
        counties,
        sourcesOrganization,
        userTypes,
        totalCount
    }
}

interface useUsersManagementTableInCome {
    page: number;
    rowsPerPage: number;
}

interface useUsersManagementTableOutCome {
    users: any
    counties: County[];
    sourcesOrganization: SourceOrganization[];
    userTypes: UserType[];
    totalCount: number;
}

export default useUsersManagementTable;
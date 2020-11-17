import React from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { persistor } from 'redux/store';

import User from 'models/User';
import logger from 'logger/logger';
import { Service, Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import { setIsActive } from 'redux/User/userActionCreators';

import useStyles, { AppToolbarClasses } from './AppToolbarStyles';

export interface useTopToolbarOutcome  {
    logout: () => void;
    setUserActivityStatus: (isActive: boolean) => Promise<any>;
    getCountyByUser: () => void;
    classes: AppToolbarClasses;
    user: User;
    isActive: boolean | null;
    countyDisplayName: string;
}

const useAppToolbar = () :  useTopToolbarOutcome => {
    const user = useSelector<StoreStateType, User>(state => state.user.data);
    const classes = useStyles();
    
    const [countyDisplayName, setCountyDisplayName] = React.useState<string>('');

    React.useEffect(() => {
        if (user.investigationGroup !== -1) {
            getCountyByUser();
            getUserActivityStatus();
        }
    }, [user.investigationGroup]);

    const getUserActivityStatus = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'GraphQL request to the DB',
            step: 'started user activity status fetching'
        });
        axios.get(`/users/userActivityStatus`)
        .then((result) => { 
            if (result.data) {
                setIsActive(result.data.isActive);
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'GraphQL request to the DB',
                    step: 'fetched user activity status successfully'
                });
            } else {
                logger.warn({
                    service: Service.CLIENT,
                    severity: Severity.MEDIUM,
                    workflow: 'GraphQL request to the DB',
                    step: 'The user doesnt exist on db'
                });
            }
        }).catch((error) => {
            Swal.fire({
                title: 'לא הצלחנו לקבל את הסטטוס הנוכחי שלך',
                icon: 'error',
                customClass: {
                    title: classes.swalTitle
                },
            });
            logger.error({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'GraphQL request to the DB',
                step: `error in fetching user activity status ${error}`
            });
        });
    }

    const logout = async () => {
        await setUserActivityStatus(false);
        await persistor.purge();
        window.location.href = `${window.location.protocol}//${window.location.hostname}/.auth/logout`;
    }

    const setUserActivityStatus = (isActive: boolean) : Promise<any> => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'GraphQL request to the DB',
            step: 'started is user active updating'
        });
        return axios.post('users/updateIsUserActive', {
            isActive
        }).then((result) => {
            if(result.data)
                setIsActive(result.data.isActive);
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'GraphQL request to the DB',
                    step: 'updated is user active successfully'
                });
        }).catch((error) => {
            Swal.fire({
                title: 'לא הצלחנו לעדכן את הסטטוס שלך',
                icon: 'error',
                customClass: {
                    title: classes.swalTitle
                },
            });
            logger.error({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'GraphQL request to the DB',
                step: `error in updating is user active ${error}`
            });
        });
    }

    const getCountyByUser = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'GraphQL request to the DB',
            step: 'started fetching county display name by user'
        });
        axios.get('counties/county/displayName').then((result) => {
            if(result.data){
                setCountyDisplayName(result.data);
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'GraphQL request to the DB',
                    step: 'fetched county display name by user successfully'
                });
            }
        }).catch((error) => {
            Swal.fire({
                title: 'לא הצלחנו לקבל את הלשכה שלך',
                icon: 'error',
                customClass: {
                    title: classes.swalTitle
                },
            });
            logger.error({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'GraphQL request to the DB',
                step: `error in fetching county display name by user ${error}`
            });
        });
    }

    return {
        user,
        isActive: user.isActive,
        logout,
        setUserActivityStatus,
        classes,
        getCountyByUser,
        countyDisplayName
    }
};

export default useAppToolbar;
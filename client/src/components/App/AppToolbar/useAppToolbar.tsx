import React from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { persistor } from 'redux/store';

import User from 'models/User';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';
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

    const getUserActivityStatusLogger = logger.setup({
        workflow: 'GraphQL request to the DB',
    });

    React.useEffect(() => {
        if (user.investigationGroup !== -1) {
            getCountyByUser();
            getUserActivityStatus();
        }
    }, [user.investigationGroup]);

    const getUserActivityStatus = () => {
        getUserActivityStatusLogger.info('started user activity status fetching', Severity.LOW)
        axios.get(`/users/userActivityStatus`)
        .then((result) => { 
            if (result.data) {
                setIsActive(result.data.isActive);
                getUserActivityStatusLogger.info('fetched user activity status successfully', Severity.LOW)
            } else {
                getUserActivityStatusLogger.warn('The user doesnt exist on db',Severity.MEDIUM)
            }
        }).catch((error) => {
            Swal.fire({
                title: 'לא הצלחנו לקבל את הסטטוס הנוכחי שלך',
                icon: 'error',
                customClass: {
                    title: classes.swalTitle
                },
            });
            getUserActivityStatusLogger.error(`error in fetching user activity status ${error}`, Severity.HIGH)
        });
    }

    const logout = async () => {
        await setUserActivityStatus(false);
        await persistor.purge();
        window.location.href = `${window.location.protocol}//${window.location.hostname}/.auth/logout`;
    }

    const setUserActivityStatus = (isActive: boolean) : Promise<any> => {
        getUserActivityStatusLogger.info('started is user active updating',Severity.LOW)
        return axios.post('users/updateIsUserActive', {
            isActive
        }).then((result) => {
            if(result.data)
                setIsActive(result.data.isActive);
                getUserActivityStatusLogger.info('updated is user active successfully', Severity.LOW)
        }).catch((error) => {
            Swal.fire({
                title: 'לא הצלחנו לעדכן את הסטטוס שלך',
                icon: 'error',
                customClass: {
                    title: classes.swalTitle
                },
            });
            getUserActivityStatusLogger.error(`error in updating is user active ${error}`, Severity.HIGH)
        });
    }

    const getCountyByUser = () => {
        const getCountyByUserLogger = logger.setup({
            workflow: 'GraphQL request to the DB',
        });
        getCountyByUserLogger.info('started fetching county display name by user', Severity.LOW)
        axios.get('counties/county/displayName').then((result) => {
            if(result.data){
                setCountyDisplayName(result.data);
                getCountyByUserLogger.info('fetched county display name by user successfully', Severity.LOW)
            }
        }).catch((error) => {
            Swal.fire({
                title: 'לא הצלחנו לקבל את הלשכה שלך',
                icon: 'error',
                customClass: {
                    title: classes.swalTitle
                },
            });
            getCountyByUserLogger.error(`error in fetching county display name by user ${error}`, Severity.HIGH)
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
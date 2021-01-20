import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import User from 'models/User';
import logger from 'logger/logger';
import { persistor } from 'redux/store';
import { Severity } from 'models/Logger';
import { indexRoute } from 'Utils/Routes/Routes';
import StoreStateType from 'redux/storeStateType';
import { UserState } from 'redux/User/userReducer';
import { setIsActive } from 'redux/User/userActionCreators';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

export interface useTopToolbarOutcome  {
    logout: () => void;
    setUserActivityStatus: (isActive: boolean) => Promise<any>;
    user: User;
    isActive: boolean | null;
}

const useAppToolbar = () :  useTopToolbarOutcome => {
    const user = useSelector<StoreStateType, UserState>(state => state.user);
    const history = useHistory();
    const { alertError } = useCustomSwal();
    
    const getUserActivityStatusLogger = logger.setup('GraphQL request to the DB');

    React.useEffect(() => {
        if (user.isLoggedIn) {
            getUserActivityStatus();
        }
    }, [user.isLoggedIn]);

    const getUserActivityStatus = () => {
        getUserActivityStatusLogger.info('started user activity status fetching', Severity.LOW);
        axios.get(`/users/userActivityStatus`)
        .then((result) => { 
            if (result.data) {
                setIsActive(result.data.isActive);
                getUserActivityStatusLogger.info('fetched user activity status successfully', Severity.LOW);
            } else {
                getUserActivityStatusLogger.warn('The user doesnt exist on db',Severity.MEDIUM);
            }
        }).catch((error) => {
            alertError('לא הצלחנו לקבל את הסטטוס הנוכחי שלך');
            getUserActivityStatusLogger.error(`error in fetching user activity status ${error}`, Severity.HIGH);
        });
    }

    const logout = async () => {
        await setUserActivityStatus(false);
        await persistor.purge();
        history.replace({state: {}});
        window.location.href = `${window.location.protocol}//${window.location.hostname}/.auth/logout?post_logout_redirect_uri=${indexRoute}`;
    }

    const setUserActivityStatus = (isActive: boolean) : Promise<any> => {
        getUserActivityStatusLogger.info('started is user active updating', Severity.LOW);
        return axios.post('users/updateIsUserActive', {
            isActive
        }).then((result) => {
            if(result.data)
                setIsActive(result.data.isActive);
                getUserActivityStatusLogger.info('updated is user active successfully', Severity.LOW);
        }).catch((error) => {
            alertError('לא הצלחנו לעדכן את הסטטוס שלך');
            getUserActivityStatusLogger.error(`error in updating is user active ${error}`, Severity.HIGH);
        });
    }

    return {
        user: user.data,
        isActive: user.data.isActive,
        logout,
        setUserActivityStatus,
    }
};

export default useAppToolbar;
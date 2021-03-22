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
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setDisplayedCounty, setDisplayedDistrict, setInvestigationGroup, setIsActive } from 'redux/User/userActionCreators';

export interface useTopToolbarOutcome  {
    logout: () => void;
    setUserActivityStatus: (isActive: boolean) => Promise<any>;
    user: User;
    isActive: boolean | null;
    changeUserDistrict: (district: number) => Promise<any>;
    changeUserCounty: (county: number) => void;
}

const useAppToolbar = () :  useTopToolbarOutcome => {

    const user = useSelector<StoreStateType, UserState>(state => state.user);
    const displayedDistrict = useSelector<StoreStateType, number>(state => state.user.displayedDistrict);

    const history = useHistory();
    const { alertError } = useCustomSwal();
    
    React.useEffect(() => {
        if (user.isLoggedIn) {
            getUserActivityStatus();
        }
    }, [user.isLoggedIn]);

    const getUserActivityStatus = () => {
        const getUserActivityStatusLogger = logger.setup('GraphQL request to the DB');
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
    };

    const logout = async () => {
        await setUserActivityStatus(false);
        await persistor.purge();
        history.replace({state: {}});
        window.location.href = `${window.location.protocol}//${window.location.hostname}/.auth/logout?post_logout_redirect_uri=${indexRoute}`;
    };

    const setUserActivityStatus = (isActive: boolean) : Promise<any> => {
        const setUserActivityStatusLogger = logger.setup('GraphQL request to the DB');
        setUserActivityStatusLogger.info('started is user active updating', Severity.LOW);
        return axios.post('users/updateIsUserActive', {
            isActive
        }).then((result) => {
            if(result.data)
                setIsActive(result.data.isActive);
                setUserActivityStatusLogger.info('updated is user active successfully', Severity.LOW);
        }).catch((error) => {
            alertError('לא הצלחנו לעדכן את הסטטוס שלך');
            setUserActivityStatusLogger.error(`error in updating is user active ${error}`, Severity.HIGH);
        });
    };

    const changeUserDistrict = (district: number) : Promise<any> => {
        const changeUserDistrictLogger = logger.setup('GraphQL request to the DB');
        changeUserDistrictLogger.info('changing user district', Severity.LOW);
        return axios.post('users/updateDistrict', {
            district
        }).then((result) => {
            if(result.data){
                setInvestigationGroup(district, result.data.countyDisplayName);
                setDisplayedDistrict(district);
                setDisplayedCounty(result.data.countyId);
            }    
            changeUserDistrictLogger.info('updated user district successfully', Severity.LOW);
        }).catch((error) => {
            alertError('לא הצלחנו לשנות את המחוז שלך');
            changeUserDistrictLogger.error(`error in updating user district ${error}`, Severity.HIGH);
        });
    };

    const changeUserCounty = (county: number) => {
        if (!user.data.isDeveloper){
            setDisplayedCounty(county);
        } else {
            const changeUserCountyLogger = logger.setup('GraphQL request to the DB');
            changeUserCountyLogger.info('changing user county', Severity.LOW);
            axios.post('users/updateCounty', {
                    investigationGroup: county,
                    userId: user.data.id
            }).then((result) => {
                if(result.data){
                    setInvestigationGroup(displayedDistrict, result.data.countyByInvestigationGroup.displayName);
                    setDisplayedCounty(county);
                }    
                changeUserCountyLogger.info('updated user county successfully', Severity.LOW);
            }).catch((error) => {
                alertError('לא הצלחנו לשנות את הנפה שלך');
                changeUserCountyLogger.error(`error in updating user district ${error}`, Severity.HIGH);
            });
        };
    };

    return {
        user: user.data,
        isActive: user.data.isActive,
        logout,
        setUserActivityStatus,
        changeUserDistrict,
        changeUserCounty
    }
};

export default useAppToolbar;
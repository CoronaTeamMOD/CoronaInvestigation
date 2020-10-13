import React from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import StoreStateType from 'redux/storeStateType';
import User from 'models/User';
import axios from 'Utils/axios';

import useStyles, { AppToolbarClasses } from './AppToolbarStyles';
import logger from 'logger/logger';
import { Service, Severity } from 'models/Logger';

export interface useTopToolbarOutcome  {
    setUserActivityStatus: (isActive: boolean) => void;
    getCountyByUser: () => void;
    classes: AppToolbarClasses;
    user: User;
    isActive: boolean;
    countyDisplayName: string;
}

const useAppToolbar = () :  useTopToolbarOutcome => {

    const firstUserUpdate = React.useRef(true);
    const user = useSelector<StoreStateType, User>(state => state.user);
    const classes = useStyles();
    
    const [isActive, setIsActive] = React.useState<boolean>(false);
    const [countyDisplayName, setCountyDisplayName] = React.useState<string>('');

    React.useEffect(() => {
        if (firstUserUpdate.current) {
            firstUserUpdate.current = false;
            getCountyByUser();
        } else {
            getUserActivityStatus();
        }
    }, [user]);

    const getUserActivityStatus = () => {
        axios.get(`/users/userActivityStatus`)
        .then((result) => { 
            setIsActive(result.data.isActive)
        }).catch(() => {
            Swal.fire({
                title: 'לא הצלחנו לקבל את הסטטוס הנוכחי שלך',
                icon: 'error',
                customClass: {
                    title: classes.swalTitle
                },
            });
        });
    }

    const setUserActivityStatus = (isActive: boolean) => {
        axios.post('users/updateIsUserActive', {
            isActive
        }).then((result) => {
            if(result.data)
                setIsActive(result.data.isActive);
        }).catch(() => {
            Swal.fire({
                title: 'לא הצלחנו לעדכן את הסטטוס שלך',
                icon: 'error',
                customClass: {
                    title: classes.swalTitle
                },
            });
        });
    }

    const getCountyByUser = () => {
        axios.get('users/county/displayName').then((result) => {
            if(result.data){
                setCountyDisplayName(result.data.countyById.displayName);
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'GraphQL request to the DB',
                    step: 'fetched county display name by user successfully'
                });
            }
        }).catch(() => {
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
                step: 'error in fetching county display name by user'
            });
        });
    }

    return {
        user,
        isActive,
        setUserActivityStatus,
        classes,
        getCountyByUser,
        countyDisplayName
    }
};

export default useAppToolbar;
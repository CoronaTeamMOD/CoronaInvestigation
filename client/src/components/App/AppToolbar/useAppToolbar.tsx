import React from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import StoreStateType from 'redux/storeStateType';
import User from 'models/User';
import axios from 'Utils/axios';

import useStyles, { AppToolbarClasses } from './AppToolbarStyles';

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
            console.log(result)
            if(result.data){
                setCountyDisplayName(result.data.countyById.displayName);
            }
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
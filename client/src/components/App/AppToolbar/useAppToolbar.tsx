import React from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import StoreStateType from 'redux/storeStateType';
import User from 'models/User';
import axios from 'Utils/axios';

import useStyles, { AppToolbarClasses } from './AppToolbarStyles';

export interface useTopToolbarOutcome  {
    setUserActivityStatus: (isActive: boolean) => void;
    setUserDesk: (deskId: number) => void;
    classes: AppToolbarClasses;
    user: User;
    isActive: boolean;
}

const useAppToolbar = () :  useTopToolbarOutcome => {

    const firstUserUpdate = React.useRef(true);
    const user = useSelector<StoreStateType, User>(state => state.user);
    const classes = useStyles();

    const [isActive, setIsActive] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (firstUserUpdate.current) {
            firstUserUpdate.current = false;
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

    const setUserDesk = (deskId: number) => {
        axios.post('users/updateUserDesk', {
            deskId
        }).then((result) => {
            if(result.data) {
                setIsActive(result.data.isActive);
            }
        }).catch(() => {
            Swal.fire({
                title: 'לא הצלחנו לעדכן את הדסק שלך',
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
        setUserDesk,
        classes
    }
};

export default useAppToolbar;
import Swal from 'sweetalert2';
import axios from 'Utils/axios';

import useStyles from './AppToolbarStyles';

export interface useInteractionsTabInput {
    setIsActive: (isActive: boolean) => void;
};


export interface useTopToolbarOutcome  {
    getUserActivityStatus: () => void;
    setUserActivityStatus: (isActive: boolean) => void;
    setUserDesk: (deskId: number) => void;
}

const useAppToolbar = ({setIsActive}: useInteractionsTabInput) :  useTopToolbarOutcome => {

    const classes = useStyles();

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
        getUserActivityStatus,
        setUserActivityStatus,
        setUserDesk
    }
};

export default useAppToolbar;
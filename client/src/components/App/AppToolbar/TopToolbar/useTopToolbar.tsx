import Swal from 'sweetalert2';
import axios from 'Utils/axios';

import useStyles from './TopToolbarStyles';

export interface useInteractionsTabInput {
    setIsActive: (isActive: boolean) => void;
};


export interface useTopToolbarOutcome  {
    getUserActivityStatus: (userId: string) => void;
    setUserActivityStatus: (userId: string, isActive: boolean) => void;
}

const useTopToolbar = (props: useInteractionsTabInput) :  useTopToolbarOutcome => {

    const classes = useStyles({});

    const getUserActivityStatus = (userId: string) => {
        axios.get(`/usersInfo/userActivityStatus`)
        .then((result) => { 
            props.setIsActive(result.data.isActive)
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

    const setUserActivityStatus = (userId: string, isActive: boolean) => {
        axios.post('usersInfo/updateIsUserActive', {
            isActive
        }).then((result) => {
            if(result.data)
                props.setIsActive(result.data.isActive);
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
        getUserActivityStatus,
        setUserActivityStatus
    }
};

export default useTopToolbar;
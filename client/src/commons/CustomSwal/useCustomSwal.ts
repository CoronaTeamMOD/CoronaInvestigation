import Swal, {SweetAlertIcon, SweetAlertOptions} from 'sweetalert2';
import useStyles from './CustomSwalStyles';

const useCustomSwal = () => {
    const classes = useStyles();

    const alert = (title: string,icon: SweetAlertIcon, options?: SweetAlertOptions) =>
        Swal.fire({
            title,
            icon,
            customClass: {
                title: classes.swalTitle
            },
            ...options
        });

    const alertError = (title: string, options?: SweetAlertOptions) => alert(title, 'error', options);
    const alertWarning = (title: string, options?: SweetAlertOptions) => alert(title, 'warning', options);
    const alertSuccess = (title: string, options?: SweetAlertOptions) => alert(title, 'success', options);

    return {
        alertError,
        alertWarning,
        alertSuccess,
    }

};

export default useCustomSwal;
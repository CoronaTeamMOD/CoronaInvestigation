import Swal, {SweetAlertIcon, SweetAlertOptions} from 'sweetalert2';
import useStyles from './CustomSwalStyles';

const useCustomSwal = () => {
    const classes = useStyles();

    const alert = (title: string, text: string, icon: SweetAlertIcon, options?: SweetAlertOptions) =>
        Swal.fire({
            title,
            text,
            icon,
            customClass: {
                title: classes.swalTitle,
                content: classes.swalText
            },
            ...options
        });

    const alertError = (title: string, text?: string,  options?: SweetAlertOptions) => alert(title, text ? text : '', 'error', options);
    const alertWarning = (title: string, text?: string, options?: SweetAlertOptions) => alert(title, text ? text : '', 'warning', options);
    const alertSuccess = (title: string, text?: string, options?: SweetAlertOptions) => alert(title, text ? text : '', 'success', options);

    return {
        alertError,
        alertWarning,
        alertSuccess,
    }

};

export default useCustomSwal;
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';

import useStyles from './ComplexitySwalStyles'

const useComplexitySwal = () => {
    const classes = useStyles();

    const complexityErrorAlert = (error: any) => {
        if (error?.response?.data?.message && error.response.data.message.includes('complexity')) {
            Swal.fire({
                title: 'לא הצלחנו לחשב את מורכבות החקירה מחדש',
                text: 'שים לב לשדות סטטוסים, גורם מאבטח ותחום עיסוק',
                icon: 'error',
                customClass: {
                    title: classes.swalTitle,
                    content: classes.swalText
                }
            });
        } else {
            Swal.fire({
                title: 'לא הצלחנו לשמור את השינויים, אנא נסה שוב בעוד מספר דקות',
                icon: 'error',
                customClass: {
                    title: classes.swalTitle,
                }
            });
        }
    }

    return {
        complexityErrorAlert
    }

};

export default useComplexitySwal;
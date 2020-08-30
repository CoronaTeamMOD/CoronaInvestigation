import Swal from 'sweetalert2';
import theme from 'styles/theme';

import useStyles from './InvestigationFormStyles';
import { useInvestigationFormOutcome } from './InvestigationFormInterfaces';


const useInvestigationForm = (): useInvestigationFormOutcome => {
    const classes = useStyles({});

    const confirmFinishInvestigation = () => {
        Swal.fire({
            icon: 'warning',
            title: 'האם אתה בטוח שאתה רוצה לסיים ולשמור את החקירה?',
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך',
            customClass: {
                title: classes.swalTitle
            }
          }).then((result) => {
            if (result.value) {
                handleInvestigationFinish();
            };
        }).catch((err) => console.error(err));
    };

    const handleInvestigationFinish = () => {
        Swal.fire({
            icon: 'success',
            title: 'החקירה הסתיימה! הנך מועבר לעמוד הנחיתה',
            customClass: {
                title: classes.swalTitle
            },
            timer: 1750,
            showConfirmButton: false
        }
        ).catch((err) => console.error(err));

        // TODO: navigate to home page + wait until swal closes
    };

    return {
        confirmFinishInvestigation,
        handleInvestigationFinish
    }
};

export default useInvestigationForm;

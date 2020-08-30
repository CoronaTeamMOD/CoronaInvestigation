import Swal from 'sweetalert2';
import theme from 'styles/theme';
import { useHistory } from "react-router-dom";

import {timeout} from 'Utils/Timeout/Timeout';

import useStyles from './InvestigatedPersonInfoStyles';
import {landingPageRoute} from 'Utils/Routes/Routes';
import { InvestigatedPersonInfoOutcome } from './InvestigatedPersonInfoInterfaces';

const useInvestigatedPersonInfo = (): InvestigatedPersonInfoOutcome => {
    let history = useHistory();
    const classes = useStyles({});

    const confirmExitUnfinishedInvestigation = () => {
        Swal.fire({
            icon: 'warning',
            title: 'האם אתה בטוח שתרצה לצאת מהחקירה ולחזור אליה מאוחר יותר?',
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך',
            customClass: {
                title: classes.swalTitle,
            }
          }).then((result) => {
            if (result.value) {
                handleInvestigationFinish();
            };
        });
    };

    const handleInvestigationFinish = () => {
        Swal.fire({
            icon: 'success',
            title: 'בחרת לצאת מהחקירה לפני השלמתה! הנך מועבר לעמוד הנחיתה',
            customClass: {
                title: classes.swalTitle,
            },
            timer: 1750,
            showConfirmButton: false
        }
        );

        timeout(1900).then(()=> history.push(landingPageRoute));
    };

    return {
        confirmExitUnfinishedInvestigation
    }
};

export default useInvestigatedPersonInfo;

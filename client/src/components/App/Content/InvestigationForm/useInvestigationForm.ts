import Swal from 'sweetalert2';
import theme from 'styles/theme';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {timeout} from 'Utils/Timeout/Timeout';
import { Tab } from 'models/Tab';
import useStyles from './InvestigationFormStyles';
import { defaultTab } from './TabManagement/TabManagement';
import {landingPageRoute} from 'Utils/Routes/Routes';
import { useInvestigationFormOutcome } from './InvestigationFormInterfaces';

const useInvestigationForm = (): useInvestigationFormOutcome => {
    let history = useHistory();
    const [currentTab, setCurrentTab] = useState<Tab>(defaultTab);

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
        });
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
        );
        timeout(1900).then(() => history.push(landingPageRoute));
    };

    return {
        currentTab,
        setCurrentTab,
        confirmFinishInvestigation,
        handleInvestigationFinish
    }
};

export default useInvestigationForm;

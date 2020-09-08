import Swal from 'sweetalert2';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import axios from 'Utils/axios';
import { Tab } from 'models/Tab';
import theme from 'styles/theme';
import TabNames from 'models/enums/TabNames';
import {timeout} from 'Utils/Timeout/Timeout';
import {landingPageRoute} from 'Utils/Routes/Routes';

import useStyles from './InvestigationFormStyles';
import { defaultTab } from './TabManagement/TabManagement';
import {tabs} from './TabManagement/TabManagement';
import { useInvestigationFormOutcome, useInvestigationFormParameters } from './InvestigationFormInterfaces';

const finishInvestigationStatus = 'טופלה';

const useInvestigationForm = (parameters: useInvestigationFormParameters): useInvestigationFormOutcome => {
    let history = useHistory();
    const [currentTab, setCurrentTab] = useState<Tab>(defaultTab);

    const {personalInfoData, setPersonalInfoData} = parameters;

    const classes = useStyles({});

    const confirmFinishInvestigation = (epidemiologyNumber: string) => {
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
                axios.post('/investigationInfo/updateInvestigationStatus', {
                    investigationStatus: finishInvestigationStatus,
                    epidemiologyNumber
                }).then(() => {
                    handleInvestigationFinish();
                }).catch(() => {
                    handleInvestigationFinishFailed();
                })
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

    const handleSwitchTab = () => {
        switch(currentTab.name) {
            case(TabNames.PERSONAL_INFO): {
                savePersonalInfoData()
            }
        }
    }

    const savePersonalInfoData = () => {
        axios.post('/personalDetails/updatePersonalDetails', 
        {
            id : 36, 
            personalInfoData: personalInfoData, 
        })
        .then(() => {
            setCurrentTab(tabs[currentTab.id + 1]);
        });
    }
    const handleInvestigationFinishFailed = () => {
        Swal.fire({
            title: 'לא ניתן היה לסיים את החקירה',
            icon: 'error',
        })
    };

    return {
        currentTab,
        setCurrentTab,
        confirmFinishInvestigation,
        handleInvestigationFinish,
        handleSwitchTab
    }
};

export default useInvestigationForm;

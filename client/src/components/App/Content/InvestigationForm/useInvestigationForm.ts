import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import City from 'models/City';
import axios from 'Utils/axios';
import { Tab } from 'models/Tab';
import theme from 'styles/theme';
import TabNames from 'models/enums/TabNames';
import {timeout} from 'Utils/Timeout/Timeout';
import {landingPageRoute} from 'Utils/Routes/Routes';
import {setCities} from 'redux/City/cityActionCreators';

import useStyles from './InvestigationFormStyles';
import { defaultTab, tabs } from './TabManagement/TabManagement';
import { useInvestigationFormOutcome, useInvestigationFormIncome } from './InvestigationFormInterfaces';

const finishInvestigationStatus = 'טופלה';

const useInvestigationForm = (parameters: useInvestigationFormIncome): useInvestigationFormOutcome => {

    const { clinicalDetailsVariables } = parameters;

    let history = useHistory();
    const [currentTab, setCurrentTab] = useState<Tab>(defaultTab);

    const classes = useStyles({});

    useEffect(()=> {
        axios.get('/addressDetails/cities')
        .then((result: any) => {
            const cities: Map<string, City> = new Map();
            result && result.data && result.data.forEach((city: City) => {
                cities.set(city.id, city)
            });
            setCities(cities);
        })
        .catch(err=> console.log(err));
    }, []);

    const confirmFinishInvestigation = (epidemiologyNumber: number) => {
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

    const handleInvestigationFinishFailed = () => {
        Swal.fire({
            title: 'לא ניתן היה לסיים את החקירה',
            icon: 'error',
        })
    };

    const saveClinicalDetails = (investigatedPatientId: number, epidemioligyNumber: number, creator: string, lastUpdator: string) => {
        const clinicalDetails = ({
            ...clinicalDetailsVariables.clinicalDetailsData,
            'investigatedPatientId': investigatedPatientId,
            'epidemioligyNumber' : epidemioligyNumber,
            'creator' : creator,
            'lastUpdator' : lastUpdator,
        });
        axios.post('/clinicalDetails/saveClinicalDetails', ({clinicalDetails}));
    };

    const handleSwitchTab = (investigatedPatientId: number, epidemioligyNumber: number, creator: string, lastUpdator: string) => {
        switch(currentTab.name) {
            case(TabNames.CLINICAL_DETAILS): {
                saveClinicalDetails(investigatedPatientId, epidemioligyNumber, creator, lastUpdator);
            }
        };

        setCurrentTab(tabs[currentTab.id + 1]);
    };

    return {
        currentTab,
        setCurrentTab,
        confirmFinishInvestigation,
        handleInvestigationFinish,
        handleSwitchTab,
    };
};

export default useInvestigationForm;

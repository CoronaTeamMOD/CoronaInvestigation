import Swal from 'sweetalert2';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import axios from 'Utils/axios';
import theme from 'styles/theme';
import {timeout} from 'Utils/Timeout/Timeout';
import {landingPageRoute} from 'Utils/Routes/Routes';
import InvestigationStatus from 'models/enums/InvestigationStatus';
import { interactedContactsContext } from 'commons/Contexts/InteractedContactsContext';
import { setCantReachInvestigated } from 'redux/Investigation/investigationActionCreators';

import useStyles from './InvestigatedPersonInfoStyles';
import { InvestigatedPersonInfoOutcome, InvestigatedPersonInfoIncome } from './InvestigatedPersonInfoInterfaces';

const useInvestigatedPersonInfo = (): InvestigatedPersonInfoOutcome => {

    let history = useHistory();
    const classes = useStyles({});

    const interactedContactsState = useContext(interactedContactsContext);

    const getInvestigationStatus = (cantReachInvestigated: boolean) => {
        if (cantReachInvestigated) return InvestigationStatus.CANT_REACH;
        return InvestigationStatus.IN_PROCESS;
    }

    const confirmExitUnfinishedInvestigation = (epidemiologyNumber: number, cantReachInvestigated: boolean) => {
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
                axios.post('/investigationInfo/updateInvestigationStatus', {
                    investigationStatus: getInvestigationStatus(cantReachInvestigated),
                    epidemiologyNumber
                }).then(() => {
                    handleInvestigationFinish();
                }).catch(() => {
                    handleUnfinishedInvestigationFailed();
                })
            };
        });
    };

    const handleInvestigationFinish = async () => {
            Swal.fire({
                icon: 'success',
                title: 'בחרת לצאת מהחקירה לפני השלמתה! הנך מועבר לעמוד הנחיתה',
                customClass: {
                    title: classes.swalTitle,
                },
                timer: 1750,
                showConfirmButton: false
            })
            timeout(1900).then(()=> history.push(landingPageRoute));
    };

    const getPersonAge = (birthDate: Date) => {

        const currentDate = new Date();
        let personAge = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDelta = currentDate.getMonth() - birthDate.getMonth();
        if (monthDelta < 0 || (monthDelta === 0 && currentDate.getDate() < birthDate.getDate())) 
        {
            personAge--;
        }
        return String(personAge);
    }

    const handleUnfinishedInvestigationFailed = () => {
        Swal.fire({
            title: 'לא הצלחנו לשמור את השינויים, אנא נסה שוב בעוד כמה דקות',
            icon: 'error',
            customClass: {
                title: classes.swalTitle
            }
        })
    };

    const handleCantReachInvestigatedCheck = (cantReachInvestigated: boolean) => {       
        setCantReachInvestigated(cantReachInvestigated);
    };

    return {
        confirmExitUnfinishedInvestigation,
        handleCantReachInvestigatedCheck,
        getPersonAge
    }
};

export default useInvestigatedPersonInfo;

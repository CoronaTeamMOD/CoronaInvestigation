import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import axios from 'Utils/axios';
import theme from 'styles/theme';
import {timeout} from 'Utils/Timeout/Timeout';
import StoreStateType from 'redux/storeStateType';
import {landingPageRoute} from 'Utils/Routes/Routes';
import { defaultEpidemiologyNumber } from 'Utils/consts';
import { InvestigationStatus } from 'models/InvestigationStatus';
import InvestigationMainStatus from 'models/enums/InvestigationMainStatus';
import { setIsInInvestigation } from 'redux/IsInInvestigations/isInInvestigationActionCreators';
import { setInvestigationStatus, setEpidemiologyNum } from 'redux/Investigation/investigationActionCreators';

import useStyles from './InvestigatedPersonInfoStyles';
import { InvestigatedPersonInfoOutcome } from './InvestigatedPersonInfoInterfaces';

const useInvestigatedPersonInfo = (): InvestigatedPersonInfoOutcome => {

    let history = useHistory();
    const classes = useStyles({});

    const investigationStatus = useSelector<StoreStateType, InvestigationStatus>(state => state.investigation.investigationStatus);

    const confirmExitUnfinishedInvestigation = (epidemiologyNumber: number) => {
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
                const subStatus = investigationStatus.subStatus === '' ? null : investigationStatus.subStatus;
                axios.post('/investigationInfo/updateInvestigationStatus', {
                    investigationMainStatus: investigationStatus.mainStatus,
                    investigationSubStatus: subStatus,
                    epidemiologyNumber: epidemiologyNumber
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
            timeout(1900).then(()=> {
                setIsInInvestigation(false);
                history.push(landingPageRoute)
            });
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
        setInvestigationStatus({
            mainStatus: cantReachInvestigated ? InvestigationMainStatus.CANT_REACH : InvestigationMainStatus.IN_PROCESS,
            subStatus: investigationStatus.subStatus
        })
    };

    const handleCannotCompleteInvestigationCheck = (cannotCompleteInvestigation: boolean) => {      
        setInvestigationStatus({
            mainStatus: cannotCompleteInvestigation ? InvestigationMainStatus.CANT_COMPLETE : InvestigationMainStatus.IN_PROCESS,
            subStatus:  investigationStatus.subStatus
        })
    };

    return {
        confirmExitUnfinishedInvestigation,
        handleCantReachInvestigatedCheck,
        handleCannotCompleteInvestigationCheck,
        getPersonAge
    }
};

export default useInvestigatedPersonInfo;
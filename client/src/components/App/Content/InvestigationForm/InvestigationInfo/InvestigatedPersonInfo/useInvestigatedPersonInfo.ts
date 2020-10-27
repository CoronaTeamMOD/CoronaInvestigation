import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import axios from 'Utils/axios';
import theme from 'styles/theme';
import logger from 'logger/logger';
import {timeout} from 'Utils/Timeout/Timeout';
import StoreStateType from 'redux/storeStateType';
import { Service, Severity } from 'models/Logger';
import InvestigatedPatient from 'models/InvestigatedPatient';
import { InvestigationStatus } from 'models/InvestigationStatus';
import InvestigationMainStatus from 'models/enums/InvestigationMainStatus';
import { setInvestigationStatus } from 'redux/Investigation/investigationActionCreators';
import useComplexitySwal from 'commons/InvestigationComplexity/ComplexityUtils/ComplexitySwal';
import { setIsInInvestigation } from 'redux/IsInInvestigations/isInInvestigationActionCreators';

import useStyles from './InvestigatedPersonInfoStyles';
import { InvestigatedPersonInfoOutcome } from './InvestigatedPersonInfoInterfaces';
import InvestigationComplexityByStatus from 'models/enums/InvestigationComplexityByStatus';

const useInvestigatedPersonInfo = (): InvestigatedPersonInfoOutcome => {

    let history = useHistory();
    const classes = useStyles({});

    const investigationStatus = useSelector<StoreStateType, InvestigationStatus>(state => state.investigation.investigationStatus);
    const investigatedPatient = useSelector<StoreStateType, InvestigatedPatient>(state => state.investigation.investigatedPatient);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const userId = useSelector<StoreStateType, string>(state => state.user.id);

    const { complexityErrorAlert } = useComplexitySwal();

    const updateIsDeceased = () => {
        !investigatedPatient.isDeceased && axios.post('/clinicalDetails/isDeceased/'+investigatedPatient.investigatedPatientId + '/'+true)
        .then((result: any) => {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Update isDeceased',
                step: `launching isDeceased request succssesfully ${result}`,
                user: userId,
                investigation: epidemiologyNumber
            });
            handleInvestigationFinish();
        }).catch((error: any) => {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Update isDeceased',
                step: `launching isDeceased request unsuccssesfully ${error}`,
                user: userId,
                investigation: epidemiologyNumber
            });
            complexityErrorAlert(error);
        })
    }

    const updateIsCurrentlyHospitialized = () => {
        !investigatedPatient.isCurrentlyHospitialized && axios.post('/clinicalDetails/isCurrentlyHospitialized/'+investigatedPatient.investigatedPatientId + '/'+true)
        .then((result: any) => {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Update isCurrentlyHospitialized',
                step: `launching isCurrentlyHospitialized request succssesfully ${result}`,
                user: userId,
                investigation: epidemiologyNumber
            });
            handleInvestigationFinish();
        }).catch((error: any) => {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Update isCurrentlyHospitialized',
                step: `launching isCurrentlyHospitialized request unsuccssesfully ${error}`,
                user: userId,
                investigation: epidemiologyNumber
            });
            complexityErrorAlert(error);
        })
    }

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
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Update Investigation Status',
                    step: `launching investigation status request`,
                    user: userId,
                    investigation: epidemiologyNumber
                });
                const subStatus = investigationStatus.subStatus === '' ? null : investigationStatus.subStatus;
                axios.post('/investigationInfo/updateInvestigationStatus', {
                    investigationMainStatus: investigationStatus.mainStatus,
                    investigationSubStatus: subStatus,
                    epidemiologyNumber: epidemiologyNumber
                }).then(() => {
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Update Investigation Status',
                        step: `update investigation status request was successful`,
                        user: userId,
                        investigation: epidemiologyNumber
                    });
                    investigationStatus.subStatus === InvestigationComplexityByStatus.IS_DECEASED && updateIsDeceased();
                    investigationStatus.subStatus === InvestigationComplexityByStatus.IS_CURRENTLY_HOSPITIALIZED && updateIsCurrentlyHospitialized();
                }).catch((error) => {
                    logger.error({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Update Investigation Status',
                        step: `got errors in server result: ${error}`,
                        user: userId,
                        investigation: epidemiologyNumber
                    });
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
            timeout(1500).then(()=> {
                setIsInInvestigation(false);
                window.close();
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

    const handleCannotCompleteInvestigationCheck = (cannotCompleteInvestigation: boolean) => {      
        setInvestigationStatus({
            mainStatus: cannotCompleteInvestigation ? InvestigationMainStatus.CANT_COMPLETE : InvestigationMainStatus.IN_PROCESS,
            subStatus:  investigationStatus.subStatus
        })
    };

    return {
        confirmExitUnfinishedInvestigation,
        handleCannotCompleteInvestigationCheck,
        getPersonAge,
    }
};

export default useInvestigatedPersonInfo;

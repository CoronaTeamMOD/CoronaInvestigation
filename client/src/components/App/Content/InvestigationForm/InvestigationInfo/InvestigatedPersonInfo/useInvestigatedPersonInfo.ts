import Swal from 'sweetalert2';
import {useSelector} from 'react-redux';

import axios from 'Utils/axios';
import theme from 'styles/theme';
import logger from 'logger/logger';
import userType from 'models/enums/UserType';
import {timeout} from 'Utils/Timeout/Timeout';
import StoreStateType from 'redux/storeStateType';
import {Service, Severity} from 'models/Logger';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import {InvestigationStatus} from 'models/InvestigationStatus';
import InvestigationMainStatus from 'models/enums/InvestigationMainStatus';
import {setInvestigationStatus} from 'redux/Investigation/investigationActionCreators';
import InvestigationComplexityByStatus from 'models/enums/InvestigationComplexityByStatus';
import {setIsInInvestigation} from 'redux/IsInInvestigations/isInInvestigationActionCreators';

import useStyles from './InvestigatedPersonInfoStyles';
import {InvestigatedPersonInfoOutcome} from './InvestigatedPersonInfoInterfaces';

const useInvestigatedPersonInfo = (): InvestigatedPersonInfoOutcome => {

    const classes = useStyles({});

    const {updateIsDeceased, updateIsCurrentlyHospitialized} = useStatusUtils();

    const userId = useSelector<StoreStateType, string>(state => state.user.id);
    const userRole = useSelector<StoreStateType, number>(state => state.user.userType);
    const currInvestigatorId = useSelector<StoreStateType, string>(state => state.investigation.creator);
    const investigationStatus = useSelector<StoreStateType, InvestigationStatus>(state => state.investigation.investigationStatus);
    const transferedSubStatus = 'העברת חקירה';

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
        timeout(1500).then(() => {
            setIsInInvestigation(false);
            window.close();
        });
    };

    const confirmExitUnfinishedInvestigation = (epidemiologyNumber: number) => {
        if(investigationStatus.subStatus === transferedSubStatus && 
            (!investigationStatus.statusReason || investigationStatus.statusReason === '')) {
                Swal.fire({
                    icon: 'warning',
                    title: 'שים לב, כדי לצאת מחקירה יש להזין שדה פירוט',
                    confirmButtonColor: theme.palette.primary.main,
                    confirmButtonText: 'הבנתי, המשך',
                    customClass: {
                        title: classes.swalTitle,
                    }
                })
            }
        else {
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
                    const statusReason = investigationStatus.statusReason === '' ? null : investigationStatus.statusReason;
                    if (shouldUpdateInvestigationStatus()) {
                        axios.post('/investigationInfo/updateInvestigationStatus', {
                            investigationMainStatus: investigationStatus.mainStatus,
                            investigationSubStatus: subStatus,
                            statusReason: statusReason,
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
                    }
                    if (investigationStatus.subStatus === InvestigationComplexityByStatus.IS_DECEASED) {
                        updateIsDeceased(handleInvestigationFinish);
                    } else if (investigationStatus.subStatus === InvestigationComplexityByStatus.IS_CURRENTLY_HOSPITIALIZED) {
                        updateIsCurrentlyHospitialized(handleInvestigationFinish);
                    } else {
                        handleInvestigationFinish();
                    }
                }
                ;
            });
        }
    };

    const getPersonAge = (birthDate: Date) => {

        const currentDate = new Date();
        let personAge = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDelta = currentDate.getMonth() - birthDate.getMonth();
        if (monthDelta < 0 || (monthDelta === 0 && currentDate.getDate() < birthDate.getDate())) {
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
            subStatus: cannotCompleteInvestigation ? investigationStatus.subStatus : null,
            statusReason: cannotCompleteInvestigation ? investigationStatus.statusReason : null,
        })
    };

    const shouldUpdateInvestigationStatus = (investigationInvestigator? : string) => {
        const investigatorTocheck = investigationInvestigator || currInvestigatorId;
        let shouldStatusUpdate = userRole === userType.INVESTIGATOR;
        if (!shouldStatusUpdate) {
            investigationStatus.mainStatus === InvestigationMainStatus.NEW ? 
            shouldStatusUpdate = (userRole !== userType.ADMIN && userRole !== userType.SUPER_ADMIN) || (userId === investigatorTocheck) :
            true;
        }
        return shouldStatusUpdate;
    };

    return {
        confirmExitUnfinishedInvestigation,
        handleCannotCompleteInvestigationCheck,
        getPersonAge,
        shouldUpdateInvestigationStatus
    }
};

export default useInvestigatedPersonInfo;

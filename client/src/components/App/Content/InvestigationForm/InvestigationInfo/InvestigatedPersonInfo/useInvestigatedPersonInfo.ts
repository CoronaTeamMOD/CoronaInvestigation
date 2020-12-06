import { useSelector } from 'react-redux';

import axios from 'Utils/axios';
import theme from 'styles/theme';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import userType from 'models/enums/UserType';
import StoreStateType from 'redux/storeStateType';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import { InvestigationStatus } from 'models/InvestigationStatus';
import  BroadcastMessage, { BC_TABS_NAME }  from 'models/BroadcastMessage';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';
import InvestigationComplexityByStatus from 'models/enums/InvestigationComplexityByStatus';
import { transferredSubStatus } from 'components/App/Content/LandingPage/InvestigationTable/useInvestigationTable';

import { inProcess } from './InvestigatedPersonInfo';
import { InvestigatedPersonInfoOutcome } from './InvestigatedPersonInfoInterfaces';

const useInvestigatedPersonInfo = (): InvestigatedPersonInfoOutcome => {

    const {updateIsDeceased, updateIsCurrentlyHospitialized} = useStatusUtils();
    const { alertSuccess, alertWarning, alertError } = useCustomSwal();

    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);
    const userRole = useSelector<StoreStateType, number>(state => state.user.data.userType);
    const currInvestigatorId = useSelector<StoreStateType, string>(state => state.investigation.creator);
    const investigationStatus = useSelector<StoreStateType, InvestigationStatus>(state => state.investigation.investigationStatus);

    const handleInvestigationFinish = () => {
        alertSuccess('בחרת לצאת מהחקירה לפני השלמתה! הנך מועבר לעמוד הנחיתה', {
            timer: 1750,
            showConfirmButton: false
        }).then(() => {
            const windowTabsBroadcastChannel = new BroadcastChannel(BC_TABS_NAME);
            const closingBroadcastMessage : BroadcastMessage = {
                message: 'Investigation closed',
                isInInvestigation: false
            }
            windowTabsBroadcastChannel.postMessage(closingBroadcastMessage);
            window.close();
        });
    };

    const updateInvestigationStatus = (epidemiologyNumber: number) => {
        const subStatus = investigationStatus.subStatus === '' ? null : investigationStatus.subStatus;
        const statusReason = investigationStatus.statusReason === '' ? null : investigationStatus.statusReason;
        const updateInvestigationStatusLogger = logger.setup({
            workflow: 'Update Investigation Status',
            user: userId,
            investigation: epidemiologyNumber
        });
        if (shouldUpdateInvestigationStatus()) {
            updateInvestigationStatusLogger.info('launching investigation status request', Severity.LOW);
            axios.post('/investigationInfo/updateInvestigationStatus', {
                investigationMainStatus: investigationStatus.mainStatus,
                investigationSubStatus: subStatus !== inProcess ? subStatus : null,
                statusReason: statusReason,
                epidemiologyNumber: epidemiologyNumber
            }).then(() => {
                updateInvestigationStatusLogger.info('update investigation status request was successful', Severity.LOW);
            }).catch((error) => {
                updateInvestigationStatusLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
                alertError('לא הצלחנו לשמור את השינויים, אנא נסה שוב בעוד כמה דקות');
            })
        }
    }

    const confirmExitUnfinishedInvestigation = (epidemiologyNumber: number) => {
        if(investigationStatus.subStatus === transferredSubStatus && !investigationStatus.statusReason) {
            alertWarning('שים לב, כדי לצאת מחקירה יש להזין שדה פירוט' , {
                confirmButtonColor: theme.palette.primary.main,
                confirmButtonText: 'הבנתי, המשך'
            });
        }
        else {
            alertWarning('האם אתה בטוח שתרצה לצאת מהחקירה ולחזור אליה מאוחר יותר?', {
                showCancelButton: true,
                cancelButtonText: 'בטל',
                cancelButtonColor: theme.palette.error.main,
                confirmButtonColor: theme.palette.primary.main,
                confirmButtonText: 'כן, המשך'
            }).then((result) => {
                if (result.value) {
                    updateInvestigationStatus(epidemiologyNumber);
                    if (investigationStatus.subStatus === InvestigationComplexityByStatus.IS_DECEASED) {
                        updateIsDeceased(handleInvestigationFinish);
                    } else if (investigationStatus.subStatus === InvestigationComplexityByStatus.IS_CURRENTLY_HOSPITIALIZED) {
                        updateIsCurrentlyHospitialized(handleInvestigationFinish);
                    } else {
                        handleInvestigationFinish();
                    }
                }
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

    const shouldUpdateInvestigationStatus = (investigationInvestigator? : string) => {
        const investigatorTocheck = investigationInvestigator || currInvestigatorId;
        let shouldStatusUpdate = userRole === userType.INVESTIGATOR;
        if (!shouldStatusUpdate) {
            shouldStatusUpdate = investigationStatus.mainStatus === InvestigationMainStatusCodes.NEW ? 
            (userRole !== userType.ADMIN && userRole !== userType.SUPER_ADMIN) || (userId === investigatorTocheck) :
            true;
        }
        return shouldStatusUpdate;
    };

    return {
        confirmExitUnfinishedInvestigation,
        getPersonAge,
        shouldUpdateInvestigationStatus
    }
};

export default useInvestigatedPersonInfo;

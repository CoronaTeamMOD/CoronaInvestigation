import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

import theme from 'styles/theme';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import { InvestigationStatus } from 'models/InvestigationStatus';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import BroadcastMessage, { BC_TABS_NAME } from 'models/BroadcastMessage';
import { DEFAULT_INVESTIGATION_STATUS } from 'redux/Investigation/investigationReducer';
import InvestigationComplexityByStatus from 'models/enums/InvestigationComplexityByStatus';
import UdpateTrackingRecommendation from 'Utils/TrackingRecommendation/updateTrackingRecommendation';
import { transferredSubStatus } from 'components/App/Content/LandingPage/InvestigationTable/useInvestigationTable';

import { inProcess } from './InvestigatedPersonInfo';
import { InvestigatedPersonInfoIncome, InvestigatedPersonInfoOutcome, StaticFieldsFormInputs } from './InvestigatedPersonInfoInterfaces';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';
import { setInvestigationStaticFieldChange } from 'redux/Investigation/investigationActionCreators';
import investigatorReferenceStatusesReducer from 'redux/investigatorReferenceStatuses/investigatorReferenceStatusesReduces';
import { updateInvestigatorReferenceStatus } from 'httpClient/investigationInfo';
import { setInvestigatorReferenceStatusWasChanged } from 'redux/BotInvestigationInfo/botInvestigationInfoActionCreator';

const useInvestigatedPersonInfo = (parameters: InvestigatedPersonInfoIncome): InvestigatedPersonInfoOutcome => {
    const { moveToTheInvestigationForm } = parameters;

    const { updateIsDeceased, updateIsCurrentlyHospitialized } = useStatusUtils();
    const { alertSuccess, alertWarning, alertError } = useCustomSwal();
    const { updateTrackingReccomentaion } = UdpateTrackingRecommendation();

    const dispatch = useDispatch();

    const investigationStatus = useSelector<StoreStateType, InvestigationStatus>(state => state.investigation.investigationStatus);
    const investigatorReferenceStatusWasChanged = useSelector<StoreStateType, boolean>(state => state.botInvestigationInfo.investigatorReferenceStatusWasChanged);
    const investigationStaticFieldChange = useSelector<StoreStateType, boolean>(state => state.investigation.investigationStaticFieldChange);
    const investigatorReferenceStatusId = useSelector<StoreStateType,number|undefined>(state=>state.botInvestigationInfo.botInvestigationInfo?.investigatorReferenceStatus?.id);

    const handleInvestigationFinish = () => {
        alertSuccess('בחרת לצאת מהחקירה לפני השלמתה! הנך מועבר לעמוד הנחיתה', {
            timer: 1750,
            showConfirmButton: false
        }).then(() => {
            const windowTabsBroadcastChannel = new BroadcastChannel(BC_TABS_NAME);
            const closingBroadcastMessage: BroadcastMessage = {
                message: 'Investigation closed',
                isInInvestigation: false
            }
            windowTabsBroadcastChannel.postMessage(closingBroadcastMessage);
            window.close();
        });
    };

    const updateInvestigationStatus = async (epidemiologyNumber: number) => {
        const subStatus = investigationStatus.subStatus === '' ? null : investigationStatus.subStatus;
        const statusReason = investigationStatus.statusReason === '' ? null : investigationStatus.statusReason;
        const updateInvestigationStatusLogger = logger.setup('Update Investigation Status');
        updateInvestigationStatusLogger.info('launching investigation status request', Severity.LOW);
        const startTime = investigationStatus.mainStatus === InvestigationMainStatusCodes.IN_PROCESS && investigationStatus.previousStatus === InvestigationMainStatusCodes.NEW
            ? new Date()
            : undefined;
        investigationStatus.mainStatus !== DEFAULT_INVESTIGATION_STATUS && await axios.post('/investigationInfo/updateInvestigationStatus', {
            investigationMainStatus: investigationStatus.mainStatus,
            investigationSubStatus: subStatus !== inProcess ? subStatus : null,
            statusReason: statusReason,
            epidemiologyNumber: epidemiologyNumber,
            startTime
        }).then(() => {
            updateInvestigationStatusLogger.info('update investigation status request was successful', Severity.LOW);
        }).catch((error) => {
            updateInvestigationStatusLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
            alertError('לא הצלחנו לשמור את השינויים, אנא נסה שוב בעוד כמה דקות');
        })
    }

    const confirmExitUnfinishedInvestigation = (epidemiologyNumber: number) => {
        if (investigationStatus.subStatus === transferredSubStatus && !investigationStatus.statusReason) {
            alertWarning('שים לב, כדי לצאת מחקירה יש להזין שדה פירוט', {
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
            }).then(async (result) => {
                if (result.value) {
                    await updateTrackingReccomentaion();
                    await updateInvestigationStatus(epidemiologyNumber);
                    if (investigationStatus.subStatus === InvestigationComplexityByStatus.IS_DECEASED) {
                        await updateIsDeceased(handleInvestigationFinish);
                    } else if (investigationStatus.subStatus === InvestigationComplexityByStatus.IS_CURRENTLY_HOSPITIALIZED) {
                        await updateIsCurrentlyHospitialized(handleInvestigationFinish);
                    } else {
                        handleInvestigationFinish();
                    }
                }
            });
        }
    };

    const staticFieldsSubmit = (data: StaticFieldsFormInputs,) => {
        if (investigationStaticFieldChange) {
            const updateStaticFieldsLogger = logger.setup('Updating static info');
            updateStaticFieldsLogger.info('launching the server request', Severity.LOW);
            setIsLoading(true);
            axios.post('/investigationInfo/updateStaticInfo', ({
                data
            }))
                .then(() => {
                    updateStaticFieldsLogger.info('updated static info successfully', Severity.LOW);
                    setIsLoading(false);
                    dispatch(setInvestigationStaticFieldChange(false));
                })
                .catch((error) => {
                    updateStaticFieldsLogger.error(`got error from server: ${error}`, Severity.HIGH);
                    alertError('לא הצלחנו לשמור את השינויים, אנא נסה שוב בעוד מספר דקות');
                    setIsLoading(false);
                })
        }

        if (investigatorReferenceStatusWasChanged && investigatorReferenceStatusId) {
            updateInvestigatorReferenceStatus(investigatorReferenceStatusId as number).then(result=>{
                if (!result) throw 'error';
                dispatch(setInvestigatorReferenceStatusWasChanged(false));
            })
            .catch((error)=>{
                alertError('לא הצלחנו לשמור את השינויים, אנא נסה שוב בעוד מספר דקות');
                setIsLoading(false); 
            });
        }
    };

    const reopenInvestigation = (epidemiologyNumber: number) => {
        const reopenLogger = logger.setup('Reopen Investigation');
        axios.post('/investigationInfo/updateInvestigationStatus', {
            investigationMainStatus: InvestigationMainStatusCodes.IN_PROCESS,
            investigationSubStatus: null,
            statusReason: null,
            epidemiologyNumber
        }).then(() => {
            reopenLogger.info('reopen investigation and update status request was successful', Severity.LOW);
            moveToTheInvestigationForm(epidemiologyNumber);
        })
            .catch((error) => {
                reopenLogger.error(`got errors in server result while reopening investigation: ${error}`, Severity.HIGH);
                alertError('לא ניתן לפתוח את החקירה מחדש');
            })
    }

    return {
        confirmExitUnfinishedInvestigation,
        staticFieldsSubmit,
        reopenInvestigation
    };
};

export default useInvestigatedPersonInfo;
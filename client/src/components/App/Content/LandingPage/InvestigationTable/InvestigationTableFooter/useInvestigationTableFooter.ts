import axios from 'axios';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Desk from 'models/Desk';
import theme from 'styles/theme';
import County from 'models/County';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import ComplexityReason from 'models/ComplexityReason';
import RulesConfigKeys from 'models/enums/RulesConfigKeys';
import { getRulesConfigByKey } from 'httpClient/rulesConfig';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import { setSettingsForStatusValidity } from 'redux/RulesConfig/RulesConfigActionCreator';

import { IndexedInvestigation } from '../InvestigationTablesHeaders';
import { InvestigationTableFooterOutcome, InvestigationTableFooterParameters } from './InvestigationTableFooterInterfaces';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';
import KeyValuePair from 'models/KeyValuePair';

type UpdateCount = {
    updatedCount: number,
    cannotBeUpdatedCount: number,
    errorCount: number
}

const toUniqueIdsAndEpidemiologyNumbers = (
    previous: {
        uniqueGroupIds: string[],
        epidemiologyNumbers: number[]
    }, current: IndexedInvestigation) => {
    if (current.groupId && !previous.uniqueGroupIds.includes(current.groupId as string)) {
        return {
            uniqueGroupIds: [...previous.uniqueGroupIds, current.groupId as string],
            epidemiologyNumbers: previous.epidemiologyNumbers
        }
    } else if (!current.groupId) {
        return {
            uniqueGroupIds: previous.uniqueGroupIds,
            epidemiologyNumbers: [...previous.epidemiologyNumbers, current.epidemiologyNumber as number]
        }
    }

    return previous;
}

const useInvestigationTableFooter = (parameters: InvestigationTableFooterParameters): InvestigationTableFooterOutcome => {

    const { setOpenDesksDialog, setOpenGroupedInvestigations, checkedIndexedRows,
        onDialogClose, fetchTableData, onDeskChange, onDeskGroupChange,
        onCountyChange, onCountyGroupChange } = parameters;

    const dispatch = useDispatch();
    const { alertError, alertWarning, alertSuccess } = useCustomSwal();
    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);
    const [isInvestigatorAllocationFooterDialogOpen, setIsInvestigatorAllocationFooterDialogOpen] = useState<boolean>(false);
    const complexityReasons = useSelector<StoreStateType, (ComplexityReason)[]>(state => state.complexityReasons);
    const settingsForStatusValidity = useSelector<StoreStateType, JSON | undefined>(state => state.rulesConfig.settingsForStatusValidity);

    let cannotBeUpdatedCount = 0;
    let updatedStatusCount = 0;
    let updateStatusErrorCount = 0;


    const handleOpenDesksDialog = () => setOpenDesksDialog(true);

    const handleCloseDesksDialog = () => {
        setOpenDesksDialog(false);
        onDialogClose();
    }

    const handleOpenInvesigatorAllocationFooterDialog = () => setIsInvestigatorAllocationFooterDialogOpen(true);

    const handleCloseInvesigatorAllocationFooterDialog = () => {
        setIsInvestigatorAllocationFooterDialogOpen(false);
        onDialogClose();
    }

    const handleConfirmDesksDialog = async (updatedDesk: Desk, transferReason: KeyValuePair, otherTransferReason:string) => {
        const { uniqueGroupIds, epidemiologyNumbers } =
            checkedIndexedRows.reduce<{
                uniqueGroupIds: string[],
                epidemiologyNumbers: number[]
            }>(toUniqueIdsAndEpidemiologyNumbers, {
                uniqueGroupIds: [],
                epidemiologyNumbers: []
            });
        if (uniqueGroupIds.length) {
            setIsLoading(true);
            await onDeskGroupChange(uniqueGroupIds, updatedDesk, transferReason, otherTransferReason);
        }

        if (epidemiologyNumbers.length) {
            setIsLoading(true);
            await onDeskChange(epidemiologyNumbers, updatedDesk, transferReason, otherTransferReason);
        }

        fetchTableData();
    }

    const handleConfirmCountiesDialog = async (updatedCounty: County, transferReason: KeyValuePair, otherTransferReason:string) => {
        const { uniqueGroupIds, epidemiologyNumbers } =
            checkedIndexedRows.reduce<{
                uniqueGroupIds: string[],
                epidemiologyNumbers: number[]
            }>(toUniqueIdsAndEpidemiologyNumbers, {
                uniqueGroupIds: [],
                epidemiologyNumbers: []
            });
        if (uniqueGroupIds.length) {
            setIsLoading(true);
            await onCountyGroupChange(uniqueGroupIds, updatedCounty, transferReason, otherTransferReason);
        }

        if (epidemiologyNumbers.length) {
            setIsLoading(true);
            await onCountyChange(epidemiologyNumbers, updatedCounty, transferReason, otherTransferReason);
        }

        fetchTableData();
    }

    const handleOpenGroupedInvestigations = () => {
        setOpenGroupedInvestigations(true);
    }

    const handleCloseGroupedInvestigations = () => {
        setOpenGroupedInvestigations(false);
        onDialogClose();
    }

    const handleDisbandGroupedInvestigations = (groupIds: string[]) => {
        alertWarning(`האם אתה בטוח שברצונך לפרק את ${groupIds.length === 1 ? 'הקבוצה' : 'הקבוצות'}?`, {
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך',
        })
            .then((result) => {
                if (result.value) {
                    const groupIdsToDisbandLogger = logger.setupVerbose({
                        workflow: `disband group ids ${groupIds}`,
                        investigation: checkedIndexedRows.map(indexedRow => indexedRow.epidemiologyNumber).join(', '),
                        user: userId
                    });
                    groupIdsToDisbandLogger.info('launching disband group ids request', Severity.LOW);
                    setIsLoading(true);
                    axios.post('/groupedInvestigations/disband', {
                        groupIdsToDisband: groupIds
                    })
                        .then(() => {
                            groupIdsToDisbandLogger.info('group ids was disbanded successfully', Severity.LOW);
                            onDialogClose();
                            fetchTableData();
                        })
                        .catch(err => {
                            groupIdsToDisbandLogger.error(`group ids disbandtation failed due to ${err}`, Severity.HIGH);
                            alertError('לא ניתן היה לפרק קבוצות אלו');
                        })
                        .finally(() => setIsLoading(false));
                }
            })
    }

    const resetUpdateStatusCounts = () => {
        cannotBeUpdatedCount = 0;
        updatedStatusCount = 0;
        updateStatusErrorCount = 0;
    }

    const updateNotInvestigatedStatus = (epidemiologyNumber: number, investigationStatusId: number, totalCount: number, subStatus: string | null) => {
        const reopenLogger = logger.setup('Update Investigation Status');
        setIsLoading(true);
        if (investigationStatusId != InvestigationMainStatusCodes.NEW) {
            cannotBeUpdatedCount++;
            if (cannotBeUpdatedCount == totalCount) {
                alertWarning('לא ניתן לבצע עדכון מרובה לחקירות שאינן בסטטוס חדשה');
                resetUpdateStatusCounts();
                onDialogClose();
                setIsLoading(false);
            }
            return;
        }      
        axios.post('/investigationInfo/updateInvestigationStatus', {
            investigationMainStatus: InvestigationMainStatusCodes.NOT_INVESTIGATED,
            investigationSubStatus: subStatus,
            statusReason: null,
            epidemiologyNumber
        }).then(() => {
            reopenLogger.info('update investigation status request was successful', Severity.LOW);
            updatedStatusCount++;
        })
            .catch((error) => {
                reopenLogger.error(`got errors in server result while updating investigation status: ${error}`, Severity.HIGH);
                updateStatusErrorCount++;
                alertError(`שגיאה בעדכון סטטוס עבור חקירה ${epidemiologyNumber}`);
            })
            .finally(() => {
                const sumUpdatedCount = updatedStatusCount + cannotBeUpdatedCount + updateStatusErrorCount;
                if (sumUpdatedCount == totalCount) {
                    alertSuccess(`עודכן סטטוס של ${updatedStatusCount} מתוך ${totalCount} חקירות שנבחרו`);
                    resetUpdateStatusCounts();
                    fetchTableData();
                    setIsLoading(false);
                }               
                onDialogClose();
            })
    }

    const setSettingsForStatusValidityRuleConfig = () => {
        getRulesConfigByKey(RulesConfigKeys.SETTINGS_FOR_STATUS_VALIDITY).then(data => {
            if (data && data !== undefined && data.value !== undefined) {
                let settingsForStatusValidity = data.value  
                dispatch(setSettingsForStatusValidity(settingsForStatusValidity));
            }
        })
    }

    const updateNotInvestigatedSubStatus = (epidemiologyNumber: number, age: number, complexityReasonsId: (number | null)[], vaccineDoseId: number | null) => {
        const complexityReasonsRules = complexityReasons.filter((reason)=> reason.statusValidity === true).map((reason) => reason.reasonId)
        const isPatientWithComplexity = complexityReasonsId !== null ? complexityReasonsId.includes(complexityReasonsRules[0]) || complexityReasonsId.includes(complexityReasonsRules[1]) || complexityReasonsId.includes(complexityReasonsRules[2]) : false;
        const convertSettingsForStatusValidity: any = settingsForStatusValidity
        const rulesForSettingsForStatusValidity = JSON.parse(convertSettingsForStatusValidity);
        if (!(age >= rulesForSettingsForStatusValidity['from_age'] && age <= rulesForSettingsForStatusValidity['to_age'] ||
            (vaccineDoseId && vaccineDoseId >= rulesForSettingsForStatusValidity['vaccine_num'] ) && 
            age >= rulesForSettingsForStatusValidity['from_age_and_vaccine'] && age <= rulesForSettingsForStatusValidity['to_age_and_vaccine'] || 
            isPatientWithComplexity)) {
                return rulesForSettingsForStatusValidity['another_sub_status']
        }             
        return rulesForSettingsForStatusValidity['sub_status'];
    }

    return {
        handleOpenDesksDialog,
        handleCloseDesksDialog,
        isInvestigatorAllocationFooterDialogOpen,
        handleOpenInvesigatorAllocationFooterDialog,
        handleCloseInvesigatorAllocationFooterDialog,
        handleOpenGroupedInvestigations,
        handleCloseGroupedInvestigations,
        handleConfirmDesksDialog,
        handleConfirmCountiesDialog,
        handleDisbandGroupedInvestigations,
        updateNotInvestigatedStatus,
        updateNotInvestigatedSubStatus,
        setSettingsForStatusValidityRuleConfig
    }
}

export default useInvestigationTableFooter;
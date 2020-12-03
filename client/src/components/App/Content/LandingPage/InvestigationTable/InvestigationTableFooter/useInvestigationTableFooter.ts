import { useSelector } from 'react-redux';

import Desk from 'models/Desk';
import axios from 'axios';
import theme from 'styles/theme';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import InvestigatorOption from 'models/InvestigatorOption';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

import { IndexedInvestigation } from '../InvestigationTablesHeaders';
import { InvestigationTableFooterOutcome, InvestigationTableFooterParameters } from './InvestigationTableFooterInterfaces';

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
        
    const { setOpenDesksDialog, setOpenInvestigatorsDialog, setOpenGroupedInvestigations,
            checkedIndexedRows, onDialogClose, fetchTableData, onDeskChange, onDeskGroupChange, onInvestigatorChange, onInvestigatorGroupChange } = parameters;

    const { alertError, alertWarning } = useCustomSwal();

    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);

    const handleOpenDesksDialog = () => setOpenDesksDialog(true);

    const handleCloseDesksDialog = () => {
        setOpenDesksDialog(false);
        onDialogClose();
    }

    const handleConfirmDesksDialog = async (updatedDesk: Desk, transferReason: string) => {
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
            await onDeskGroupChange(uniqueGroupIds, updatedDesk, transferReason);
        }

        if (epidemiologyNumbers.length) {
            setIsLoading(true);
            await onDeskChange(epidemiologyNumbers, updatedDesk, transferReason);
        }

        handleCloseInvestigatorsDialog();
        fetchTableData();
    }

    const handleOpenInvestigatorsDialog = () => setOpenInvestigatorsDialog(true);

    const handleCloseInvestigatorsDialog = () => {
        setOpenInvestigatorsDialog(false);
        onDialogClose();
    }

    const handleConfirmInvestigatorsDialog = async (updatedIvestigator: InvestigatorOption, transferReason: string) => {
        const { uniqueGroupIds, epidemiologyNumbers } = 
        checkedIndexedRows.reduce<{
            uniqueGroupIds: string[],
            epidemiologyNumbers: number[]        
        }>(toUniqueIdsAndEpidemiologyNumbers, {
            uniqueGroupIds: [],
            epidemiologyNumbers: []
        });
        if(uniqueGroupIds.length) {
            setIsLoading(true);
            await onInvestigatorGroupChange(uniqueGroupIds, updatedIvestigator, transferReason);    
        }

        if(epidemiologyNumbers.length) {
            setIsLoading(true);
            await onInvestigatorChange(epidemiologyNumbers, updatedIvestigator, transferReason);
        }

        handleCloseInvestigatorsDialog();
        fetchTableData();
    }

    const handleOpenGroupedInvestigations = () => setOpenGroupedInvestigations(true);

    const handleCloseGroupedInvestigations = () => {
        setOpenGroupedInvestigations(false);
        onDialogClose();
    }

    const handleDisbandGroupedInvestigations = (groupIds: string[]) => {
        alertWarning(`האם אתה בטוח שברצונך לפרק את ${groupIds.length === 1 ? 'הקבוצה': 'הקבוצות'}?`, {
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

    return {
        handleOpenDesksDialog,
        handleCloseDesksDialog,
        handleOpenInvestigatorsDialog,
        handleCloseInvestigatorsDialog,
        handleOpenGroupedInvestigations,
        handleCloseGroupedInvestigations,
        handleConfirmDesksDialog,
        handleConfirmInvestigatorsDialog,
        handleDisbandGroupedInvestigations
    }
}

export default useInvestigationTableFooter;
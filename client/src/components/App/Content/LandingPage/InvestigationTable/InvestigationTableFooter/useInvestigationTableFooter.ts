import { useSelector } from 'react-redux';

import Desk from 'models/Desk';
import County from 'models/County';

import axios from 'axios';
import theme from 'styles/theme';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
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

    const { setOpenDesksDialog, setOpenGroupedInvestigations, setIsInvestigatorAllocationDialogOpen,
            checkedIndexedRows, onDialogClose, fetchTableData, onDeskChange, onDeskGroupChange,
            onCountyChange, onCountyGroupChange } = parameters;

    const { alertError, alertWarning } = useCustomSwal();

    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);

    const handleOpenDesksDialog = () => setOpenDesksDialog(true);

    const handleCloseDesksDialog = () => {
        setOpenDesksDialog(false);
        onDialogClose();
    }

    const handleOpenInvesigatorAloocationDialog = () => setIsInvestigatorAllocationDialogOpen(true);

    const handleCloseInvesigatorAloocationDialog = () => {
        setIsInvestigatorAllocationDialogOpen(false);
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

        fetchTableData();
    }

    const handleConfirmCountiesDialog = async (updatedCounty: County, transferReason: string) => {
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
            await onCountyGroupChange(uniqueGroupIds, updatedCounty, transferReason);
        }

        if (epidemiologyNumbers.length) {
            setIsLoading(true);
            await onCountyChange(epidemiologyNumbers, updatedCounty, transferReason);
        }

        fetchTableData();
    }

    const handleOpenGroupedInvestigations = () => setOpenGroupedInvestigations(true);

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

    return {
        handleOpenDesksDialog,
        handleCloseDesksDialog,
        handleOpenInvesigatorAloocationDialog,
        handleCloseInvesigatorAloocationDialog,
        handleOpenGroupedInvestigations,
        handleCloseGroupedInvestigations,
        handleConfirmDesksDialog,
        handleConfirmCountiesDialog,
        handleDisbandGroupedInvestigations
    }
}

export default useInvestigationTableFooter;
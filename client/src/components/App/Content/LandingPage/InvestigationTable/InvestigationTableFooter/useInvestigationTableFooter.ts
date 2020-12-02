import { useSelector } from 'react-redux';

import Desk from 'models/Desk';
import axios from 'axios';
import theme from 'styles/theme';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import InvestigatorOption from 'models/InvestigatorOption';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import InvestigationTableRow from 'models/InvestigationTableRow';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

import { InvestigationTableFooterOutcome, InvestigationTableFooterParameters } from './InvestigationTableFooterInterfaces';

const useInvestigationTableFooter = (parameters: InvestigationTableFooterParameters): InvestigationTableFooterOutcome => {
        
    const { setOpenDesksDialog, setOpenInvestigatorsDialog, setOpenGroupedInvestigations,
            checkedRowsIds, tableRows, setTableRows } = parameters;

    const { alertError, alertWarning } = useCustomSwal();

    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);

    const handleOpenDesksDialog = () => setOpenDesksDialog(true);

    const handleCloseDesksDialog = () => setOpenDesksDialog(false);

    const updateRows = (transferReason: string, newValueFieldName: keyof InvestigationTableRow, newValue: any) => {
        const updatedRows : InvestigationTableRow[] = tableRows.map(row => 
            checkedRowsIds.includes(row.epidemiologyNumber) ? 
            {...row, 
                [newValueFieldName]: newValue, 
                transferReason
            } 
            : row);
        setTableRows(updatedRows);
    }

    const handleConfirmDesksDialog = (updatedDesk: Desk, transferReason: string) => {
        const switchDeskLogger = logger.setup({
            workflow: 'Switch desk',
            investigation: checkedRowsIds.join(', '),
            user: userId
        });
        setIsLoading(true);
        axios.post('/landingPage/changeDesk', {
            epidemiologyNumbers: checkedRowsIds,
            updatedDesk: updatedDesk.id,
            transferReason
        }).then(() => {
            switchDeskLogger.info('the desk have been switched successfully', Severity.LOW);
            updateRows(transferReason, 'investigationDesk', updatedDesk.deskName);
            handleCloseDesksDialog();
        })
        .catch(error => {
            switchDeskLogger.error(`the investigator swap failed due to: ${error}`, Severity.HIGH);
            handleCloseDesksDialog();
            alertError('לא ניתן היה לבצע את ההעברה לדסק');
        })
        .finally(() => setIsLoading(false));
    }

    const handleOpenInvestigatorsDialog = () => setOpenInvestigatorsDialog(true);

    const handleCloseInvestigatorsDialog = () => setOpenInvestigatorsDialog(false);

    const handleConfirmInvestigatorsDialog = (updatedIvestigator: InvestigatorOption, transferReason: string) => {
        const changeInvestigatorLogger = logger.setup({
            workflow: 'Switch investigator',
            investigation: checkedRowsIds.join(', '),
            user: userId
        });
        setIsLoading(true);
        axios.post('/users/changeInvestigator', {
            epidemiologyNumbers: checkedRowsIds,
            user: updatedIvestigator.id,
            transferReason
        }).then(() => {
            changeInvestigatorLogger.info('the investigator have been switched successfully', Severity.LOW);
            updateRows(transferReason, 'investigator', updatedIvestigator.value);
            handleCloseInvestigatorsDialog();
        })
        .catch(error => {
            changeInvestigatorLogger.error(`the investigator swap failed due to: ${error}`, Severity.HIGH);
            handleCloseInvestigatorsDialog();
            alertError('לא ניתן היה לבצע את ההעברה לחוקר');
        })
        .finally(() => setIsLoading(false));
    }

    const handleOpenGroupedInvestigations = () => setOpenGroupedInvestigations(true);

    const handleCloseGroupedInvestigations = () => setOpenGroupedInvestigations(false);

    const handleDisbandGroupedInvestigations = (groupIds: string[]) => {
        alertWarning('האם אתה בטוח שברצונך לפרק את הקבוצה כולה?', {
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך',
        })
        .then((result) => {
            if (result.value) {
                const groupIdsToDisbandLogger = logger.setup({
                    workflow: `disband group ids ${groupIds}`,
                    investigation: checkedRowsIds.join(', '),
                    user: userId
                });
                groupIdsToDisbandLogger.info('launching disband group ids request', Severity.LOW);
                setIsLoading(true);
                axios.post('/groupedInvestigations/disband', {
                    groupIdsToDisband: groupIds
                })
                .then(result => {
                    groupIdsToDisbandLogger.info('group ids was disbanded successfully', Severity.LOW);
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
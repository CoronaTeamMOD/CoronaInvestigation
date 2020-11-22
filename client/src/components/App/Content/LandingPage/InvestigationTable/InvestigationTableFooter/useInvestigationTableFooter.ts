import { useSelector } from 'react-redux';

import Desk from 'models/Desk';
import axios from 'Utils/axios';
import logger from 'logger/logger';
import { Service, Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import InvestigatorOption from 'models/InvestigatorOption';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import InvestigationTableRow from 'models/InvestigationTableRow';

import { InvestigationTableFooterOutcome, InvestigationTableFooterParameters } from './InvestigationTableFooterInterfaces';

const useInvestigationTableFooter = (parameters: InvestigationTableFooterParameters): InvestigationTableFooterOutcome => {
        
    const { setOpenDesksDialog, setOpenInvestigatorsDialog, checkedRowsIds, tableRows, setTableRows } = parameters;

    const { alertError } = useCustomSwal();

    const userId = useSelector<StoreStateType, string>(state => state.user.id);

    const handleOpenDesksDialog = () => setOpenDesksDialog(true);

    const handleCloseDesksDialog = () => setOpenDesksDialog(false);

    const updateRows = (transferReason: string, newValueFieldName: keyof InvestigationTableRow, newValue: any) => {
        const updatedRows : InvestigationTableRow[] = tableRows.map(row => 
            checkedRowsIds.includes(row.epidemiologyNumber) ? 
            {...row, 
                wasInvestigationTransferred: true, 
                [newValueFieldName]: newValue, 
                transferReason
            } 
            : row);
        setTableRows(updatedRows);
    }

    const handleConfirmDesksDialog = (updatedDesk: Desk, transferReason: string) => {
        axios.post('/landingPage/changeDesk', {
            epidemiologyNumbers: checkedRowsIds,
            updatedDesk: updatedDesk.id,
            transferReason
        }).then(() => {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Switch desk',
                step: 'the desk have been switched successfully',
                investigation: checkedRowsIds.join(', '),
                user: userId
            })
            updateRows(transferReason, 'investigationDesk', updatedDesk.deskName);
            handleCloseDesksDialog();
        })
        .catch(error => {
            logger.error({
                service: Service.CLIENT,
                severity: Severity.HIGH,
                workflow: 'Switch desk',
                step: `the investigator swap failed due to: ${error}`,
                investigation: checkedRowsIds.join(', '),
                user: userId
            })
            handleCloseDesksDialog();
            alertError('לא ניתן היה לבצע את ההעברה לדסק');
        })
    }

    const handleOpenInvestigatorsDialog = () => setOpenInvestigatorsDialog(true);

    const handleCloseInvestigatorsDialog = () => setOpenInvestigatorsDialog(false);

    const handleConfirmInvestigatorsDialog = (updatedIvestigator: InvestigatorOption, transferReason: string) => {
        axios.post('/users/changeInvestigator', {
            epidemiologyNumbers: checkedRowsIds,
            user: updatedIvestigator.id,
            transferReason
        }).then(() => {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Switch investigator',
                step: 'the investigator have been switched successfully',
                investigation: checkedRowsIds.join(', '),
                user: userId
            })
            updateRows(transferReason, 'investigator', updatedIvestigator.value);
            handleCloseInvestigatorsDialog();
        })
        .catch(error => {
            logger.error({
                service: Service.CLIENT,
                severity: Severity.HIGH,
                workflow: 'Switch investigator',
                step: `the investigator swap failed due to: ${error}`,
                investigation: checkedRowsIds.join(', '),
                user: userId
            })
            handleCloseInvestigatorsDialog();
            alertError('לא ניתן היה לבצע את ההעברה לחוקר');
        })
    }

    return {
        handleOpenDesksDialog,
        handleCloseDesksDialog,
        handleOpenInvestigatorsDialog,
        handleCloseInvestigatorsDialog,
        handleConfirmDesksDialog,
        handleConfirmInvestigatorsDialog
    }
}

export default useInvestigationTableFooter;
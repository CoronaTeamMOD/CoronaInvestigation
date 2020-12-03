import axios from 'axios';
import { useSelector } from 'react-redux';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

const useSettingsActions = ({ fetchTableData, setAnchorEl }: useSettingsActionsIncome ): useSettingsActionsOutcome => {

    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);

    const { alertError } = useCustomSwal();

    const excludeInvestigationFromGroup = (epidemiologyNumber: number) => {
        const excludeInvestigationFromGroupLogger = logger.setup({
            workflow: `exclude investigation ${epidemiologyNumber} from group`,
            user: userId,
            investigation: epidemiologyNumber
        });
        excludeInvestigationFromGroupLogger.info('launching exclude investigation request', Severity.LOW);
        setIsLoading(true);
        axios.post('/groupedInvestigations/exclude', { investigationToExclude: epidemiologyNumber })
        .then(() => {
            excludeInvestigationFromGroupLogger.info('investigation was excluded from group successfully', Severity.LOW);
            setAnchorEl(null);
            fetchTableData();
        })
        .catch(err => {
            excludeInvestigationFromGroupLogger.error(`investigation was failed to excluded from group due to ${err}`, Severity.HIGH);
            alertError('לא ניתן היה להוציא קבוצה זו מחקירה');
        })
        .finally(() => setIsLoading(false))
    }

    return {
        excludeInvestigationFromGroup
    }
}

interface useSettingsActionsIncome {
    fetchTableData: () => void;
    setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

interface useSettingsActionsOutcome {
    excludeInvestigationFromGroup: (epidemiologyNumber: number) => void;
}

export default useSettingsActions;
import axios from 'axios';
import { useSelector } from 'react-redux';

import theme from 'styles/theme';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import InvestigationTableRow from 'models/InvestigationTableRow';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

const useSettingsActions = (props: useSettingsActionsIncome ): useSettingsActionsOutcome => {

    const { allGroupedInvestigations, setAnchorEl, fetchTableData, fetchInvestigationsByGroupId} = props;

    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);

    const { alertError, alertWarning } = useCustomSwal();

    const excludeInvestigationFromGroup = (epidemiologyNumber: number, groupId: string) => {
        const investigationsLeftInTheGroup = allGroupedInvestigations.get(groupId)?.length;
        if (investigationsLeftInTheGroup && investigationsLeftInTheGroup <= 2) {
            alertWarning('שים לב נותרו 2 חקירות בקבוצה ולכן הקבוצה תתפרק. האם אתה בטוך שברצונך להמשיך?', {
                showCancelButton: true,
                cancelButtonText: 'בטל',
                cancelButtonColor: theme.palette.error.main,
                confirmButtonColor: theme.palette.primary.main,
                confirmButtonText: 'כן, המשך',
            })
            .then(result => {
                if (result.value) {
                    const groupIdsToDisbandLogger = logger.setupVerbose({
                        workflow: `disband group ids ${groupId}`,
                        user: userId
                    });
                    groupIdsToDisbandLogger.info('launching disband group ids request', Severity.LOW);
                    setIsLoading(true);
                    axios.post('/groupedInvestigations/disband', {
                        groupIdsToDisband: [groupId]
                    })
                    .then(() => {
                        groupIdsToDisbandLogger.info('group ids was disbanded successfully', Severity.LOW);
                        fetchTableData();
                    })
                    .catch(err => {
                        groupIdsToDisbandLogger.error(`group ids disbandtation failed due to ${err}`, Severity.HIGH);
                        alertError('לא ניתן היה לפרק קבוצות אלו');
                    })
                    .finally(() => setIsLoading(false)); 
                }
            })
        } else {
            alertWarning('האם אתה בטוח שתרצה להוציא חקירה זו מהקבוצה?', {
                showCancelButton: true,
                cancelButtonText: 'בטל',
                cancelButtonColor: theme.palette.error.main,
                confirmButtonColor: theme.palette.primary.main,
                confirmButtonText: 'כן, המשך',
            })
            .then(result => {
                if (result.value) {
                    const excludeInvestigationFromGroupLogger = logger.setupVerbose({
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
                        fetchInvestigationsByGroupId(groupId);
                        fetchTableData();
                    })
                    .catch(err => {
                        excludeInvestigationFromGroupLogger.error(`investigation was failed to excluded from group due to ${err}`, Severity.HIGH);
                        alertError('לא ניתן היה להוציא קבוצה זו מחקירה');
                    })
                    .finally(() => setIsLoading(false))
                }
            })
        }
    }

    return {
        excludeInvestigationFromGroup
    }
}

interface useSettingsActionsIncome {
    allGroupedInvestigations: Map<string, InvestigationTableRow[]>;
    setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    fetchTableData: () => void;
    fetchInvestigationsByGroupId: (groupId: string) => void;
}

interface useSettingsActionsOutcome {
    excludeInvestigationFromGroup: (epidemiologyNumber: number, groupId: string) => void;
}

export default useSettingsActions;
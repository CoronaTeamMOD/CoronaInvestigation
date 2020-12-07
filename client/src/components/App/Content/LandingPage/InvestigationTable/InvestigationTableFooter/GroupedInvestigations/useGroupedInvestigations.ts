import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';

import logger from 'logger/logger'
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal'
import InvestigationTableRow from 'models/InvestigationTableRow';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

import { Reason } from './GroupedInvestigationsForm/useGroupedInvestigationsForm';

export interface GroupForm {
    reason: Reason | null;
    otherReason: string;
}

const useGroupedInvestigations = ({ invetigationsToGroup, onClose, fetchTableData }: useGroupedInvestigationsIncome): useGroupedInvestigationsOutcome => {

    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const { alertError } = useCustomSwal();

    const onSubmit = (data: GroupForm) => {
        const invetigationsToGroupIds = invetigationsToGroup.map((invetigationToGroup: InvestigationTableRow) => invetigationToGroup.epidemiologyNumber);
        const groupIds = invetigationsToGroup.map((invetigationToGroup: InvestigationTableRow) => invetigationToGroup.groupId);
        const trimedGroupidIds = Array.from(new Set(groupIds));
        if (trimedGroupidIds.length === 2 && trimedGroupidIds.findIndex((groupId: string) => groupId === null) > -1) {
            const group = trimedGroupidIds.find((groupId: string) => groupId !== null);
            const groupToUpdateLogger = logger.setup({
                workflow: 'update grouped investigations',
                user: userId,
                investigation: epidemiologyNumber
            });
            groupToUpdateLogger.info('launching grouped investigations request', Severity.LOW);
            setIsLoading(true);
            axios.post('/groupedInvestigations', { group, invetigationsToGroupIds })
                .then(() => {
                    onClose();
                    groupToUpdateLogger.info('update grouped investigations successfully', Severity.LOW);
                })
                .catch((err) => {
                    groupToUpdateLogger.error(`update grouped investigations was failde due to${err}`, Severity.HIGH);
                    alertError('לא ניתן היה לקבץ חקירות אלו');
                })
                .finally(() => setIsLoading(false))
        } else {
            const groupId = uuidv4();
            const group = {
                id: groupId,
                reason: data.reason?.id,
                otherReason: data.otherReason
            };
            const groupToCreateLogger = logger.setup({
                workflow: 'create grouped investigations',
                user: userId,
                investigation: epidemiologyNumber
            });
            groupToCreateLogger.info('launching grouped investigations request', Severity.LOW);
            setIsLoading(true);
            axios.post('/groupedInvestigations', { group, invetigationsToGroupIds })
                .then(() => {
                    onClose();
                    groupToCreateLogger.info('create grouped investigations successfully', Severity.LOW);
                })
                .catch((err) => {
                    groupToCreateLogger.error(`create grouped investigations was failde due to${err}`, Severity.HIGH);
                    alertError('לא ניתן היה לקבץ חקירות אלו');
                })
                .finally(() => setIsLoading(false))
        }
    }

    return {
        onSubmit
    }
}

interface useGroupedInvestigationsIncome {
    invetigationsToGroup: InvestigationTableRow[];
    onClose: () => void;
    fetchTableData: () => void;
}

interface useGroupedInvestigationsOutcome {
    onSubmit: (data: GroupForm) => void;
}

export default useGroupedInvestigations;
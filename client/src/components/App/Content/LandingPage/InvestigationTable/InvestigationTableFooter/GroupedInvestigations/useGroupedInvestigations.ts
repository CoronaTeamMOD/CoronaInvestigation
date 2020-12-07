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

export const checkedGroupsLimitIncludingNull = 2;
export const toUniqueGroupsWithNonGroupedInvestigations =
    (previous: { uniqueGroupIds: string[]; epidemiologyNumbers: number[]; }, current: InvestigationTableRow) => {
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
        } else {
            return {
                uniqueGroupIds: previous.uniqueGroupIds,
                epidemiologyNumbers: previous.epidemiologyNumbers
            }
        }
    }

const useGroupedInvestigations = ({ invetigationsToGroup, onClose, fetchTableData }: useGroupedInvestigationsIncome): useGroupedInvestigationsOutcome => {

    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const { alertError } = useCustomSwal();

    const onSubmit = (data: GroupForm) => {
        const trimmedGroup = invetigationsToGroup.reduce<{
            uniqueGroupIds: string[],
            epidemiologyNumbers: number[]
        }>(toUniqueGroupsWithNonGroupedInvestigations, {
            uniqueGroupIds: [],
            epidemiologyNumbers: []
        })
        if (trimmedGroup.uniqueGroupIds.length === 1
            && trimmedGroup.epidemiologyNumbers.length > 0) {
            const group = trimmedGroup.uniqueGroupIds[0];
            const invetigationsToGroup = trimmedGroup.epidemiologyNumbers
            const groupToUpdateLogger = logger.setup({
                workflow: 'update grouped investigations',
                user: userId,
                investigation: epidemiologyNumber
            });
            groupToUpdateLogger.info('launching grouped investigations request', Severity.LOW);
            setIsLoading(true);
            axios.post('/groupedInvestigations', { group, invetigationsToGroup })
                .then(() => {
                    groupToUpdateLogger.info('update grouped investigations successfully', Severity.LOW);
                    onClose();
                    fetchTableData();
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
            const invetigationsToGroup = trimmedGroup.epidemiologyNumbers
            const groupToCreateLogger = logger.setup({
                workflow: 'create grouped investigations',
                user: userId,
                investigation: epidemiologyNumber
            });
            groupToCreateLogger.info('launching grouped investigations request', Severity.LOW);
            setIsLoading(true);
            axios.post('/groupedInvestigations', { group, invetigationsToGroup })
                .then(() => {
                    groupToCreateLogger.info('create grouped investigations successfully', Severity.LOW);
                    onClose();
                    fetchTableData();
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
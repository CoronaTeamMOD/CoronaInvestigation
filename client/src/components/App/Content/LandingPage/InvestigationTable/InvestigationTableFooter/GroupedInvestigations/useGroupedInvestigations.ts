import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import logger from 'logger/logger'
import { Severity } from 'models/Logger';
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

const useGroupedInvestigations = ({ investigationsToGroup, onClose, fetchTableData, fetchInvestigationsByGroupId }: useGroupedInvestigationsIncome): useGroupedInvestigationsOutcome => {
    const { alertError } = useCustomSwal();

    const onSubmit = (data: GroupForm) => {
        const trimmedGroup = investigationsToGroup.reduce<{
            uniqueGroupIds: string[],
            epidemiologyNumbers: number[]
        }>(toUniqueGroupsWithNonGroupedInvestigations, {
            uniqueGroupIds: [],
            epidemiologyNumbers: []
        })
        // Check whether there is one grouped investigation and at least one investigation without a group 
        if (trimmedGroup.uniqueGroupIds.length === 1 && trimmedGroup.epidemiologyNumbers.length > 0) {
            const group = trimmedGroup.uniqueGroupIds[0];
            const investigationsToGroup = trimmedGroup.epidemiologyNumbers
            const groupToUpdateLogger = logger.setup('update grouped investigations');
            groupToUpdateLogger.info('launching grouped investigations request', Severity.LOW);
            setIsLoading(true);
            axios.post('/groupedInvestigations', { group, investigationsToGroup })
                .then(() => {
                    groupToUpdateLogger.info('update grouped investigations successfully', Severity.LOW);
                    onClose();
                    fetchInvestigationsByGroupId(group);
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
            const investigationsToGroup = trimmedGroup.epidemiologyNumbers
            const groupToCreateLogger = logger.setup('create grouped investigations');
            groupToCreateLogger.info('launching grouped investigations request', Severity.LOW);
            setIsLoading(true);
            axios.post('/groupedInvestigations', { group, investigationsToGroup })
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
    investigationsToGroup: InvestigationTableRow[];
    onClose: () => void;
    fetchTableData: () => void;
    fetchInvestigationsByGroupId: (groupId: string) => void;
}

interface useGroupedInvestigationsOutcome {
    onSubmit: (data: GroupForm) => void;
}

export default useGroupedInvestigations;

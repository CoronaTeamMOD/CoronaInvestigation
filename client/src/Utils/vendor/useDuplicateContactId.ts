import { useSelector } from 'react-redux';

import StoreStateType from 'redux/storeStateType';
import logger from 'logger/logger';
import { Service, Severity } from 'models/Logger';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

export const duplicateIdsErrorMsg = 'found duplicate ids';

export interface IdToCheck {
    id?: string;
    serialId?: number 
}

const useDuplicateContactId = () => {
    
    const { alertWarning } = useCustomSwal();
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const userId = useSelector<StoreStateType, string>(state => state.user.id);

    const checkDuplicateIds = (idsToCheck: string[]) => {
        const trimmedIds: string[] = idsToCheck.filter((id: string) => id !== null && id !== '');
        const duplicateIds: string[] = trimmedIds.filter((id: string, index: number) => trimmedIds.indexOf(id) !== index);
        if (duplicateIds.length > 0) {
            handleDuplicateIdsError(duplicateIds);
            return true;
        } else {
            return false;
        }
    }

    const checkDuplicateIdsForInteractions = (idsToCheck: IdToCheck[]) => {
        const trimmedIds = idsToCheck.filter((id: IdToCheck) => id.id !== undefined && id.id !== null && id.id !== '');
        const duplicateIds = trimmedIds.filter((id, index: number) => 
            trimmedIds.findIndex((IdToCheck) => IdToCheck.id === id.id && IdToCheck.serialId !== id.serialId) !== -1);
        const distinctDuplicateIds = duplicateIds.filter((id1, index) => duplicateIds.findIndex(id2 => id1.id === id2.id) === index)
        if (distinctDuplicateIds.length > 0) {
            handleDuplicateIdsError(distinctDuplicateIds.map(id => id.id));
            return true;
        } else {
            return false;
        }
    }

    const handleDuplicateIdsError = (duplicateIds: (string | undefined)[]) => {
        logger.error({
            service: Service.CLIENT,
            severity: Severity.MEDIUM,
            workflow: 'Create/Update contacts',
            step: 'Didnt save contacts due to duplicate ids',
            user: userId,
            investigation: epidemiologyNumber
        });
        const errorText = duplicateIds?.length > 1 ?
            `שים לב, מספרי זיהוי ${duplicateIds?.join(',')} כבר קיימים בחקירה! אנא בצע את השינויים הנדרשים` :
            `שים לב, מספר זיהוי ${duplicateIds} כבר קיים בחקירה! אנא בצע את השינויים הנדרשים`
        alertWarning(errorText);
    }

    return {
        checkDuplicateIds,
        handleDuplicateIdsError,
        checkDuplicateIdsForInteractions
    }
};

export default useDuplicateContactId;
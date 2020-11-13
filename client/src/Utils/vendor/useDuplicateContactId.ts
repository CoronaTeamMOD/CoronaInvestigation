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
        const trimmedIds: string[] = idsToCheck.filter((id: string) => id);
        const duplicateIds: string[] = trimmedIds.filter((id: string, index: number) => trimmedIds.indexOf(id) !== index);
        const distinctDuplicateIds = duplicateIds.filter((id1, index) => duplicateIds.findIndex(id2 => id1 === id2) === index)
        if (distinctDuplicateIds.length > 0) {
            handleDuplicateIdsError(distinctDuplicateIds);
            return true;
        } else {
            return false;
        }
    }

    // This function does the same as the function above, but it also check the serialId
    // It prevent from alerting when I tried to edit the same interaction with the same id - 
    // It will treat it as the same id and not as two different ids
    const checkDuplicateIdsForInteractions = (idsToCheck: IdToCheck[]) => {
        const trimmedIds = idsToCheck.filter((id: IdToCheck) => id.id);
        const duplicateIds = trimmedIds.filter((id, index: number) => 
            trimmedIds.findIndex((IdToCheck) => IdToCheck.id === id.id && IdToCheck.serialId !== id.serialId) !== -1);
        if (duplicateIds.length > 0) {
            handleDuplicateIdsError(Array.from(new Set(duplicateIds.map(id => id.id))));
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
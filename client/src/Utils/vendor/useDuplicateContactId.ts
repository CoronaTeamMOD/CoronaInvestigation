import { useSelector } from 'react-redux';

import StoreStateType from 'redux/storeStateType';
import logger from 'logger/logger';
import { Service, Severity } from 'models/Logger';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

export const duplicateIdsErrorMsg = 'found duplicate ids';

const useDuplicateContactId = () => {
    
    const { alertWarning } = useCustomSwal();
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const userId = useSelector<StoreStateType, string>(state => state.user.id);

    const checkDuplicateIds = (idsToCheck: string[]) => {
        const trimmedIds: string[] = idsToCheck.filter((id: string) => id !== null && id !== '');
        const duplicateIds: string[] = trimmedIds.filter((id: string, index: number) => trimmedIds.indexOf(id) !== index);
        if (duplicateIds.length > 0) {
            handleDuplicateIdsError(duplicateIds[0]);
            return true;
        } else {
            return false;
        }
    }

    const handleDuplicateIdsError = (duplicateId: string) => {
        logger.error({
            service: Service.CLIENT,
            severity: Severity.MEDIUM,
            workflow: 'Create/Update contacts',
            step: 'Didnt save contacts due to duplicate ids',
            user: userId,
            investigation: epidemiologyNumber
        });
        alertWarning(`שים לב, מספרי זיהוי ${duplicateId} כבר קיימים בחקירה! אנא בצע את השינויים הנדרשים`);
    }

    return {
        checkDuplicateIds,
        handleDuplicateIdsError,
    }
};

export default useDuplicateContactId;
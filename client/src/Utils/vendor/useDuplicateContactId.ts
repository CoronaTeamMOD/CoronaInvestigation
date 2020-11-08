import logger from 'logger/logger';
import { Service, Severity } from 'models/Logger';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

export const duplicateIdsErrorMsg = 'found duplicate ids';

const useDuplicateContactId = () => {
    
    const {alertWarning} = useCustomSwal();

    const handleDuplicateIdsError = (duplicateIdentificationNumber: string, userId: string, epidemiologyNumber: number) => {
        logger.error({
            service: Service.CLIENT,
            severity: Severity.MEDIUM,
            workflow: 'Create/Update contacts',
            step: 'Didnt save contacts due to duplicate ids',
            user: userId,
            investigation: epidemiologyNumber
        });
        alertWarning(`שים לב, מספר זיהוי ${duplicateIdentificationNumber} כבר קיים בחקירה! אנא בצע את השינויים הנדרשים`);
    }

    return {
        handleDuplicateIdsError,
    }
};

export default useDuplicateContactId;
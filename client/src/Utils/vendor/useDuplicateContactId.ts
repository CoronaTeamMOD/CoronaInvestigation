import { format } from 'date-fns';
import { useSelector } from 'react-redux';

import logger from 'logger/logger';
import Contact from 'models/Contact';
import StoreStateType from 'redux/storeStateType';
import { Severity } from 'models/Logger';
import InteractedContact from 'models/InteractedContact';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

export interface IdToCheck {
    id?: string;
    serialId?: number 
}

type ContactId = string | undefined;

const displayDateFormat = 'dd/MM/yyyy';

const useDuplicateContactId = () => {
    
    const { alertWarning } = useCustomSwal();
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);

    const findDuplicateIds = (idsToCheck: ContactId[]) => {
        const trimmedIds: ContactId[] = idsToCheck.filter(id => id);
        return trimmedIds.filter((id: ContactId, index: number) => trimmedIds.indexOf(id) !== index);
    }

    const checkExcelDuplicateKeys = (excelContacts: InteractedContact[], exisistingContacts: Contact[]) => {
        const exisistingContactsIds : ContactId[]  =  exisistingContacts.map(contact => contact.idNumber);
        const excelContactsIds : ContactId[]  =  excelContacts.map(contact => contact.identificationNumber);
        
        const allContacts : ContactId[] = exisistingContactsIds.concat(excelContactsIds);

        const duplicateIds = findDuplicateIds(allContacts);
        if (duplicateIds.length > 0) {
            const invalidContacts = exisistingContacts.filter(contact => duplicateIds.includes(contact.idNumber));
            if (invalidContacts.length > 0) {
                handleExcelDuplicateIdsError(invalidContacts);
            } else {
                handleDuplicateIdsError(duplicateIds);
            }

            return true;
        }

        return false;
    }

    const handleExcelDuplicateIdsError = (duplicateIdsContacts: Contact[]) => {
        const loadContactsLogger = logger.setup({
            workflow: 'Load contacts from excel',
            user: userId,
            investigation: epidemiologyNumber
        })
        loadContactsLogger.error('Didnt load contacts due to duplicate ids', Severity.MEDIUM);
        const errorText = "לא ניתן לטעון את האקסל כי מספרי הזיהוי הבאים כבר קיימים בחקירה \r\n" + 
            duplicateIdsContacts.map(contact => 
                `${format(new Date(contact.startTime as Date), displayDateFormat)}: ${contact.idNumber}`).join("\r\n");
        alertWarning(errorText);
    }

    const checkDuplicateIds = (idsToCheck: string[]) => {
        const duplicateIds = findDuplicateIds(idsToCheck);
        if (duplicateIds.length > 0) {
            handleDuplicateIdsError(Array.from(new Set(duplicateIds.map(id => id))));
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
        const newIds: string[] = trimmedIds.filter((id: IdToCheck) => !id.serialId).map((id) => id.id as string);
        const duplicateIds = trimmedIds.filter((id: IdToCheck) => 
            trimmedIds.findIndex((IdToCheck) => (IdToCheck.id === id.id) && (IdToCheck.serialId !== id.serialId)) !== -1);
        if (duplicateIds.length > 0) {
            handleDuplicateIdsError(Array.from(new Set(duplicateIds.map(id => id.id))));
            return true;
        } else {
            return checkDuplicateIds(newIds);
        }
    }

    const handleDuplicateIdsError = (duplicateIds: (string | undefined)[]) => {
        const duplicateIdsLogger = logger.setup({
            workflow: 'Create/Update contacts',
            user: userId,
            investigation: epidemiologyNumber
        })
        duplicateIdsLogger.error('Didnt save contacts due to duplicate ids', Severity.MEDIUM);
        const errorText = duplicateIds?.length > 1 ?
            `שים לב, מספרי זיהוי ${duplicateIds?.join(', ')} כבר קיימים בחקירה! אנא בצע את השינויים הנדרשים` :
            `שים לב, מספר זיהוי ${duplicateIds} כבר קיים בחקירה! אנא בצע את השינויים הנדרשים`
        alertWarning(errorText);
    }

    return {
        checkDuplicateIds,
        handleDuplicateIdsError,
        checkDuplicateIdsForInteractions,
        checkExcelDuplicateKeys
    }
};

export default useDuplicateContactId;
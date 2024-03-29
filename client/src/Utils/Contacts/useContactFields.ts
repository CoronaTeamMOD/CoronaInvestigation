import React from 'react';

import Contact from 'models/Contact';
import ContactType from 'models/enums/ContactType';
import InteractedContact from 'models/InteractedContact';
import ContactStatusCodes from 'models/enums/ContactStatusCodes';
import InteractedContactFields from 'models/enums/InteractedContact';
import IdentificationTypesCodes from 'models/enums/IdentificationTypesCodes';
import { ContactedPersonFieldMapper } from 'models/enums/contactQuestioningExcelFields';
import { get, isIdValid, isOtherIdValid, isPalestineIdValid } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

export const STRICT_CONTACT_TYPE = 1;
const isolationErrorMessageEnd = ' ולכן לא ניתן להקים דיווח בידוד';

interface validValidation {
    valid: true;
}

interface invalidValidation {
    valid: false;
    error: string;
}

export enum ValidationReason {
    HANDLE_ISOLATION,
    SAVE_CONTACT,
    EXCEL_LOADING
}

const COMPLETE_CONTACT_QUESTIONING_STATUS = 'הושלם התחקור';

const mandatoryQuarantineFields = [
    InteractedContactFields.IDENTIFICATION_NUMBER,
    InteractedContactFields.IDENTIFICATION_TYPE,
    `${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_CITY}`,
    InteractedContactFields.PHONE_NUMBER,
    InteractedContactFields.FIRST_NAME,
    InteractedContactFields.LAST_NAME];

const getIdValidation = (idType: number) => {
    switch (idType) {
        case IdentificationTypesCodes.ID:
            return { validation: isIdValid, fieldName: 'ת"ז' };
        case IdentificationTypesCodes.PASSPORT:
            return { validation: isOtherIdValid, fieldName: 'דרכון' };
        case IdentificationTypesCodes.PALESTINE_ID:
            return { validation: isPalestineIdValid, fieldName: 'ת"ז פלסטינית' };
        case IdentificationTypesCodes.OTHER || IdentificationTypesCodes.MOSSAD:
            return { validation: isOtherIdValid, fieldName: 'מזהה' };
        default:
            break;
    }
};

const useContactFields = (contactStatus?: InteractedContact['contactStatus']) => {

    const shouldDisable = (status?: InteractedContact['contactStatus']) => status === ContactStatusCodes.COMPLETED || status === ContactStatusCodes.QUESTIONING_IS_NOT_NEEDED;

    const isFieldDisabled = React.useMemo(() => shouldDisable(contactStatus), [contactStatus]);

    const getDisabledFields = (contacts: Contact[]) => {
        return contacts.filter((contact) => shouldDisable(contact.contactStatus));
    };

    const checkIsLooseContact = (contactType: number | string) => typeof contactType === 'number'
        ? contactType !== STRICT_CONTACT_TYPE
        : contactType !== ContactType.TIGHT;

    const validateContact = (contact: InteractedContact, validationReason: ValidationReason): validValidation | invalidValidation => {
        const contactIdType = contact.identificationType ? contact.identificationType : 0;
        const contactIdNumber = contact.identificationNumber;
        const idValidation = getIdValidation(contactIdType as number);

        if (idValidation?.validation) {
            if (!idValidation.validation(contactIdNumber)) {
                return { valid: false, error: `שדה ${idValidation.fieldName} אינו תקין` };
            }
        };
        if (!contact.doesNeedIsolation && contact.doesNeedIsolation!==null) {
            if (contact.contactType === ContactType.TIGHT) {
                return { valid: false, error: 'המגע סומן כהדוק אך לא הוקם לו בידוד' };
            }
            return { valid: true };
        } else {
            const emptyFieldNames = mandatoryQuarantineFields.filter(mandatoryField =>
                !Boolean(get(contact, mandatoryField))
            );
            const isLooseContact = checkIsLooseContact(contact.contactType);

            const isStatusCompleted = contact.contactStatus === COMPLETE_CONTACT_QUESTIONING_STATUS;

            if ((validationReason === ValidationReason.EXCEL_LOADING && isStatusCompleted) ||
                emptyFieldNames.length > 0 || isLooseContact)
                return { valid: false, error: generateErrorMessage(emptyFieldNames, isLooseContact, validationReason, isStatusCompleted) };
            else return { valid: true };
        }
    };

    const buildInvalidFieldsString = (emptyFields: string[], isLooseContact: boolean): string => {
        let message = '';
        if (emptyFields.length > 0) {
            const fieldWord = `לא מילאת את ${emptyFields.length > 1 ? 'שדות ' : 'שדה '}`;
            const emptyFieldProblem = emptyFields.map(fieldName => get(ContactedPersonFieldMapper, fieldName));
            message = fieldWord.concat(emptyFieldProblem.join(', '));
            if (isLooseContact) message = message.concat(' ו')
        }
        if (isLooseContact) {
            const looseContactErrorMessage = 'סוג המגע הוא לא הדוק';
            message = message.concat(looseContactErrorMessage);
        }
        return message;
    }

    const generateErrorMessage = (emptyFields: string[], isLooseContact: boolean,
        validationReason: ValidationReason, isStatusCompleted: boolean) => {
        let message = 'שים לב, ';
        const invalidFieldsString = buildInvalidFieldsString(emptyFields, isLooseContact);
        switch (validationReason) {
            case ValidationReason.HANDLE_ISOLATION:
                return message.concat(invalidFieldsString).concat(isolationErrorMessageEnd);
            case ValidationReason.SAVE_CONTACT:
                return invalidFieldsString;
            case ValidationReason.EXCEL_LOADING: {
                message = message.concat(invalidFieldsString);
                if (isStatusCompleted) {
                    const statusCompleted = 'לא ניתן לטעון מגע בסטטוס הושלם התחקור';
                    message = message.concat(statusCompleted);
                }
                return message.concat(isolationErrorMessageEnd);
            }
        }
    };

    return {
        isFieldDisabled,
        getDisabledFields,
        shouldDisable,
        validateContact,
        checkIsLooseContact
    }
};

export default useContactFields;
import React from 'react';
import InteractedContact from 'models/InteractedContact';
import Contact from 'models/Contact';
import InteractedContactFields from 'models/enums/InteractedContact';
import {ContactedPersonFieldMapper} from 'models/enums/contactQuestioningExcelFields';
import ContactType from 'models/enums/ContactType';

export const COMPLETE_STATUS = 5;
export const STRICT_CONTACT_TYPE = 1;

interface validValidation {
    valid:true;
}

interface invalidValidation {
    valid:false;
    error: string;
}

const useContactFields = (contactStatus?: InteractedContact['contactStatus']) => {
    const shouldDisable = (status?: InteractedContact['contactStatus']) => status === COMPLETE_STATUS;

    const isFieldDisabled = React.useMemo(() => shouldDisable(contactStatus), [contactStatus]);

    const getDisabledFields = (contacts: Contact[]) => {
        return contacts.filter((contact) => shouldDisable(contact.contactStatus));
    };

    const checkIsLooseContact = (contactType: number | string) =>  typeof contactType === "number"
        ? contactType !== STRICT_CONTACT_TYPE
        : contactType !== ContactType.TIGHT;

    const mandatoryQuarantineFields = [InteractedContactFields.IDENTIFICATION_NUMBER, InteractedContactFields.IDENTIFICATION_TYPE,
        InteractedContactFields.CONTACTED_PERSON_CITY, InteractedContactFields.PHONE_NUMBER, InteractedContactFields.FIRST_NAME,
        InteractedContactFields.LAST_NAME];

    const validateContact = (contact: InteractedContact, isIsolationCheck: boolean): validValidation | invalidValidation => {
        if(!contact.doesNeedIsolation) {
            return {valid: true};
        } else {
            const emptyFieldNames = mandatoryQuarantineFields.filter(mandatoryField =>
                !Boolean(contact[mandatoryField as keyof InteractedContact])
            );
            const isLooseContact = checkIsLooseContact(contact.contactType);

            if (emptyFieldNames.length > 0 || isLooseContact)
                return {valid: false, error: generateErrorMessage(emptyFieldNames, isLooseContact, isIsolationCheck)};
            else return {valid: true};
        }
    };

    const buildEmptyFieldsString = (emptyFields: string[], isLooseContact: boolean) : string => {
        let message = '';
        if(emptyFields.length > 0) {
            const fieldWord = `לא מילאת את ${emptyFields.length > 1 ? 'שדות ' : 'שדה '}`;
            const emptyFieldProblem = emptyFields.map(fieldName => ContactedPersonFieldMapper[fieldName as keyof typeof ContactedPersonFieldMapper]);
            message = fieldWord.concat(emptyFieldProblem.join(', '));
            if(isLooseContact) message = message.concat(' ו')
        }

        if(isLooseContact) {
            const looseContactErrorMessage = 'סוג המגע הוא לא הדוק';
            message = message.concat(looseContactErrorMessage);
        }

        return message;
    }

    const generateErrorMessage = (emptyFields: string[], isLooseContact: boolean, isIsolationCheck: boolean) => {
        let message = 'שים לב, ';
        const emptyFieldsString = buildEmptyFieldsString(emptyFields, isLooseContact);

        if(!isIsolationCheck) return emptyFieldsString;

        return message.concat(emptyFieldsString).concat(' ולכן לא ניתן להקים דיווח בידוד');
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
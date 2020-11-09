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

    const mandatoryFields = [InteractedContactFields.IDENTIFICATION_NUMBER, InteractedContactFields.IDENTIFICATION_TYPE,
        InteractedContactFields.CONTACTED_PERSON_CITY, InteractedContactFields.PHONE_NUMBER, InteractedContactFields.FIRST_NAME,
        InteractedContactFields.LAST_NAME];

    const validateContact = (contact:  any): validValidation | invalidValidation => {
        const emptyFieldNames = mandatoryFields.filter(mandatoryField => !Boolean(contact[mandatoryField as keyof Contact]));
        const isLooseContact = typeof contact.contactType === "number"
            ? contact.contactType !== STRICT_CONTACT_TYPE
            : contact.contactType !== ContactType.TIGHT;

        if (emptyFieldNames.length > 0 || isLooseContact)
            return {valid: false, error: generateErrorMessage(emptyFieldNames, isLooseContact)};
        else return {valid: true};
    };

    const generateErrorMessage = (emptyFields: string[], isLooseContact: boolean) => {
        let message = 'שים לב, ';

        if(emptyFields.length > 0) {
            const fieldWord = `לא מילאת את ${emptyFields.length > 1 ? 'שדות ' : 'שדה '}`;
            const emptyFieldProblem = emptyFields.map(fieldName => ContactedPersonFieldMapper[fieldName as keyof typeof ContactedPersonFieldMapper]);
            message = message.concat(fieldWord.concat(emptyFieldProblem.join(', ')));
            if(isLooseContact)
                message = message.concat(' ו')
        }

        if(isLooseContact) {
            const looseContactErrorMessage = 'סוג המגע הוא לא הדוק';
            message = message.concat(looseContactErrorMessage);
        }

        return message.concat(' ולכן לא ניתן להקים דיווח בידוד');
    };

    return {
        isFieldDisabled,
        getDisabledFields,
        shouldDisable,
        validateContact
    }
};

export default useContactFields;
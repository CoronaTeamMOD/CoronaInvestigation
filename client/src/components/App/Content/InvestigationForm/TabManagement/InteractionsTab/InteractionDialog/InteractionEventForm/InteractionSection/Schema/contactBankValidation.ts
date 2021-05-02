import React from 'react'

const validationName = 'checkContactBank';
const validationErrorMessage = 'מגע זה קיים כבר בבנק מגעים';

const contactBankValidation = (eventIds: (string | undefined)[]) => {
    const checkExistingContact = (id : any) => {
        return eventIds.indexOf(id) === -1;
    };

    return {
        name: validationName,
        errorMsg: validationErrorMessage,
        testingFunction: checkExistingContact
    }
};

export default contactBankValidation;

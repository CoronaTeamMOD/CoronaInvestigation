import * as yup from 'yup';

import IdentificationTypesCodes from 'models/enums/IdentificationTypesCodes';
import InteractionEventContactFields from 'models/enums/InteractionsEventDialogContext/InteractionEventContactFields';
import { isIdValid , isPassportValid, isPalestineIdValid, isOtherIdValid } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import { invalidIdText, invalidOtherIdText, invalidPalestineIdText, invalidPassportText, requiredText } from 'commons/Schema/messages';

const ContactIdValidationSchema = (test?: TestParam) => yup.string()
    .when(InteractionEventContactFields.IDENTIFICATION_TYPE, (identificationType: number) => {
        let schema = yup.string().required(requiredText).nullable();
        
        if(test) { 
            schema = schema.test(test.name,test.errorMsg,test.testingFunction);
        };

        switch (identificationType) {
            case IdentificationTypesCodes.ID:
                schema = schema.test('isValid', invalidIdText, (id) => isIdValid(id))
                break;
            case IdentificationTypesCodes.PASSPORT:
                schema = schema.test('isValid', invalidPassportText, (id) => isPassportValid(id));
                break;
            case IdentificationTypesCodes.PALESTINE_ID:
                schema = schema.test('isValid', invalidPalestineIdText, (id) => isPalestineIdValid(id));
                break;
            default:
                schema = schema.test('isValid', invalidOtherIdText, (id) => isOtherIdValid(id));
                break;
        }

        return schema;
    });

interface TestParam {
    name : string;
    errorMsg : string;
    testingFunction: (param : any) => boolean
};

export default ContactIdValidationSchema;
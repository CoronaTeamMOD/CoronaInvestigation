import * as yup from 'yup';

import IdentificationTypesCodes from 'models/enums/IdentificationTypesCodes';
import InteractionEventContactFields from 'models/enums/InteractionsEventDialogContext/InteractionEventContactFields';
import { invalidIdText, invalidOtherIdText, invalidPalestineIdText, invalidPassportText } from 'commons/Schema/messages';
import { isIdValid , isPassportValid, isPalestineIdValid, isOtherIdValid } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

const ContactIdValidationSchema = (test?: any) => yup.string()
    .when(InteractionEventContactFields.IDENTIFICATION_TYPE, (identificationType: number) => {
        switch (identificationType) {
            case IdentificationTypesCodes.ID:
                return yup.string()
                    .nullable()
                    .test('isValid', invalidIdText, (id) => isIdValid(id))
                    .test('istest' , 'aaa', (id) => { console.log(id); return true});
            case IdentificationTypesCodes.PASSPORT:
                return yup.string()
                    .nullable()
                    .test('isValid', invalidPassportText, (id) => isPassportValid(id));
            case IdentificationTypesCodes.PALESTINE_ID:
                return yup.string()
                    .nullable()
                    .test('isValid', invalidPalestineIdText, (id) => isPalestineIdValid(id));
            default:
                return yup.string()
                    .nullable()
                    .test('isValid', invalidOtherIdText, (id) => isOtherIdValid(id));
        }
    })

export default ContactIdValidationSchema;
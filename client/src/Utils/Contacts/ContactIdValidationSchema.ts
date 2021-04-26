import * as yup from 'yup';

import IdentificationTypesCodes from 'models/enums/IdentificationTypesCodes';
import InteractionEventContactFields from 'models/enums/InteractionsEventDialogContext/InteractionEventContactFields';
import { invalidIdText, invalidOtherIdText, invalidPalestineIdText, invalidPassportText } from 'commons/Schema/messages';
import { isIdValid , isPassportValid, isPalestineIdValid, isOtherIdValid } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

const ContactIdValidationSchema = yup.string()
    .when(InteractionEventContactFields.IDENTIFICATION_TYPE, {
        is: IdentificationTypesCodes.ID,
        then: yup.string()
            .nullable()
            .test('isValid', invalidIdText, (id) => isIdValid(id)),
        otherwise:
            yup.string().when(InteractionEventContactFields.IDENTIFICATION_TYPE, {
            is: IdentificationTypesCodes.PASSPORT,
            then: yup.string()
                .nullable()
                .test('isValid', invalidPassportText, (id) => isPassportValid(id)),
            otherwise:
                yup.string().when(InteractionEventContactFields.IDENTIFICATION_TYPE, {
                is: IdentificationTypesCodes.PALESTINE_ID,
                then: yup.string()
                    .nullable()
                    .test('isValid', invalidPalestineIdText, (id) => isPalestineIdValid(id)),
                otherwise:
                    yup.string()
                    .nullable()
                    .test('isValid', invalidOtherIdText, (id) => isOtherIdValid(id)),
            })
        })
    });

export default ContactIdValidationSchema;
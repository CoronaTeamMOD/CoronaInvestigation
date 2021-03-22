import * as yup from 'yup';

import { ID_BASIC_VALIDATION_REGEX } from 'commons/Regex/Regex';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import InteractionEventContactFields from 'models/enums/InteractionsEventDialogContext/InteractionEventContactFields';
import { isIdValid , isPassportValid, idLength } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import { invalidIdText, invalidPassportText } from 'commons/Schema/messages';

const ContactIdValidationSchema = yup
  .string()
  .when(InteractionEventContactFields.IDENTIFICATION_TYPE, {
      is: IdentificationTypes.PASSPORT,
      then: yup
        .string()
        .nullable()
        .test('isValid', invalidPassportText, (id) => isPassportValid(id)),
      otherwise:
        yup
        .string()
        .nullable()
        .matches(ID_BASIC_VALIDATION_REGEX, 'ת.ז חייבת להכיל ספרות בלבד')
        .length(idLength, `ת.ז מכילה ${idLength} ספרות בלבד`)
        .test('isValid', invalidIdText, (id) => isIdValid(id)),
    });

export default ContactIdValidationSchema;
import * as yup from 'yup';

import IdentificationTypes from 'models/enums/IdentificationTypes';
import InteractionEventContactFields from 'models/enums/InteractionsEventDialogContext/InteractionEventContactFields';
import { isIdValid , isPassportValid, idLength, passportMaxIdentificationLength, idBasicValidation } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

const ContactIdValidationSchema = yup
  .string()
  .when(InteractionEventContactFields.IDENTIFICATION_TYPE, {
      is: IdentificationTypes.PASSPORT,
      then: yup
        .string()
        .nullable()
        .matches(idBasicValidation, 'דרכון חייב להכיל ספרות בלבד')
        .max(passportMaxIdentificationLength, `דרכון מכיל ${passportMaxIdentificationLength} ספרות בלבד`)
        .test('isValid', 'דרכון לא תקין', (id) => isPassportValid(id)),
      otherwise:
        yup
        .string()
        .nullable()
        .matches(idBasicValidation, 'ת.ז חייבת להכיל ספרות בלבד')
        .length(idLength, `ת.ז מכילה ${idLength} ספרות בלבד`)
        .test('isValid', 'ת.ז לא תקינה', (id) => isIdValid(id)),
    });

export default ContactIdValidationSchema;
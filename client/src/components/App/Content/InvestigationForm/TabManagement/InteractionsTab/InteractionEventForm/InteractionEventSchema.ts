import * as yup from 'yup';

import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import InteractionEventContactFields from 'models/enums/InteractionsEventDialogContext/InteractionEventContactFields';

const phoneNumberMatchValidation = /^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))|^$/;

const interactionEventSchema = yup.object().shape({
    [InteractionEventDialogFields.PLACE_TYPE]: yup.string().nullable().required('סוג אתר חובה'),
    [InteractionEventDialogFields.PLACE_SUB_TYPE]: yup.number().when(
      InteractionEventDialogFields.PLACE_TYPE, {
        is: placeType => placeType !== placeTypesCodesHierarchy.geriatric.code &&
                         placeType !== placeTypesCodesHierarchy.office.code,
        then: yup.number().required('תת סוג אתר חובה'),
        otherwise: yup.number().nullable()
      }
    ),
    [InteractionEventDialogFields.CONTACT_PERSON_PHONE_NUMBER]: yup.string().nullable()
      .matches(phoneNumberMatchValidation, 'מספר טלפון לא תקין'),
    [InteractionEventDialogFields.START_TIME]: yup.date().required()
      .max(yup.ref(InteractionEventDialogFields.END_TIME), 'שעה מ לא יכולה להיות גדולה משעה עד'),
    [InteractionEventDialogFields.END_TIME]: yup.date().required()
      .min(yup.ref(InteractionEventDialogFields.START_TIME), 
      'שעה עד לא יכולה להיות קטנה משעה מ'),
    [InteractionEventDialogFields.EXTERNALIZATION_APPROVAL]: yup.boolean().required('שדה חובה'),
    [InteractionEventDialogFields.CONTACTS]: yup.array().of(yup.object().shape({
        [InteractionEventContactFields.FIRST_NAME]: yup.string().nullable().required('שם פרטי חובה'),
        [InteractionEventContactFields.LAST_NAME]: yup.string().nullable().required('שם משפחה חובה'),
        [InteractionEventContactFields.PHONE_NUMBER]: yup.string().nullable()
          .matches(phoneNumberMatchValidation, 'מספר טלפון לא תקין'),
          [InteractionEventContactFields.ID]: yup.string().nullable()
            .matches(/^\d+|^$/, 'ת.ז חייבת להכיל מספרים בלבד')
            .length(9, 'ת.ז מכילה 9 מספרים בלבד')
            .test('isValid', "ת.ז לא תקינה", (id: string | null | undefined) => {
              let sum = 0;
              if (id?.length === 9) {
                Array.from(id)?.forEach((digit: string, index: number) => {
                  let digitMul = parseInt(digit) * ((index % 2) + 1);
                  if (digitMul > 9) {
                    digitMul -= 9;
                  }
                  sum += digitMul;
                })
              }
              return sum % 10 === 0;
          })
      })),
    });

export default interactionEventSchema;

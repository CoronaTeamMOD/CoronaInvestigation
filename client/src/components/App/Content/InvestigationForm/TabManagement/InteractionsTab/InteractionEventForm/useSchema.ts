import * as yup from "yup";

import placeTypesCodesHierarchy from "Utils/placeTypesCodesHierarchy";

import InteractionEventDialogFields from '../InteractionsEventDialogContext/InteractionEventDialogFields';
import InteractionEventContactFields from '../InteractionsEventDialogContext/InteractionEventContactFields';

const useSchema = () => {        

    const schema = yup.object().shape({
        [InteractionEventDialogFields.PLACE_TYPE]: yup.string().required('סוג אתר חובה'),
        [InteractionEventDialogFields.PLACE_SUB_TYPE]: yup.number().when(
          InteractionEventDialogFields.PLACE_TYPE, {
            is: placeType => placeType !== placeTypesCodesHierarchy.geriatric.code ||
                             placeType !== placeTypesCodesHierarchy.office.code,
            then: yup.number().required('תת סוג אתר חובה'),
            otherwise: yup.number().nullable()
          }
        ),
        [InteractionEventDialogFields.CONTACT_PERSON_PHONE_NUMBER]: yup.string()
          .matches(/^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$/, 'מספר טלפון לא תקין'),
        [InteractionEventDialogFields.START_TIME]: yup.date().required(),
        [InteractionEventDialogFields.END_TIME]: yup.date().required().when(
          [InteractionEventDialogFields.START_TIME], (startTime: Date) => {
            return yup.date().min(startTime, 'שעה עד לא יכולה להיות קטנה משעה מ');
        }),
        [InteractionEventDialogFields.EXTERNALIZATION_APPROVAL]: yup.boolean().required('שדה חובה'),
        [InteractionEventDialogFields.CONTACTS]: yup.array().of(yup.object().shape({
            [InteractionEventContactFields.FIRST_NAME]: yup.string().required('שם פרטי חובה'),
            [InteractionEventContactFields.LAST_NAME]: yup.string().required('שם משפחה חובה'),
            [InteractionEventContactFields.PHONE_NUMBER]: yup.string().required('מספר טלפון חובה')
              .matches(/^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$/, 'מספר טלפון לא תקין'),
            [InteractionEventContactFields.ID]: yup.string().matches(/^\d+$/, 'תעודת זהות חייבת להכיל מספרים בלבד')
              .length(9, 'תעודת זהות חייבת להכיל 9 מספרים')
              .test('isValid', "תעודת זהות לא תקינה", (id: any) => {
                let sum = 0;
                for (let i=0; i<9; i++) {
                let digitMul = parseInt(id[i]) * ((i % 2) + 1);
                if (digitMul > 9) {
                  digitMul -= 9;
                }
                sum += digitMul;
              }
              return sum % 10 === 0 ? true : false;
            })
        })),
        });

    return {
        schema
    }
};

export default useSchema; 
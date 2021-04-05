import * as yup from 'yup';

import { invalidPhoneText, requiredText } from 'commons/Schema/messages';
import { NOT_REQUIRED_PHONE_NUMBER_REGEX } from 'commons/Regex/Regex';
import ContactIdValidationSchema from 'Utils/Contacts/ContactIdValidationSchema';
import placeTypesCodesHierarchy from 'Utils/ContactEvent/placeTypesCodesHierarchy';
import InteractionEventContactFields from 'models/enums/InteractionsEventDialogContext/InteractionEventContactFields';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';

const interactionEventSchema = yup.object().shape({
    [InteractionEventDialogFields.PLACE_TYPE]: yup.string().nullable().required('סוג אתר חובה'),
    [InteractionEventDialogFields.PLACE_SUB_TYPE]: yup.number().when(
      InteractionEventDialogFields.PLACE_TYPE, {
        is: placeType => placeType !== placeTypesCodesHierarchy.geriatric.code &&
        placeType !== placeTypesCodesHierarchy.office.code,
        then: yup.number().nullable().required('תת סוג אתר חובה'),
        otherwise: yup.number().nullable()
      }
    ),
    [InteractionEventDialogFields.CONTACT_PERSON_PHONE_NUMBER]: yup.string().nullable()
      .matches(NOT_REQUIRED_PHONE_NUMBER_REGEX, invalidPhoneText),
    [InteractionEventDialogFields.UNKNOWN_TIME]: yup.boolean(),
    [InteractionEventDialogFields.START_TIME]: yup.date().nullable().when(
      InteractionEventDialogFields.UNKNOWN_TIME, {
        is: unknownTime => !unknownTime,
        then: yup.date().required()
              .max(yup.ref(InteractionEventDialogFields.END_TIME), 'שעת התחלה חייבת להיות לפני שעת הסיום'),
        else: yup.date().nullable()
      }
    ),
    [InteractionEventDialogFields.END_TIME]: yup.date().nullable().when(
      InteractionEventDialogFields.UNKNOWN_TIME, {
        is: unknownTime => !unknownTime,
        then: yup.date().required()
              .min(yup.ref(InteractionEventDialogFields.START_TIME), 
              'שעת הסיום חייבת להיות אחרי שעת ההתחלה'),
        else: yup.date().nullable()
      }
    ),
    [InteractionEventDialogFields.EXTERNALIZATION_APPROVAL]: yup.boolean().when(
      [InteractionEventDialogFields.PLACE_TYPE, InteractionEventDialogFields.UNKNOWN_TIME,
       InteractionEventDialogFields.LOCATION_ADDRESS, InteractionEventDialogFields.PLACE_NAME,
       InteractionEventDialogFields.PLACE_DESCRIPTION], {
        is: (placeType, isUnknownTime, locationAddress, placeName, placeDescription) => {
          if (placeType === placeTypesCodesHierarchy.privateHouse.code ||
              isUnknownTime || (placeType !== placeTypesCodesHierarchy.transportation.code
                && !(locationAddress && (placeName || placeDescription)))) {
                return false;
          } else {
            return true;
          }
        },
        then: yup.boolean().required(requiredText),
        otherwise: yup.boolean().nullable()
       }
    ),
    [InteractionEventDialogFields.CONTACTS]: yup.array().of(yup.object().shape({
        [InteractionEventContactFields.FIRST_NAME]: yup.string().nullable().required('שם פרטי חובה'),
        [InteractionEventContactFields.LAST_NAME]: yup.string().nullable().required('שם משפחה חובה'),
        [InteractionEventContactFields.PHONE_NUMBER]: yup.string().nullable()
          .matches(NOT_REQUIRED_PHONE_NUMBER_REGEX, invalidPhoneText),
        [InteractionEventContactFields.IDENTIFICATION_NUMBER]: ContactIdValidationSchema
    }))
  });

export default interactionEventSchema;
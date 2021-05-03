import * as yup from 'yup';

import { invalidPhoneText, requiredText } from 'commons/Schema/messages';
import { NOT_REQUIRED_PHONE_NUMBER_REGEX } from 'commons/Regex/Regex';
import ContactIdValidationSchema from 'Utils/Contacts/ContactIdValidationSchema';
import placeTypesCodesHierarchy from 'Utils/ContactEvent/placeTypesCodesHierarchy';
import InteractionEventContactFields from 'models/enums/InteractionsEventDialogContext/InteractionEventContactFields';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';

import contactBankValidation from './contactBankValidation';

const interactionEventSchema = (eventIds : (string | undefined)[]) => yup.object().shape({
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
        [InteractionEventContactFields.FIRST_NAME]: yup.string().nullable().required(requiredText),
        [InteractionEventContactFields.LAST_NAME]: yup.string().nullable().required(requiredText),
        [InteractionEventContactFields.PHONE_NUMBER]: yup.string().nullable()
          .matches(NOT_REQUIRED_PHONE_NUMBER_REGEX, invalidPhoneText),
        [InteractionEventContactFields.IDENTIFICATION_TYPE]: yup.number().when(
          [InteractionEventContactFields.IDENTIFICATION_NUMBER], (identificationNumber: string | null) => {
            return (typeof identificationNumber === 'undefined') 
              ? yup.number().nullable() 
              : yup.number().required(requiredText).nullable()
          }
        ),
        [InteractionEventContactFields.IDENTIFICATION_NUMBER]: yup.string().when(
          [InteractionEventContactFields.IDENTIFICATION_TYPE], (identificationType: number | null) => {
            return identificationType === null 
            ? yup.string().nullable()
            : ContactIdValidationSchema(contactBankValidation(eventIds))
          }
        ),
        },[[InteractionEventContactFields.IDENTIFICATION_TYPE, InteractionEventContactFields.IDENTIFICATION_NUMBER]]))
  });

export default interactionEventSchema;
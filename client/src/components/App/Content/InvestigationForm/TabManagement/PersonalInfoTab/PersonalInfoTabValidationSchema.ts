import * as yup from 'yup';

import Occupations from 'models/enums/Occupations';
import { requiredText } from 'commons/Schema/messages';
import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';
import { PHONE_NUMBER_REGEX, NOT_REQUIRED_PHONE_NUMBER_REGEX } from 'commons/Regex/Regex';

const occupationsWithInstitution = ['מערכת הבריאות', 'מערכת החינוך', 'כוחות הביטחון'];
const occupationsWithoutExtraInfo = ['מערכת הבריאות', 'מערכת החינוך', 'כוחות הביטחון', 'לא עובד'];
const numberValidationText = 'שגיאה: מספר אינו תקין';
const maxClassNumberError = 'ניתן להזין עד המספר 50';

const schema = yup.object().shape({
    [PersonalInfoDataContextFields.PHONE_NUMBER]: yup.string().nullable().required(requiredText).matches(PHONE_NUMBER_REGEX, numberValidationText),
    [PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER]: yup.string().nullable().matches(NOT_REQUIRED_PHONE_NUMBER_REGEX, numberValidationText),
    [PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER]: yup.string().nullable().matches(NOT_REQUIRED_PHONE_NUMBER_REGEX, numberValidationText),
    [PersonalInfoDataContextFields.INSURANCE_COMPANY]: yup.string().nullable().required(requiredText),
    address: yup.object().shape({
        [PersonalInfoDataContextFields.CITY]: yup.string().nullable().required(requiredText),
    }),
    [PersonalInfoDataContextFields.CONTACT_INFO]: yup.string().nullable(),
    [PersonalInfoDataContextFields.RELEVANT_OCCUPATION]: yup.string().nullable().required(requiredText),
    [PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY]: yup.string().when(
        PersonalInfoDataContextFields.RELEVANT_OCCUPATION, 
        {
            is: 'מערכת החינוך',
            then: yup.string().nullable().required(requiredText),
            else: yup.string().nullable()
        }
    ),
    [PersonalInfoDataContextFields.INSTITUTION_NAME]: yup.string().when('relevantOccupation', (relevantOccupation: any, schema: any) => {
        return occupationsWithInstitution.find(element => element === relevantOccupation) ?
            schema.nullable().required(requiredText) :
            schema.nullable()
    }),
    [PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO]: yup.string().when('relevantOccupation', (relevantOccupation: any, schema: any) => {
        return occupationsWithoutExtraInfo.find(element => element === relevantOccupation) ?
            schema.nullable() :
            schema.nullable().required(requiredText)
    }),
    [PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY]: yup.string().when('relevantOccupation', (relevantOccupation: any, schema: any) => {
        return (Occupations.EDUCATION_SYSTEM === relevantOccupation) ?
            schema.nullable().required(requiredText) :
            schema.nullable()
    }),
    [PersonalInfoDataContextFields.EDUCATION_CLASS_NUMBER]: yup.number().transform((value: any) => 
        (Boolean(value)) ? value : null).nullable().max(50, maxClassNumberError)
});

export default schema;
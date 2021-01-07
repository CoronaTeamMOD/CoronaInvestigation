import * as yup from 'yup';

import Occupations from 'models/enums/Occupations';
import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';
import { notRequiredPhoneNumberRegex, phoneNumberRegex } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

const occupationsWithInstitution = ['מערכת הבריאות', 'מערכת החינוך', 'כוחות הביטחון'];
const occupationsWithoutExtraInfo = ['מערכת הבריאות', 'מערכת החינוך', 'כוחות הביטחון', 'לא עובד'];
const requiredText = 'שגיאה: שדה חובה';
const numberValidationText = 'שגיאה: מספר אינו תקין';
const requiredSelectionText = 'שגיאה: יש לבחור מבין האפשרויות הקיימות';

const schema = yup.object().shape({
    [PersonalInfoDataContextFields.PHONE_NUMBER]: yup.string().nullable().required(requiredText).matches(phoneNumberRegex, numberValidationText),
    [PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER]: yup.string().nullable().matches(notRequiredPhoneNumberRegex, numberValidationText),
    [PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER]: yup.string().nullable().matches(notRequiredPhoneNumberRegex, numberValidationText),
    [PersonalInfoDataContextFields.INSURANCE_COMPANY]: yup.string().nullable().required(requiredText),
    [PersonalInfoDataContextFields.CITY]: yup.string().nullable().required(requiredText),
    [PersonalInfoDataContextFields.CONTACT_INFO]: yup.string().nullable(),
    [PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY]: yup.string().when(
        PersonalInfoDataContextFields.RELEVANT_OCCUPATION, 
        {
            is: 'מערכת החינוך',
            then: yup.string().nullable().required(requiredSelectionText),
            else: yup.string().nullable()
        }
    ),
    [PersonalInfoDataContextFields.INSTITUTION_NAME]: yup.string().when('relevantOccupation', (relevantOccupation: any, schema: any) => {
        return occupationsWithInstitution.find(element => element === relevantOccupation) ?
            schema.nullable().required(requiredSelectionText) :
            schema.nullable()
    }),
    [PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO]: yup.string().when('relevantOccupation', (relevantOccupation: any, schema: any) => {
        return occupationsWithoutExtraInfo.find(element => element === relevantOccupation) ?
            schema.nullable() :
            schema.nullable().required(requiredText)
    }),
    [PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY]: yup.string().when('relevantOccupation', (relevantOccupation: any, schema: any) => {
        return (Occupations.EDUCATION_SYSTEM === relevantOccupation) ?
            schema.nullable().required(requiredSelectionText) :
            schema.nullable()
    }),
    [PersonalInfoDataContextFields.EDUCATION_CLASS_NUMBER]: yup.number().transform((value: any) => 
        ((value === '' || isNaN(value)) ? null : value)).nullable().max(50, 'ניתן להזין עד המספר 50')
});

export default schema;

import * as yup from 'yup';
import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';

const schema = yup.object().shape({
    [PersonalInfoDataContextFields.PHONE_NUMBER]: yup.string().nullable().required('שגיאה: שדה חובה').matches(/^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$/,'שגיאה: מספר אינו תקין'),
    [PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER]: yup.string().nullable().matches(/^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))|^$/,'שגיאה: מספר אינו תקין'),
    [PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER]: yup.string().nullable().required('שגיאה: שדה חובה').matches(/^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$/,'שגיאה: מספר אינו תקין'),
    [PersonalInfoDataContextFields.INSURANCE_COMPANY]: yup.string().nullable().required('שגיאה: שדה חובה'),
    [PersonalInfoDataContextFields.CITY]: yup.string().nullable().required('שגיאה: שדה חובה'),
    [PersonalInfoDataContextFields.CONTACT_INFO]: yup.string().nullable().required('שגיאה: שדה חובה'),
    [PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY]:  yup.string().when(
        PersonalInfoDataContextFields.RELEVANT_OCCUPATION, {
            is: "מערכת החינוך",
            then: yup.string().nullable().required('שדה זה הינו שדה חובה'),
            else: yup.string().nullable()
        }
    ),
    [PersonalInfoDataContextFields.INSTITUTION_NAME]:  yup.string().when("relevantOccupation", (relevantOccupation:any, schema:any) => {
        return ["מערכת הבריאות", "מערכת החינוך","כוחות הביטחון"].find(element => element === relevantOccupation)? 
        schema.nullable().required('שדה זה הינו שדה חובה') : 
        schema.nullable()
    }),
    [PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO]:  yup.string().when("relevantOccupation", (relevantOccupation:any, schema:any) => {
        return ["מערכת הבריאות", "מערכת החינוך","כוחות הביטחון","לא עובד"].find(element => element === relevantOccupation)? 
        schema.nullable() :
        schema.nullable().required('שדה זה הינו שדה חובה')  
    }),
});

export default schema
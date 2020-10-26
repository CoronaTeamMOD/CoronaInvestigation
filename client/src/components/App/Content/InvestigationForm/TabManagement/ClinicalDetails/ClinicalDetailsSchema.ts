import * as yup from 'yup';
import { startOfTomorrow } from 'date-fns';

import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';

const requiredText = 'שדה זה הוא חובה';
const StartDateAfterEndDateText = 'תאריך ההתחלה צריך להיות מוקדם יותר מתאריך הסיום';
const EndDateBeforeStartDateText = 'תאריך הסיום צריך להיות מאוחר יותר מתאריך ההתחלה';
const futureDateText = 'שגיאה: לא ניתן להכניס תאריך עתידי';
const endDateBeforeValidationDateText = 'שגיאה: לא ניתן להכניס תאריך אחרי תאריך תחילת מחלה';

const isInIsolationStartDateSchema = yup.date().when(
    ClinicalDetailsFields.IS_IN_ISOLATION, {
        is: true,
        then: yup.date().when(ClinicalDetailsFields.ISOLATION_START_DATE, (isolationStartDate: Date) => {
            const startOfTomorrowDate = startOfTomorrow();
            return isolationStartDate < startOfTomorrowDate ?
                yup.date().max(yup.ref(ClinicalDetailsFields.ISOLATION_END_DATE), StartDateAfterEndDateText).required(requiredText).typeError(requiredText) :
                yup.date().max(startOfTomorrowDate, futureDateText).required(requiredText).typeError(requiredText)
        }),
        otherwise: yup.date().nullable()
    }
);

const isInIsolationEndDateSchema = (validationDate: Date) => yup.date().when(
    ClinicalDetailsFields.IS_IN_ISOLATION, {
        is: true,
        then: yup.date().when(ClinicalDetailsFields.ISOLATION_END_DATE, (isolationEndDate: Date) => {
            return validationDate < isolationEndDate ?
            yup.date().min(yup.ref(ClinicalDetailsFields.ISOLATION_START_DATE), StartDateAfterEndDateText).required(requiredText).typeError(requiredText) :
            yup.date().max(validationDate, endDateBeforeValidationDateText).required(requiredText).typeError(requiredText)
        }),
        otherwise: yup.date().nullable()
    }
);

const wasHospitilizedStartDateSchema = yup.date().when(
    ClinicalDetailsFields.WAS_HOPITALIZED, {
        is: true,
        then: yup.date().when(ClinicalDetailsFields.HOSPITALIZATION_START_DATE, (hospitalizationStartDate: Date) => {
            const startOfTomorrowDate = startOfTomorrow();
            return hospitalizationStartDate < startOfTomorrowDate ?
                yup.date().max(yup.ref(ClinicalDetailsFields.HOSPITALIZATION_END_DATE), StartDateAfterEndDateText).required(requiredText).typeError(requiredText) :
                yup.date().max(startOfTomorrowDate, futureDateText).required(requiredText).typeError(requiredText)
        }),
        otherwise: yup.date().nullable()
    }
);

const wasHospitilizedEndDateSchema = yup.date().when(
    ClinicalDetailsFields.WAS_HOPITALIZED, {
        is: true,
        then: yup.date().min(yup.ref(ClinicalDetailsFields.HOSPITALIZATION_START_DATE), EndDateBeforeStartDateText).required(requiredText).typeError(requiredText),
        otherwise: yup.date().nullable()
    }
);

const symptomsMoreInfoSchema = yup.string().when(
    ClinicalDetailsFields.SYMPTOMS,
    (symptoms: string[], schema: any) => {
        return symptoms.includes('אחר') ? schema.required(requiredText).nullable() : schema;
    }
);

const backgroundDiseasesMoreInfoSchema = yup.string().nullable().when(
    ClinicalDetailsFields.BACKGROUND_DESEASSES,
    (backgroundDiseases: string[], schema: any) => {
        return backgroundDiseases.includes('אחר') ? schema.required(requiredText).nullable() : schema;
    }
);

const ClinicalDetailsSchema = (validationDate: Date) => yup.object().shape({
    [ClinicalDetailsFields.ISOLATION_ADDRESS]: yup.object().shape({
        [ClinicalDetailsFields.ISOLATION_CITY]: yup.string().required(requiredText).nullable(),
        [ClinicalDetailsFields.ISOLATION_STREET]: yup.string().nullable(),
        [ClinicalDetailsFields.ISOLATION_FLOOR]: yup.string().nullable(),
        [ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER]: yup.string().nullable()
    }).required(),
    [ClinicalDetailsFields.IS_IN_ISOLATION]: yup.boolean().nullable().required(),
    [ClinicalDetailsFields.ISOLATION_START_DATE]: isInIsolationStartDateSchema,
    [ClinicalDetailsFields.ISOLATION_END_DATE]: isInIsolationEndDateSchema(validationDate),
    [ClinicalDetailsFields.IS_ISOLATION_PROBLEM]: yup.boolean().nullable().required(),
    [ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO]: yup.string().when(
        ClinicalDetailsFields.IS_ISOLATION_PROBLEM, {
            is: true,
            then: yup.string().required(requiredText),
            otherwise: yup.string().nullable()
        }),
    [ClinicalDetailsFields.DOES_HAVE_SYMPTOMS]: yup.boolean().nullable().required(),
    [ClinicalDetailsFields.IS_SYMPTOMS_DATE_UNKNOWN]: yup.boolean().nullable().when(ClinicalDetailsFields.DOES_HAVE_SYMPTOMS, {
        is: true,
        then: yup.boolean().nullable().required(),
        otherwise: yup.boolean().nullable().nullable()
    }),
    [ClinicalDetailsFields.SYMPTOMS_START_DATE]: yup.date().when([ClinicalDetailsFields.DOES_HAVE_SYMPTOMS, ClinicalDetailsFields.IS_SYMPTOMS_DATE_UNKNOWN],
        (doesHaveSymptoms: boolean, isSymptomsDateUnknown: boolean, schema: any) => {
            if(doesHaveSymptoms && isSymptomsDateUnknown) {
                return schema.nullable();
            } else if(!doesHaveSymptoms) {
                return schema.nullable();
            }
            return schema.required(requiredText).typeError(requiredText);
        }),
    [ClinicalDetailsFields.SYMPTOMS]: yup.array().of(yup.string()).when(
        ClinicalDetailsFields.DOES_HAVE_SYMPTOMS, {
            is: true,
            then: yup.array().of(yup.string()).min(1).required(),
            otherwise: yup.array().of(yup.string())
        }),
    [ClinicalDetailsFields.OTHER_SYMPTOMS_MORE_INFO]: symptomsMoreInfoSchema,
    [ClinicalDetailsFields.DOES_HAVE_BACKGROUND_DISEASES]: yup.boolean().nullable().required(),
    [ClinicalDetailsFields.BACKGROUND_DESEASSES]: yup.array().of(yup.string()).when(
        ClinicalDetailsFields.DOES_HAVE_BACKGROUND_DISEASES, {
            is: true,
            then: yup.array().of(yup.string()).min(1).required(),
            otherwise: yup.array().of(yup.string())
        }),
    [ClinicalDetailsFields.WAS_HOPITALIZED]: yup.boolean().nullable().required(),
    [ClinicalDetailsFields.HOSPITAL]: yup.string().nullable(),
    [ClinicalDetailsFields.HOSPITALIZATION_START_DATE]: wasHospitilizedStartDateSchema,
    [ClinicalDetailsFields.HOSPITALIZATION_END_DATE]: wasHospitilizedEndDateSchema,
    [ClinicalDetailsFields.IS_PREGNANT]: yup.boolean().nullable().required(),
    [ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO]: backgroundDiseasesMoreInfoSchema,
});

export default ClinicalDetailsSchema;
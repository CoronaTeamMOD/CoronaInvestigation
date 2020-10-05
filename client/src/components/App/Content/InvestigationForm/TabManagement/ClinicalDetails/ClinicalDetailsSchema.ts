import * as yup from "yup";

import ClinicalDetailsFields from "models/enums/ClinicalDetailsFields";

const requiredText = 'שדה זה הוא חובה';
const maxText = 'תאריך ההתחלה צריך להיות מוקדם יותר מתאריך הסיום';
const minText = 'תאריך הסיום צריך להיות מוקדם יותר מתאריך ההתחלה';

const isInIsolationStartDateSchema = yup.date().when(
    ClinicalDetailsFields.IS_IN_ISOLATION, {
    is: true,
    then: yup.date().max(yup.ref(ClinicalDetailsFields.ISOLATION_END_DATE), maxText)
    .required(requiredText).typeError(requiredText),
    otherwise: yup.date().nullable()
});

const isInIsolationEndDateSchema = yup.date().when(
    ClinicalDetailsFields.IS_IN_ISOLATION, {
    is: true,
    then: yup.date().min(yup.ref(ClinicalDetailsFields.ISOLATION_START_DATE), minText)
    .required(requiredText).typeError(requiredText),
    otherwise: yup.date().nullable()
});

const wasHospitilizedStartDateSchema = yup.date().when(
    ClinicalDetailsFields.WAS_HOPITALIZED, {
    is: true,
    then: yup.date().max(yup.ref(ClinicalDetailsFields.HOSPITALIZATION_END_DATE), maxText)
    .required(requiredText).typeError(requiredText),
    otherwise: yup.date().nullable()
});

const wasHospitilizedEndDateSchema = yup.date().when(
    ClinicalDetailsFields.WAS_HOPITALIZED, {
    is: true,
    then: yup.date().min(yup.ref(ClinicalDetailsFields.HOSPITALIZATION_START_DATE), minText)
    .required(requiredText).typeError(requiredText),
    otherwise: yup.date().nullable()
});

const symptomsMoreInfoSchema = yup.string().when(
    ClinicalDetailsFields.SYMPTOMS,
    (symptoms: string[], schema: any) => {
        return symptoms.includes('אחר')? schema.required(requiredText) : schema;
    }
);

const backgroundDiseasesMoreInfoSchema = yup.string().nullable().when(
    ClinicalDetailsFields.BACKGROUND_DESEASSES,
    (backgroundDiseases: string[], schema: any) => {
        return backgroundDiseases.includes('אחר')? schema.required(requiredText) : schema;
    }
);

const ClinicalDetailsSchema = yup.object().shape({
    [ClinicalDetailsFields.ISOLATION_ADDRESS]: yup.object().shape({
        [ClinicalDetailsFields.ISOLATION_CITY]: yup.string().required(requiredText),
        [ClinicalDetailsFields.ISOLATION_STREET]: yup.string().required(requiredText),
        [ClinicalDetailsFields.ISOLATION_FLOOR]: yup.string().required(requiredText),
        [ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER]: yup.string().required(requiredText)
    }).required(),
    [ClinicalDetailsFields.IS_IN_ISOLATION]: yup.boolean().required(),
    [ClinicalDetailsFields.ISOLATION_START_DATE]: isInIsolationStartDateSchema,
    [ClinicalDetailsFields.ISOLATION_END_DATE]: isInIsolationEndDateSchema,
    [ClinicalDetailsFields.IS_ISOLATION_PROBLEM]: yup.boolean().required(),
    [ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO]: yup.string().when(
        ClinicalDetailsFields.IS_ISOLATION_PROBLEM, {
        is: true,
        then: yup.string().required(requiredText),
        otherwise: yup.string()
    }),
    [ClinicalDetailsFields.DOES_HAVE_SYMPTOMS]: yup.boolean().required(),
    [ClinicalDetailsFields.SYMPTOMS_START_DATE]: yup.date().when(
        ClinicalDetailsFields.DOES_HAVE_SYMPTOMS, {
        is: true,
        then: yup.date().required(requiredText).typeError(requiredText),
        otherwise: yup.date().nullable()
    }
    ),
    [ClinicalDetailsFields.SYMPTOMS]: yup.array().of(yup.string()).when(
        ClinicalDetailsFields.DOES_HAVE_SYMPTOMS, {
        is: true,
        then: yup.array().of(yup.string()).min(1).required(),
        otherwise: yup.array().of(yup.string())
    }),
    [ClinicalDetailsFields.OTHER_SYMPTOMS_MORE_INFO]: symptomsMoreInfoSchema,
    [ClinicalDetailsFields.DOES_HAVE_BACKGROUND_DISEASES]: yup.boolean().required(),
    [ClinicalDetailsFields.BACKGROUND_DESEASSES]: yup.array().of(yup.string()).when(
        ClinicalDetailsFields.DOES_HAVE_BACKGROUND_DISEASES, {
        is: true,
        then: yup.array().of(yup.string()).min(1).required(),
        otherwise: yup.array().of(yup.string())
    }),
    [ClinicalDetailsFields.WAS_HOPITALIZED]: yup.boolean().required(),
    [ClinicalDetailsFields.HOSPITAL]: yup.string(),
    [ClinicalDetailsFields.HOSPITALIZATION_START_DATE]: wasHospitilizedStartDateSchema,
    [ClinicalDetailsFields.HOSPITALIZATION_END_DATE]: wasHospitilizedEndDateSchema,
    [ClinicalDetailsFields.IS_PREGNANT]: yup.boolean().required(),
    [ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO]: backgroundDiseasesMoreInfoSchema,
});

export default ClinicalDetailsSchema;
import * as yup from 'yup';
import { startOfTomorrow, subDays } from 'date-fns';

import { requiredText, invalidDateText, max10LengthErrorMessage } from 'commons/Schema/messages';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import { getMinimalSymptomsStartDate, getMinimalStartIsolationDate, maxInvestigatedDays, maxIsolationDays } from 'Utils/ClinicalDetails/symptomsUtils';

const StartDateAfterEndDateText = 'תאריך ההתחלה צריך להיות מוקדם יותר מתאריך הסיום';
const EndDateBeforeStartDateText = 'תאריך הסיום צריך להיות מאוחר יותר מתאריך ההתחלה';
const futureDateText = 'לא ניתן לבחור תאריך עתידי';
const endDateBeforeValidationDateText = 'לא ניתן לבחור תאריך אחרי תאריך תחילת מחלה';
const symptomsStartDateIsTooEarlyText = `לא ניתן לבחור תאריך יותר מ${maxInvestigatedDays} ימים לפני תאריך תחילת מחלה`;
const isolationStartDateIsTooEarlyText = `לא ניתן לבחור תאריך יותר מ${maxIsolationDays} ימים לפני תאריך תחילת מחלה`;
const mustBeCheckedText = 'השדה חייב להיות מסומן';

const isInIsolationStartDateSchema = (validationDate: Date) => yup.date().when(
    ClinicalDetailsFields.IS_IN_ISOLATION, {
        is: true,
        then: yup.date().when(ClinicalDetailsFields.ISOLATION_START_DATE, (isolationStartDate: Date) => {
            const startOfTomorrowDate = startOfTomorrow();
            return validationDate > isolationStartDate ?
                    isolationStartDate < startOfTomorrowDate ?
                        isolationStartDate < getMinimalStartIsolationDate(validationDate) ?
                            yup.date().min(getMinimalStartIsolationDate(validationDate), isolationStartDateIsTooEarlyText).required(requiredText).typeError(invalidDateText) :
                            yup.date().max(yup.ref(ClinicalDetailsFields.ISOLATION_END_DATE), StartDateAfterEndDateText).required(requiredText).typeError(invalidDateText) :
                    yup.date().max(startOfTomorrowDate, futureDateText).required(requiredText).typeError(invalidDateText) :
                yup.date().max(validationDate, endDateBeforeValidationDateText).required(requiredText).typeError(invalidDateText)
        }),
        otherwise: yup.date().nullable()
    }
);

const isInIsolationEndDateSchema = (validationDate: Date) => yup.date().when(
    ClinicalDetailsFields.IS_IN_ISOLATION, {
        is: true,
        then: yup.date().when(ClinicalDetailsFields.ISOLATION_END_DATE, (isolationEndDate: Date) => {
            return new Date(validationDate) > isolationEndDate ?
            yup.date().min(yup.ref(ClinicalDetailsFields.ISOLATION_START_DATE), StartDateAfterEndDateText).required(requiredText).typeError(invalidDateText) :
            yup.date().max(validationDate, endDateBeforeValidationDateText).required(requiredText).typeError(invalidDateText)
        }),
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
const ClinicalDetailsSchema = (validationDate: Date, Gender: string) => {
    return yup.object().shape({
        [ClinicalDetailsFields.ISOLATION_ADDRESS]: yup.object().shape({
            [ClinicalDetailsFields.ISOLATION_CITY]: yup.string().required(requiredText).nullable(),
            [ClinicalDetailsFields.ISOLATION_STREET]: yup.string().nullable(),
            [ClinicalDetailsFields.ISOLATION_APARTMENT]: yup.string().nullable().max(10, max10LengthErrorMessage),
            [ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER]: yup.string().nullable().max(10, max10LengthErrorMessage)
        }).required(),
        [ClinicalDetailsFields.ISOLATION_START_DATE]: isInIsolationStartDateSchema(validationDate),
        [ClinicalDetailsFields.ISOLATION_END_DATE]: isInIsolationEndDateSchema(validationDate),
        [ClinicalDetailsFields.ISOLATION_SOURCE]: yup.number().when(
            ClinicalDetailsFields.IS_IN_ISOLATION, {
                is: true,
                then: yup.number().nullable().required(),
                otherwise: yup.number().nullable()
            }
        ),
        [ClinicalDetailsFields.IS_ISOLATION_PROBLEM]: yup.boolean().required(requiredText).nullable(),
        [ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO]: yup.string().when(
            ClinicalDetailsFields.IS_ISOLATION_PROBLEM, {
                is: true,
                then: yup.string().required(requiredText),
                otherwise: yup.string().nullable()
            }),
        [ClinicalDetailsFields.DOES_HAVE_SYMPTOMS]: yup.boolean().required(requiredText).nullable(),
        [ClinicalDetailsFields.IS_SYMPTOMS_DATE_UNKNOWN]: yup.boolean().nullable().when(ClinicalDetailsFields.DOES_HAVE_SYMPTOMS, {
            is: true,
            then: yup.boolean().nullable().required(),
            otherwise: yup.boolean().nullable()
        }),
        [ClinicalDetailsFields.SYMPTOMS_START_DATE]: yup.date().when([ClinicalDetailsFields.DOES_HAVE_SYMPTOMS, ClinicalDetailsFields.IS_SYMPTOMS_DATE_UNKNOWN],
            (doesHaveSymptoms: boolean, isSymptomsDateUnknown: boolean, schema: any) => {
                if(doesHaveSymptoms && isSymptomsDateUnknown) {
                    return schema.nullable();
                } else if(!doesHaveSymptoms) {
                    return schema.nullable();
                }
                return yup.date().required(requiredText).typeError(invalidDateText)
                .min(subDays(getMinimalSymptomsStartDate(validationDate), 1), symptomsStartDateIsTooEarlyText);
            }),
        [ClinicalDetailsFields.SYMPTOMS]: yup.array().of(yup.string()).when(
            ClinicalDetailsFields.DOES_HAVE_SYMPTOMS, {
                is: true,
                then: yup.array().of(yup.string()).min(1).required(),
                otherwise: yup.array().of(yup.string())
            }),
        [ClinicalDetailsFields.OTHER_SYMPTOMS_MORE_INFO]: symptomsMoreInfoSchema,
        [ClinicalDetailsFields.DOES_HAVE_BACKGROUND_DISEASES]: yup.boolean().required(requiredText).nullable(),
        [ClinicalDetailsFields.BACKGROUND_DESEASSES]: yup.array().of(yup.string()).when(
            ClinicalDetailsFields.DOES_HAVE_BACKGROUND_DISEASES, {
                is: true,
                then: yup.array().of(yup.string()).min(1).required(),
                otherwise: yup.array().of(yup.string())
            }),
        [ClinicalDetailsFields.IS_PREGNANT]: Gender === 'נקבה' ? yup.boolean().nullable().required(requiredText) :  yup.boolean().nullable(),
        [ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO]: backgroundDiseasesMoreInfoSchema,
        [ClinicalDetailsFields.WAS_INSTRUCTED_TO_BE_IN_ISOLATION]: yup.bool().oneOf([true], mustBeCheckedText)
    })
};

export default ClinicalDetailsSchema;
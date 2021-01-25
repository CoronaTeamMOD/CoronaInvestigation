import * as yup from 'yup';

import { ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX } from 'commons/Regex/Regex';

import GroupedInvestigationsFields from './GroupedInvestigationsFields';

const reasonRequiredMessage = 'יש לבחור סיבה';
const otherRequiredMessage = 'יש לכתוב סיבה';
const errorMessage = 'סיבה לא תקנית';
const maxLengthErrorMessage = 'הסיבה חייבת להיות עד 200 תווים';

export const OTHER = 100000003;

const schema = yup.object().shape({
    [GroupedInvestigationsFields.REASON]: yup.object().shape({
        id: yup.number(),
        displayName: yup.string()
    }).nullable().required(reasonRequiredMessage),
    [GroupedInvestigationsFields.OTHER_REASON]: yup.string().when(
        [GroupedInvestigationsFields.REASON], {
            is: reasonValue => reasonValue?.id === OTHER,
            then: yup.string().nullable().required(otherRequiredMessage)
                              .matches(ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX , errorMessage)
                              .max(200, maxLengthErrorMessage),
            otherwise: yup.string().nullable()
        }
    ) 

});

export default schema;
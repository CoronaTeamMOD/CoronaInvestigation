import * as yup from 'yup';

import { ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX } from 'commons/Regex/Regex';

import TransferInvestigationInputsNames from './TransferInvestigationInputsNames';

const errorMessage = 'סיבה לא תקנית';
const countyRequiredMessage = 'יש לבחור נפה';
const reasonRequiredMessage = 'יש לכתוב סיבה';
const maxLengthErrorMessage = 'הסיבה חייבת להיות עד 200 תווים';

const schema = yup.object().shape({
    [TransferInvestigationInputsNames.COUNTY]: yup.object().shape({
        id: yup.number(),
        displayName: yup.string()
    }).nullable().required(countyRequiredMessage),
    [TransferInvestigationInputsNames.REASON]: yup.string()
        .required(reasonRequiredMessage)
        .matches(ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX, errorMessage)
        .max(200, maxLengthErrorMessage)

});

export default schema;
import * as yup from 'yup';

import { TRANSFER_REASON_REGEX } from 'commons/Regex/Regex';

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
        .matches(TRANSFER_REASON_REGEX, errorMessage)
        .max(200, maxLengthErrorMessage)

});

export default schema;
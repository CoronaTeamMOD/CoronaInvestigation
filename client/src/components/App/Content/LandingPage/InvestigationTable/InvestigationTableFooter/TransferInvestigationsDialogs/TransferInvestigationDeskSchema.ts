import * as yup from 'yup';

import { ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX } from 'commons/Regex/Regex';

import TransferInvestigationInputsNames from './TransferInvestigationInputsNames';

const errorMessage = 'סיבה לא תקנית';
const deskRequiredMessage = 'יש לבחור דסק';
const maxLengthErrorMessage = 'הסיבה חייבת להיות עד 200 תווים';

const schema = yup.object().shape({
    [TransferInvestigationInputsNames.DESK]: yup.object().shape({
        id: yup.number().nullable(),
        deskName: yup.string()
    }).nullable().required(deskRequiredMessage),
    [TransferInvestigationInputsNames.REASON]: yup.string()
        .matches(ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX, errorMessage)
        .max(200, maxLengthErrorMessage)

});

export default schema;

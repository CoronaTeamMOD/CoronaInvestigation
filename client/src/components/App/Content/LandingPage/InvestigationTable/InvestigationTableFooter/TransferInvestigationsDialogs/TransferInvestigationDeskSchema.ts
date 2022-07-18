import * as yup from 'yup';

import { ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX } from 'commons/Regex/Regex';

import TransferInvestigationInputsNames from './TransferInvestigationInputsNames';
import KeyValuePair from 'models/KeyValuePair';
import { TransferReasonCodes } from 'models/enums/TransferReasonCodes';

const errorMessage = 'סיבה לא תקנית';
const deskRequiredMessage = 'יש לבחור דסק';
const reasonRequiredMessage = 'יש לכתוב סיבה';
const maxLengthErrorMessage = 'הסיבה חייבת להיות עד 200 תווים';

const schema = yup.object().shape({
    [TransferInvestigationInputsNames.DESK]: yup.object().shape({
        id: yup.number().nullable(),
        deskName: yup.string()
    }).nullable().required(deskRequiredMessage),
    [TransferInvestigationInputsNames.REASON]: yup.object().shape({
        id: yup.number(),
        displayName: yup.string()
    }).nullable().required(reasonRequiredMessage),
    [TransferInvestigationInputsNames.OTHER_REASON]: yup.string().when(
        TransferInvestigationInputsNames.REASON,
        (REASON: KeyValuePair) => {
            return REASON.id == TransferReasonCodes.ANOTHER ?
                yup.string().nullable().required(reasonRequiredMessage)
                    .matches(ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX, errorMessage)
                    .max(200, maxLengthErrorMessage)
                : yup.object().nullable();
        }
    )

});

export default schema;

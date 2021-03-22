import * as yup from 'yup';

import { ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX } from 'commons/Regex/Regex';
import { alphaNumericSpecialCharsErrorMessage, max50LengthErrorMessage, requiredText } from 'commons/Schema/messages';

import { transferredSubStatus } from 'components/App/Content/LandingPage/InvestigationTable/useInvestigationTable';

const validationStatusSchema = (subStatus: string | null) => {
    return (
        subStatus === transferredSubStatus ?
        yup.string().required(requiredText).matches(ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX, alphaNumericSpecialCharsErrorMessage).max(50, max50LengthErrorMessage).nullable() :
        yup.string().matches(ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX, alphaNumericSpecialCharsErrorMessage).max(50, max50LengthErrorMessage).nullable()   
    )
};

export default validationStatusSchema;
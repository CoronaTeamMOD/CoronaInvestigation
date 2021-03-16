import * as yup from 'yup';

import { ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX } from 'commons/Regex/Regex';
import { transferredSubStatus } from 'components/App/Content/LandingPage/InvestigationTable/useInvestigationTable';

const maxLengthErrorMessage = 'השדה יכול להכיל 50 תוים בלבד';
const errorMessage = 'השדה יכול להכניס רק תווים חוקיים';
const requiredMessage = 'שדה זה הינו שדה חובה';

const validationStatusSchema = (subStatus: string | null) => {
    return (
        subStatus === transferredSubStatus ?
        yup.string().required(requiredMessage).matches(ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX, errorMessage).max(50, maxLengthErrorMessage).nullable() :
        yup.string().matches(ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX, errorMessage).max(50, maxLengthErrorMessage).nullable()   
    )
};

export default validationStatusSchema;
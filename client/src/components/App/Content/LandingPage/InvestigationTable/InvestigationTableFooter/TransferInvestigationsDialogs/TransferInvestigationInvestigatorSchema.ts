import * as yup from 'yup';

import TransferInvestigationInvestigatorInputNames from './TransferInvestigationInvestigatorInputNames';

const errorMessage = 'סיבה לא תקנית';
const investigatorRequiredMessage = 'יש לבחור חוקר';
const maxLengthErrorMessage = 'הסיבה חייבת להיות עד 200 תווים';

const schema = yup.object().shape<{[T in TransferInvestigationInvestigatorInputNames]: any}>({
    [TransferInvestigationInvestigatorInputNames.INVESTIGATOR]: yup.object().shape({
        id: yup.string(),
        value: yup.object()
    }).nullable().required(investigatorRequiredMessage),
    [TransferInvestigationInvestigatorInputNames.REASON]: yup.string()
                                                             .matches( /^[a-zA-Z\u0590-\u05fe\s0-9-+*!?'"():_,.\/\\]*$/, errorMessage)
                                                             .max(200, maxLengthErrorMessage)
});

export default schema;
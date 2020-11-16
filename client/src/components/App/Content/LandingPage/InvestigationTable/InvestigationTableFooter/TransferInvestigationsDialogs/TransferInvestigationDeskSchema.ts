import * as yup from 'yup';

import TransferInvestigationDeskInputsNames from './TransferInvestigationDeskInputsNames';

const errorMessage = 'סיבה לא תקנית';
const deskRequiredMessage = 'יש לבחור דסק';
const reasonRequiredMessage = 'יש לכתוב סיבה';
const maxLengthErrorMessage = 'הסיבה חייבת להיות עד 200 תווים';

const schema = yup.object().shape({
    [TransferInvestigationDeskInputsNames.DESK]: yup.object().shape({
        id: yup.number(),
        deskName: yup.string()
    }).nullable().required(deskRequiredMessage),
    [TransferInvestigationDeskInputsNames.REASON]: yup.string()
                                                      .required(reasonRequiredMessage)
                                                      .matches( /^[a-zA-Z\u0590-\u05fe\s0-9-+*!?'"():_,.\/\\]*$/, errorMessage)
                                                      .max(200, maxLengthErrorMessage)

});

export default schema;

import * as yup from 'yup';
import { subDays } from 'date-fns';

import { requiredText } from 'commons/Schema/messages';
import { fieldsNames } from 'commons/Contexts/ExposuresAndFlights';

const endDateBeforeValidationDateText = 'תאריך לא יכול להיות יותר מאוחר מתאריך תחילת מחלה';
const twoWeeksBeforeValidationDateText = 'תאריך לא יכול להיות יותר קטן משבועיים מתאריך תחילת מחלה';

const exposureValidation = (validationDate : Date) : yup.Schema<any, object>  => {
    return (yup.object().shape({
        [fieldsNames.exposureSource]: yup.object().nullable().required(requiredText),
        [fieldsNames.date]: yup.date().nullable().required(requiredText)
                                                 .max(validationDate , endDateBeforeValidationDateText)
                                                 .min(subDays(new Date(validationDate) , 14), twoWeeksBeforeValidationDateText),
        [fieldsNames.address]: yup.object().nullable(),
        [fieldsNames.placeType]: yup.string().nullable(),
        [fieldsNames.placeSubType]: yup.number().nullable()
    }))
};

export default exposureValidation;